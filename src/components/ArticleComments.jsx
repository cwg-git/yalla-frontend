import { useEffect, useState } from "react";

const getStorageKey = (articleType, articleKey) =>
  `whoisin-${articleType}-comments-${articleKey}`;

const ArticleComments = ({ articleType, articleKey, title }) => {
  const storageKey = getStorageKey(articleType, articleKey);
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ name: "", message: "" });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setComments(saved ? JSON.parse(saved) : []);
    } catch (error) {
      setComments([]);
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(comments));
    } catch (error) {
      // Local storage is a convenience only; comments still render without persistence.
    }
  }, [comments, storageKey]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const message = form.message.trim();
    if (!message) return;

    const nextComment = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: form.name.trim() || "Anonymous",
      message,
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [nextComment, ...prev]);
    setForm({ name: "", message: "" });
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
        <div className="row g-3">
          <div className="col-md-4">
            <label htmlFor={`${storageKey}-name`} style={{ display: "block", marginBottom: 6 }}>
              Name
            </label>
            <input
              id={`${storageKey}-name`}
              className="form-control"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="Your name"
            />
          </div>
          <div className="col-md-8">
            <label htmlFor={`${storageKey}-message`} style={{ display: "block", marginBottom: 6 }}>
              Comment
            </label>
            <textarea
              id={`${storageKey}-message`}
              className="form-control"
              rows={4}
              required
              value={form.message}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, message: event.target.value }))
              }
              placeholder="Write your comment here"
            />
          </div>
        </div>

        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="btn btn-primary">
            Post comment
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
