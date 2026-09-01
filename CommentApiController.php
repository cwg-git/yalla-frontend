<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Models\Comment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CommentApiController extends Controller
{
    /**
     * Store a newly created comment in storage.
     * POST /api/comments
     */
    public function store(StoreCommentRequest $request): JsonResponse
    {
        try {
            // Verify CAPTCHA token
            if (!$this->verifyCaptcha($request->captcha_token)) {
                return response()->json([
                    'message' => 'CAPTCHA verification failed',
                    'errors' => ['captcha_token' => 'Invalid CAPTCHA token']
                ], 422);
            }

            // Create comment with validated data
            $comment = Comment::create([
                'name' => $request->name,
                'email' => $request->email,
                'message' => $request->message,
                'article_type' => $request->article_type,
                'article_key' => $request->article_key,
                'ip_address' => $request->ip(),
                'status' => 'pending',
            ]);

            Log::info('Comment created', [
                'comment_id' => $comment->id,
                'article_type' => $comment->article_type,
                'article_key' => $comment->article_key,
            ]);

            return response()->json([
                'message' => 'Comment created successfully and is pending approval',
                'data' => $comment
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating comment', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error creating comment'
            ], 500);
        }
    }

    /**
     * Get approved comments for a specific article.
     * GET /api/comments?article_type=X&article_key=Y
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Validate required parameters
            if (!$request->has('article_type') || !$request->has('article_key')) {
                return response()->json([
                    'message' => 'Missing required parameters',
                    'errors' => [
                        'article_type' => 'article_type parameter is required',
                        'article_key' => 'article_key parameter is required'
                    ]
                ], 400);
            }

            $articleType = $request->query('article_type');
            $articleKey = $request->query('article_key');

            // Get approved comments ordered by created_at descending
            $comments = Comment::forArticle($articleType, $articleKey)
                ->approved()
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'data' => $comments,
                'count' => $comments->count()
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching comments', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error fetching comments'
            ], 500);
        }
    }

    /**
     * Approve a comment.
     * PATCH /api/comments/{id}/approve
     */
    public function approve(int $id): JsonResponse
    {
        try {
            $comment = Comment::find($id);

            if (!$comment) {
                return response()->json([
                    'message' => 'Comment not found'
                ], 404);
            }

            $comment->approve();

            Log::info('Comment approved', [
                'comment_id' => $comment->id,
                'article_type' => $comment->article_type,
            ]);

            return response()->json([
                'message' => 'Comment approved successfully',
                'data' => $comment
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error approving comment', [
                'comment_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error approving comment'
            ], 500);
        }
    }

    /**
     * Reject a comment.
     * PATCH /api/comments/{id}/reject
     */
    public function reject(int $id): JsonResponse
    {
        try {
            $comment = Comment::find($id);

            if (!$comment) {
                return response()->json([
                    'message' => 'Comment not found'
                ], 404);
            }

            $comment->reject();

            Log::info('Comment rejected', [
                'comment_id' => $comment->id,
                'article_type' => $comment->article_type,
            ]);

            return response()->json([
                'message' => 'Comment rejected successfully',
                'data' => $comment
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error rejecting comment', [
                'comment_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error rejecting comment'
            ], 500);
        }
    }

    /**
     * Delete a comment.
     * DELETE /api/comments/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $comment = Comment::find($id);

            if (!$comment) {
                return response()->json([
                    'message' => 'Comment not found'
                ], 404);
            }

            $commentId = $comment->id;
            $comment->delete();

            Log::info('Comment deleted', [
                'comment_id' => $commentId,
            ]);

            return response()->json([
                'message' => 'Comment deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting comment', [
                'comment_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error deleting comment'
            ], 500);
        }
    }

    /**
     * Verify CAPTCHA token.
     * For now, accept all non-empty tokens.
     */
    private function verifyCaptcha(string $token): bool
    {
        // Accept all non-empty tokens for now
        return !empty($token);
    }
}
