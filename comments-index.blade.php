@extends('layouts.app')

@section('content')
<div class="container mt-4">
    <div class="row mb-4">
        <div class="col-md-12">
            <h1 class="mb-3">Comments Management</h1>
        </div>
    </div>

    <!-- Flash Messages -->
    @if ($errors->any())
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong>
            <ul class="mb-0">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif

    @if (session('success'))
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="fas fa-check-circle me-2"></i>{{ session('success') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif

    @if (session('error'))
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="fas fa-exclamation-circle me-2"></i>{{ session('error') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif

    <!-- Filters Section -->
    <div class="card mb-4">
        <div class="card-header bg-light">
            <div class="d-flex justify-content-between align-items-center cursor-pointer" data-bs-toggle="collapse" data-bs-target="#filtersCollapse" aria-expanded="true" aria-controls="filtersCollapse">
                <h5 class="mb-0"><i class="fas fa-filter me-2"></i>Filters</h5>
                <i class="fas fa-chevron-up" id="filterIcon"></i>
            </div>
        </div>
        <div class="collapse show" id="filtersCollapse">
            <div class="card-body">
                <form method="GET" action="{{ route('comments.index') }}" class="row g-3">
                    <div class="col-md-3">
                        <label for="status" class="form-label">Status</label>
                        <select class="form-select" id="status" name="status">
                            <option value="">All</option>
                            <option value="pending" {{ request('status') === 'pending' ? 'selected' : '' }}>Pending</option>
                            <option value="approved" {{ request('status') === 'approved' ? 'selected' : '' }}>Approved</option>
                            <option value="rejected" {{ request('status') === 'rejected' ? 'selected' : '' }}>Rejected</option>
                        </select>
                    </div>

                    <div class="col-md-3">
                        <label for="article_type" class="form-label">Article Type</label>
                        <input type="text" class="form-control" id="article_type" name="article_type" placeholder="e.g., blog, news" value="{{ request('article_type') }}">
                    </div>

                    <div class="col-md-3">
                        <label for="article_key" class="form-label">Article Key</label>
                        <input type="text" class="form-control" id="article_key" name="article_key" placeholder="e.g., slug-or-id" value="{{ request('article_key') }}">
                    </div>

                    <div class="col-md-3">
                        <label for="search" class="form-label">Name / Email</label>
                        <input type="text" class="form-control" id="search" name="search" placeholder="Search by name or email" value="{{ request('search') }}">
                    </div>

                    <div class="col-md-3">
                        <label for="date_from" class="form-label">From Date</label>
                        <input type="date" class="form-control" id="date_from" name="date_from" value="{{ request('date_from') }}">
                    </div>

                    <div class="col-md-3">
                        <label for="date_to" class="form-label">To Date</label>
                        <input type="date" class="form-control" id="date_to" name="date_to" value="{{ request('date_to') }}">
                    </div>

                    <div class="col-md-6 d-flex align-items-end gap-2">
                        <button type="submit" class="btn btn-primary"><i class="fas fa-search me-2"></i>Filter</button>
                        <a href="{{ route('comments.index') }}" class="btn btn-secondary"><i class="fas fa-redo me-2"></i>Reset</a>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Bulk Actions Section -->
    @if ($comments->count() > 0)
        <div class="card mb-3 bg-light">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <small class="text-muted">
                            <i class="fas fa-info-circle me-2"></i>
                            Select comments to perform bulk actions
                        </small>
                    </div>
                    <div class="col-md-6 text-end">
                        <div class="btn-group btn-group-sm" role="group">
                            <button type="button" class="btn btn-outline-success" id="bulkApprove" disabled>
                                <i class="fas fa-check me-2"></i>Approve Selected
                            </button>
                            <button type="button" class="btn btn-outline-warning" id="bulkReject" disabled>
                                <i class="fas fa-times me-2"></i>Reject Selected
                            </button>
                            <button type="button" class="btn btn-outline-danger" id="bulkDelete" disabled>
                                <i class="fas fa-trash me-2"></i>Delete Selected
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    @endif

    <!-- Comments Table -->
    @if ($comments->count() > 0)
        <div class="card">
            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead class="table-light">
                        <tr>
                            <th style="width: 40px;">
                                <input type="checkbox" id="selectAll" class="form-check-input" title="Select all">
                            </th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Article</th>
                            <th>Message</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th style="width: 200px;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($comments as $comment)
                            <tr>
                                <td>
                                    <input type="checkbox" class="form-check-input comment-checkbox" value="{{ $comment->id }}" data-status="{{ $comment->status }}">
                                </td>
                                <td>
                                    <strong>{{ $comment->name }}</strong>
                                </td>
                                <td>
                                    <small class="text-muted">{{ $comment->email }}</small>
                                </td>
                                <td>
                                    <small>
                                        <strong>{{ $comment->article_type }}</strong><br>
                                        <code class="text-muted">{{ $comment->article_key }}</code>
                                    </small>
                                </td>
                                <td>
                                    <small class="text-muted">
                                        {{ Str::limit($comment->message, 100) }}
                                    </small>
                                </td>
                                <td>
                                    @if ($comment->status === 'pending')
                                        <span class="badge bg-warning text-dark"><i class="fas fa-hourglass-half me-1"></i>Pending</span>
                                    @elseif ($comment->status === 'approved')
                                        <span class="badge bg-success"><i class="fas fa-check-circle me-1"></i>Approved</span>
                                    @elseif ($comment->status === 'rejected')
                                        <span class="badge bg-danger"><i class="fas fa-times-circle me-1"></i>Rejected</span>
                                    @endif
                                </td>
                                <td>
                                    <small>{{ $comment->created_at->format('M d, Y H:i') }}</small>
                                </td>
                                <td>
                                    <a href="{{ route('comments.show', $comment->id) }}" class="btn btn-sm btn-info" title="View">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                    @if ($comment->status !== 'approved')
                                        <form action="{{ route('comments.approve', $comment->id) }}" method="POST" style="display: inline;">
                                            @csrf
                                            <button type="submit" class="btn btn-sm btn-success" title="Approve" onclick="return confirm('Approve this comment?')">
                                                <i class="fas fa-check"></i>
                                            </button>
                                        </form>
                                    @endif
                                    @if ($comment->status !== 'rejected')
                                        <form action="{{ route('comments.reject', $comment->id) }}" method="POST" style="display: inline;">
                                            @csrf
                                            <button type="submit" class="btn btn-sm btn-warning" title="Reject" onclick="return confirm('Reject this comment?')">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </form>
                                    @endif
                                    <form action="{{ route('comments.destroy', $comment->id) }}" method="POST" style="display: inline;">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-sm btn-danger" title="Delete" onclick="return confirm('Are you sure? This action cannot be undone.')">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Pagination -->
        <div class="mt-4">
            {{ $comments->links() }}
        </div>
    @else
        <div class="alert alert-info text-center py-5">
            <i class="fas fa-inbox fa-3x mb-3" style="opacity: 0.5;"></i>
            <p class="mb-0"><strong>No comments found</strong></p>
            <p class="text-muted">There are no comments matching your filters. Try adjusting your search criteria.</p>
        </div>
    @endif
</div>

<!-- Bulk Action Forms (Hidden) -->
<form id="bulkApproveForm" action="{{ route('comments.bulk-approve') }}" method="POST" style="display: none;">
    @csrf
    <input type="hidden" name="ids" id="bulkApproveIds">
</form>

<form id="bulkRejectForm" action="{{ route('comments.bulk-reject') }}" method="POST" style="display: none;">
    @csrf
    <input type="hidden" name="ids" id="bulkRejectIds">
</form>

<form id="bulkDeleteForm" action="{{ route('comments.bulk-delete') }}" method="POST" style="display: none;">
    @csrf
    <input type="hidden" name="ids" id="bulkDeleteIds">
</form>

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const commentCheckboxes = document.querySelectorAll('.comment-checkbox');
    const bulkApproveBtn = document.getElementById('bulkApprove');
    const bulkRejectBtn = document.getElementById('bulkReject');
    const bulkDeleteBtn = document.getElementById('bulkDelete');
    const filterIcon = document.getElementById('filterIcon');
    const filtersCollapse = document.getElementById('filtersCollapse');

    // Toggle filter icon
    filtersCollapse.addEventListener('show.bs.collapse', function() {
        filterIcon.classList.remove('fa-chevron-up');
        filterIcon.classList.add('fa-chevron-down');
    });

    filtersCollapse.addEventListener('hide.bs.collapse', function() {
        filterIcon.classList.remove('fa-chevron-down');
        filterIcon.classList.add('fa-chevron-up');
    });

    // Select all checkboxes
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            commentCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateBulkButtons();
        });
    }

    // Update bulk buttons when individual checkboxes change
    commentCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateBulkButtons();
            if (!this.checked && selectAllCheckbox) {
                selectAllCheckbox.checked = false;
            }
        });
    });

    // Update bulk action buttons state
    function updateBulkButtons() {
        const checkedBoxes = document.querySelectorAll('.comment-checkbox:checked');
        const hasChecked = checkedBoxes.length > 0;
        
        bulkApproveBtn.disabled = !hasChecked;
        bulkRejectBtn.disabled = !hasChecked;
        bulkDeleteBtn.disabled = !hasChecked;
    }

    // Bulk approve
    if (bulkApproveBtn) {
        bulkApproveBtn.addEventListener('click', function() {
            if (!confirm('Approve all selected comments?')) return;
            const ids = Array.from(document.querySelectorAll('.comment-checkbox:checked')).map(cb => cb.value).join(',');
            document.getElementById('bulkApproveIds').value = ids;
            document.getElementById('bulkApproveForm').submit();
        });
    }

    // Bulk reject
    if (bulkRejectBtn) {
        bulkRejectBtn.addEventListener('click', function() {
            if (!confirm('Reject all selected comments?')) return;
            const ids = Array.from(document.querySelectorAll('.comment-checkbox:checked')).map(cb => cb.value).join(',');
            document.getElementById('bulkRejectIds').value = ids;
            document.getElementById('bulkRejectForm').submit();
        });
    }

    // Bulk delete
    if (bulkDeleteBtn) {
        bulkDeleteBtn.addEventListener('click', function() {
            if (!confirm('Delete all selected comments? This action cannot be undone.')) return;
            const ids = Array.from(document.querySelectorAll('.comment-checkbox:checked')).map(cb => cb.value).join(',');
            document.getElementById('bulkDeleteIds').value = ids;
            document.getElementById('bulkDeleteForm').submit();
        });
    }
});
</script>
@endpush
