import { useEffect, useState } from "react";

// Simple email validation regex
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const ArticleComments = ({ articleType, articleKey, title, captchaToken = null }) => {
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch approved comments on mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `/api/comments?article_type=${encodeURIComponent(articleType)}&article_key=${encodeURIComponent(articleKey)}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch comments: ${response.statusText}`);
        }
        const data = await response.json();
        setComments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setComments([]);
      }
    };

    fetchComments();
  }, [articleType, articleKey]);

  const validateForm = () => {
    const errors = {};

    if (!form.name.trim()) {
      errors.name = "Name is required";
    } else if (form.name.length > 255) {
      errors.name = "Name must be 255 characters or less";
    }

    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(form.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    const message = form.message.trim();
    if (!message) {
      errors.message = "Comment is required";
    } else if (message.length < 3) {
      errors.message = "Comment must be at least 3 characters";
    } else if (message.length > 2000) {
      errors.message = "Comment must be 2000 characters or less";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          article_type: articleType,
          article_key: articleKey,
          captcha_token: captchaToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to post comment: ${response.statusText}`);
      }

      const newComment = await response.json();

      // Add the new comment to the list
      setComments((prev) => [newComment, ...prev]);
      setForm({ name: "", email: "", message: "" });
      setSuccess(true);
      setValidationErrors({});

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error posting comment:", err);
      setError(err.message || "Failed to post comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="article-comments"
      style={{
        marginTop: 32,
        borderTop: "1px solid rgba(0, 0, 0, 0.08)",
        paddingTop: 28,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "end",
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <div>
          <h3 style={{ marginBottom: 6 }}>Comments</h3>
          <p style={{ margin: 0, color: "#666" }}>
            Share your thoughts on {title || "this article"}.
          </p>
        </div>
        <span
          style={{
            borderRadius: 999,
            padding: "6px 10px",
            background: "#f5f7fb",
            color: "#334155",
            fontSize: 12,
          }}
        >
          {comments.length} comment{comments.length === 1 ? "" : "s"}
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fafafa",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          borderRadius: 16,
          padding: 18,
        }}
      >
        {error && (
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              background: "#fee",
              border: "1px solid #fcc",
              borderRadius: 8,
              color: "#c33",
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              background: "#efe",
              border: "1px solid #cfc",
              borderRadius: 8,
              color: "#3c3",
              fontSize: 14,
            }}
          >
            Comment posted successfully! Thank you for your feedback.
          </div>
        )}

        <div className="row g-3">
          <div className="col-md-4">
            <label htmlFor="comment-name" style={{ display: "block", marginBottom: 6 }}>
              Name
            </label>
            <input
              id="comment-name"
              className="form-control"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="Your name"
              disabled={loading}
              style={validationErrors.name ? { borderColor: "#dc3545" } : {}}
            />
            {validationErrors.name && (
              <small style={{ color: "#dc3545", display: "block", marginTop: 4 }}>
                {validationErrors.name}
              </small>
            )}
          </div>
          <div className="col-md-8">
            <label htmlFor="comment-email" style={{ display: "block", marginBottom: 6 }}>
              Email
            </label>
            <input
              id="comment-email"
              type="email"
              className="form-control"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
              placeholder="your.email@example.com"
              disabled={loading}
              style={validationErrors.email ? { borderColor: "#dc3545" } : {}}
            />
            {validationErrors.email && (
              <small style={{ color: "#dc3545", display: "block", marginTop: 4 }}>
                {validationErrors.email}
              </small>
            )}
          </div>
        </div>

        <div className="row g-3" style={{ marginTop: 0 }}>
          <div className="col-12">
            <label htmlFor="comment-message" style={{ display: "block", marginBottom: 6 }}>
              Comment
            </label>
            <textarea
              id="comment-message"
              className="form-control"
              rows={4}
              value={form.message}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, message: event.target.value }))
              }
              placeholder="Write your comment here"
              disabled={loading}
              style={validationErrors.message ? { borderColor: "#dc3545" } : {}}
            />
            {validationErrors.message && (
              <small style={{ color: "#dc3545", display: "block", marginTop: 4 }}>
                {validationErrors.message}
              </small>
            )}
            <small style={{ color: "#666", display: "block", marginTop: 4 }}>
              {form.message.length}/2000 characters
            </small>
          </div>
        </div>

        <input type="hidden" name="captcha_token" value={captchaToken || ""} />

        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Posting..." : "Post comment"}
          </button>
        </div>
      </form>

      <div style={{ marginTop: 22 }}>
        {comments.length === 0 ? (
          <p style={{ margin: 0, color: "#666" }}>Be the first to comment.</p>
        ) : (
          <div style={{ display: "grid", gap: 14 }}>
            {comments.map((comment) => (
              <article
                key={comment.id}
                style={{
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  borderRadius: 16,
                  padding: 16,
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                    marginBottom: 8,
                  }}
                >
                  <strong>{comment.name}</strong>
                  <span style={{ color: "#666", fontSize: 12 }}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{comment.message}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ArticleComments;
