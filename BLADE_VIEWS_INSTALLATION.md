# Comments Admin Views - Installation Guide

## Overview
Two Blade template files have been created for the comments admin interface:
- `comments-index.blade.php` - Admin dashboard listing and managing comments
- `comments-show.blade.php` - Single comment detail view

## Installation Instructions

Due to environment constraints, these files have been created in the root directory. Please move them to the appropriate Laravel locations:

### 1. Move index view to correct location:
```bash
# Copy from: c:\wamp64\www\yalla-frontend\comments-index.blade.php
# Copy to: resources/views/comments/index.blade.php
```

### 2. Move show view to correct location:
```bash
# Copy from: c:\wamp64\www\yalla-frontend\comments-show.blade.php
# Copy to: resources/views/comments/show.blade.php
```

### 3. Ensure directory exists:
```bash
mkdir -p resources/views/comments
```

## File Descriptions

### `index.blade.php` - Comments List View
**Features:**
- Collapsible filters section with:
  - Status filter (All/Pending/Approved/Rejected)
  - Article type and key filters
  - Date range filtering (from/to dates)
  - Search by name/email
  - Filter and reset buttons
- Responsive data table with columns:
  - Checkbox (for bulk selection)
  - Name, Email, Article info
  - Message preview (truncated to 100 chars)
  - Status badge with color coding:
    - Yellow: Pending
    - Green: Approved
    - Red: Rejected
  - Created date
  - Action buttons (View, Approve, Reject, Delete)
- Bulk actions section (appears when comments exist):
  - Select all checkbox
  - Bulk approve, reject, delete buttons
  - Confirmation dialogs for destructive actions
- Empty state message when no comments found
- Bootstrap 5 responsive grid layout
- Font Awesome icons throughout

**JavaScript Features:**
- Select all/none functionality
- Bulk action handling with CSRF protection
- Filter collapse animation
- Confirmation dialogs for destructive actions
- Disabled state management for bulk buttons

### `show.blade.php` - Comment Detail View
**Features:**
- Back link to comments list
- Comment details card with:
  - Name and email (email is clickable link)
  - Article type and key
  - Created date and IP address
  - Full message in read-only textarea
- Status badge (large, centered)
- Sidebar with action buttons:
  - Approve button (if not already approved)
  - Reject button with confirmation modal
  - Delete button with confirmation modal
- Info card showing:
  - Current status
  - Created/updated timestamps (relative time)
- Confirmation modals for:
  - Reject action (with comment preview)
  - Delete action (with warning and details)
- Flash message support for success/error
- Bootstrap 5 responsive layout

**JavaScript Features:**
- Textarea text selection on click
- Modal integration with Bootstrap 5
- Responsive sidebar layout

## Required Routes

Ensure your routes are defined in `routes/web.php`:

```php
Route::resource('comments', CommentController::class);
Route::post('comments/{id}/approve', [CommentController::class, 'approve'])->name('comments.approve');
Route::post('comments/{id}/reject', [CommentController::class, 'reject'])->name('comments.reject');
Route::post('comments/bulk-approve', [CommentController::class, 'bulkApprove'])->name('comments.bulk-approve');
Route::post('comments/bulk-reject', [CommentController::class, 'bulkReject'])->name('comments.bulk-reject');
Route::post('comments/bulk-delete', [CommentController::class, 'bulkDelete'])->name('comments.bulk-delete');
```

## Required Blade Layout

Your `resources/views/layouts/app.blade.php` should include:
- Bootstrap 5 CSS
- Font Awesome 6 CSS
- Bootstrap 5 JS
- CSRF token meta tag

## Controller Requirements

Your `CommentController` should pass:
- `$comments` (paginated collection) for index view
- `$comment` (single model) for show view

With support for:
- Filtering by status, article_type, article_key, created_at range
- Search by name/email
- Pagination

## Database Model Properties

The `Comment` model should have:
- `id` - Primary key
- `name` - Commenter name
- `email` - Commenter email
- `message` - Comment text
- `status` - enum: pending, approved, rejected
- `article_type` - Type of article commented on
- `article_key` - Article identifier
- `ip_address` - Commenter's IP (optional)
- `created_at` - Timestamp
- `updated_at` - Timestamp

## Styling & Dependencies

- **Bootstrap 5** - Layout and components
- **Font Awesome 6** - Icons (fas classes used throughout)
- **Laravel Blade** - Template engine features used:
  - @extends, @section, @endsection
  - @if, @foreach, @endif
  - {{ }} interpolation
  - @csrf for form security
  - @method() for HTTP verbs
  - @push for script sections
  - Str::limit() helper
  - diffForHumans() for timestamps

## Notes

- All forms include CSRF protection via @csrf
- Confirmation dialogs use native JavaScript confirm()
- Bulk actions disabled until items selected
- Message truncation uses Laravel's Str::limit()
- Responsive on all screen sizes
- Accessibility features included (labels, aria attributes)
- Color-coded status badges for quick visual identification
