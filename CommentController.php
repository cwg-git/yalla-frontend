<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;

class CommentController extends Controller
{
    /**
     * Display a listing of comments with filtering.
     * GET /comments
     */
    public function index(Request $request): View
    {
        try {
            $query = Comment::query();

            // Filter by status
            if ($request->has('status') && $request->status !== '') {
                $query->where('status', $request->status);
            }

            // Filter by article_type
            if ($request->has('article_type') && $request->article_type !== '') {
                $query->where('article_type', $request->article_type);
            }

            // Filter by article_key (partial match)
            if ($request->has('article_key') && $request->article_key !== '') {
                $query->where('article_key', 'like', '%' . $request->article_key . '%');
            }

            // Filter by date range
            if ($request->has('date_from') && $request->date_from !== '') {
                $query->whereDate('created_at', '>=', $request->date_from);
            }

            if ($request->has('date_to') && $request->date_to !== '') {
                $query->whereDate('created_at', '<=', $request->date_to);
            }

            // Search by name or email
            if ($request->has('search') && $request->search !== '') {
                $searchTerm = $request->search;
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('name', 'like', '%' . $searchTerm . '%')
                      ->orWhere('email', 'like', '%' . $searchTerm . '%');
                });
            }

            // Paginate 20 per page
            $comments = $query->orderBy('created_at', 'desc')->paginate(20);

            Log::info('Comments list accessed', [
                'total' => $comments->total(),
                'filters' => $request->all()
            ]);

            return view('comments.index', [
                'comments' => $comments,
                'filters' => $request->all()
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching comments list', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return view('comments.index', [
                'comments' => collect(),
                'filters' => $request->all(),
                'error' => 'Error loading comments'
            ]);
        }
    }

    /**
     * Display a single comment.
     * GET /comments/{id}
     */
    public function show(Comment $comment): View
    {
        try {
            Log::info('Comment detail viewed', [
                'comment_id' => $comment->id,
            ]);

            return view('comments.show', [
                'comment' => $comment
            ]);
        } catch (\Exception $e) {
            Log::error('Error showing comment', [
                'comment_id' => $comment->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return view('comments.show', [
                'comment' => $comment,
                'error' => 'Error loading comment'
            ]);
        }
    }

    /**
     * Approve a comment and redirect.
     * PATCH /comments/{id}/approve
     */
    public function approve(Comment $comment): RedirectResponse
    {
        try {
            $comment->approve();

            Log::info('Comment approved from admin', [
                'comment_id' => $comment->id,
                'article_type' => $comment->article_type,
            ]);

            return redirect()->back()->with('success', 'Comment approved successfully');
        } catch (\Exception $e) {
            Log::error('Error approving comment', [
                'comment_id' => $comment->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()->with('error', 'Error approving comment');
        }
    }

    /**
     * Reject a comment and redirect.
     * PATCH /comments/{id}/reject
     */
    public function reject(Comment $comment): RedirectResponse
    {
        try {
            $comment->reject();

            Log::info('Comment rejected from admin', [
                'comment_id' => $comment->id,
                'article_type' => $comment->article_type,
            ]);

            return redirect()->back()->with('success', 'Comment rejected successfully');
        } catch (\Exception $e) {
            Log::error('Error rejecting comment', [
                'comment_id' => $comment->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()->with('error', 'Error rejecting comment');
        }
    }

    /**
     * Delete a comment and redirect.
     * DELETE /comments/{id}
     */
    public function destroy(Comment $comment): RedirectResponse
    {
        try {
            $commentId = $comment->id;
            $comment->delete();

            Log::info('Comment deleted from admin', [
                'comment_id' => $commentId,
            ]);

            return redirect()->back()->with('success', 'Comment deleted successfully');
        } catch (\Exception $e) {
            Log::error('Error deleting comment', [
                'comment_id' => $comment->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()->with('error', 'Error deleting comment');
        }
    }

    /**
     * Approve multiple comments.
     * POST /comments/bulk-approve
     */
    public function bulkApprove(Request $request): RedirectResponse
    {
        try {
            $ids = $request->input('ids', []);

            if (empty($ids) || !is_array($ids)) {
                return redirect()->back()->with('error', 'No comments selected');
            }

            $count = Comment::whereIn('id', $ids)->update(['status' => 'approved']);

            Log::info('Comments bulk approved', [
                'count' => $count,
                'ids' => $ids
            ]);

            return redirect()->back()->with('success', "Successfully approved {$count} comment(s)");
        } catch (\Exception $e) {
            Log::error('Error bulk approving comments', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()->with('error', 'Error approving comments');
        }
    }

    /**
     * Reject multiple comments.
     * POST /comments/bulk-reject
     */
    public function bulkReject(Request $request): RedirectResponse
    {
        try {
            $ids = $request->input('ids', []);

            if (empty($ids) || !is_array($ids)) {
                return redirect()->back()->with('error', 'No comments selected');
            }

            $count = Comment::whereIn('id', $ids)->update(['status' => 'rejected']);

            Log::info('Comments bulk rejected', [
                'count' => $count,
                'ids' => $ids
            ]);

            return redirect()->back()->with('success', "Successfully rejected {$count} comment(s)");
        } catch (\Exception $e) {
            Log::error('Error bulk rejecting comments', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()->with('error', 'Error rejecting comments');
        }
    }

    /**
     * Delete multiple comments.
     * POST /comments/bulk-delete
     */
    public function bulkDelete(Request $request): RedirectResponse
    {
        try {
            $ids = $request->input('ids', []);

            if (empty($ids) || !is_array($ids)) {
                return redirect()->back()->with('error', 'No comments selected');
            }

            $count = Comment::whereIn('id', $ids)->delete();

            Log::info('Comments bulk deleted', [
                'count' => $count,
                'ids' => $ids
            ]);

            return redirect()->back()->with('success', "Successfully deleted {$count} comment(s)");
        } catch (\Exception $e) {
            Log::error('Error bulk deleting comments', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()->with('error', 'Error deleting comments');
        }
    }
}
