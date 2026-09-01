@extends('layouts.app')

@section('content')
<div class="container mt-4">
    <div class="mb-4">
        <a href="{{ route('comments.index') }}" class="btn btn-secondary">
            <i class="fas fa-arrow-left me-2"></i>Back to Comments
        </a>
    </div>

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

    <div class="row">
        <div class="col-md-8">
            <!-- Comment Details -->
            <div class="card mb-4">
                <div class="card-header bg-light">
                    <h5 class="mb-0"><i class="fas fa-envelope me-2"></i>Comment Details</h5>
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label text-muted">Name</label>
                            <p class="fs-5"><strong>{{ $comment->name }}</strong></p>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted">Email</label>
                            <p class="fs-5">
                                <a href="mailto:{{ $comment->email }}">{{ $comment->email }}</a>
                            </p>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label text-muted">Article Type</label>
                            <p class="fs-5"><strong>{{ $comment->article_type }}</strong></p>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted">Article Key</label>
                            <p class="fs-5"><code>{{ $comment->article_key }}</code></p>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label text-muted">Created At</label>
                            <p class="fs-5">{{ $comment->created_at->format('M d, Y H:i:s') }}</p>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted">IP Address</label>
                            <p class="fs-5"><code>{{ $comment->ip_address ?? 'N/A' }}</code></p>
                        </div>
                    </div>

                    <hr>

                    <label class="form-label text-muted">Message</label>
                    <div class="card bg-light">
                        <div class="card-body">
                            <p>{{ $comment->message }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Message Preview (Read-only Textarea) -->
            <div class="card mb-4">
                <div class="card-header bg-light">
                    <h5 class="mb-0"><i class="fas fa-comment me-2"></i>Full Message</h5>
                </div>
                <div class="card-body">
                    <textarea class="form-control" rows="8" readonly>{{ $comment->message }}</textarea>
                </div>
            </div>
        </div>

        <div class="col-md-4">
            <!-- Status Card -->
            <div class="card mb-4">
                <div class="card-header bg-light">
                    <h5 class="mb-0"><i class="fas fa-flag me-2"></i>Status</h5>
                </div>
                <div class="card-body text-center">
                    @if ($comment->status === 'pending')
                        <div class="mb-3">
                            <span class="badge bg-warning text-dark p-3" style="font-size: 1.1rem;">
                                <i class="fas fa-hourglass-half me-2"></i>Pending
                            </span>
                        </div>
                        <p class="text-muted small">This comment is awaiting moderation review.</p>
                    @elseif ($comment->status === 'approved')
                        <div class="mb-3">
                            <span class="badge bg-success p-3" style="font-size: 1.1rem;">
                                <i class="fas fa-check-circle me-2"></i>Approved
                            </span>
                        </div>
                        <p class="text-muted small">This comment has been approved and is visible.</p>
                    @elseif ($comment->status === 'rejected')
                        <div class="mb-3">
                            <span class="badge bg-danger p-3" style="font-size: 1.1rem;">
                                <i class="fas fa-times-circle me-2"></i>Rejected
                            </span>
                        </div>
                        <p class="text-muted small">This comment has been rejected and is hidden.</p>
                    @endif
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="card">
                <div class="card-header bg-light">
                    <h5 class="mb-0"><i class="fas fa-cogs me-2"></i>Actions</h5>
                </div>
                <div class="card-body d-grid gap-2">
                    @if ($comment->status !== 'approved')
                        <form action="{{ route('comments.approve', $comment->id) }}" method="POST">
                            @csrf
                            <button type="submit" class="btn btn-success btn-sm w-100" onclick="return confirm('Approve this comment?')">
                                <i class="fas fa-check me-2"></i>Approve
                            </button>
                        </form>
                    @else
                        <button class="btn btn-success btn-sm w-100" disabled>
                            <i class="fas fa-check me-2"></i>Already Approved
                        </button>
                    @endif

                    @if ($comment->status !== 'rejected')
                        <button type="button" class="btn btn-warning btn-sm w-100" data-bs-toggle="modal" data-bs-target="#rejectModal">
                            <i class="fas fa-times me-2"></i>Reject
                        </button>
                    @else
                        <button class="btn btn-warning btn-sm w-100" disabled>
                            <i class="fas fa-times me-2"></i>Already Rejected
                        </button>
                    @endif

                    <button type="button" class="btn btn-danger btn-sm w-100" data-bs-toggle="modal" data-bs-target="#deleteModal">
                        <i class="fas fa-trash me-2"></i>Delete
                    </button>
                </div>
            </div>

            <!-- Comment Info Card -->
            <div class="card mt-4">
                <div class="card-header bg-light">
                    <h5 class="mb-0"><i class="fas fa-info-circle me-2"></i>Info</h5>
                </div>
                <div class="card-body small">
                    <div class="mb-2">
                        <strong>Status:</strong> 
                        <span class="badge bg-secondary">{{ ucfirst($comment->status) }}</span>
                    </div>
                    <div class="mb-2">
                        <strong>Created:</strong><br>
                        {{ $comment->created_at->diffForHumans() }}
                    </div>
                    <div>
                        <strong>Updated:</strong><br>
                        {{ $comment->updated_at->diffForHumans() }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Reject Confirmation Modal -->
<div class="modal fade" id="rejectModal" tabindex="-1" aria-labelledby="rejectModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header bg-warning text-dark">
                <h5 class="modal-title" id="rejectModalLabel">
                    <i class="fas fa-exclamation-triangle me-2"></i>Reject Comment
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to reject this comment? This action will hide the comment and cannot be easily undone.</p>
                <div class="card bg-light">
                    <div class="card-body small">
                        <strong>Comment Preview:</strong><br>
                        {{ Str::limit($comment->message, 150) }}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <form action="{{ route('comments.reject', $comment->id) }}" method="POST" style="display: inline;">
                    @csrf
                    <button type="submit" class="btn btn-warning">
                        <i class="fas fa-times me-2"></i>Reject
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- Delete Confirmation Modal -->
<div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header bg-danger text-white">
                <h5 class="modal-title" id="deleteModalLabel">
                    <i class="fas fa-trash me-2"></i>Delete Comment
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-circle me-2"></i>
                    <strong>Warning:</strong> This action cannot be undone. The comment will be permanently deleted from the database.
                </div>
                <p>Are you sure you want to delete this comment?</p>
                <div class="card bg-light">
                    <div class="card-body small">
                        <strong>Commenter:</strong> {{ $comment->name }}<br>
                        <strong>Email:</strong> {{ $comment->email }}<br>
                        <strong>Comment Preview:</strong><br>
                        {{ Str::limit($comment->message, 150) }}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <form action="{{ route('comments.destroy', $comment->id) }}" method="POST" style="display: inline;">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-danger">
                        <i class="fas fa-trash me-2"></i>Delete Permanently
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
// Optional: Add keyboard shortcuts or additional interactivity
document.addEventListener('DOMContentLoaded', function() {
    // Highlight message text on click
    const messageCard = document.querySelector('.card-body textarea');
    if (messageCard) {
        messageCard.addEventListener('click', function() {
            this.select();
        });
    }
});
</script>
@endpush
