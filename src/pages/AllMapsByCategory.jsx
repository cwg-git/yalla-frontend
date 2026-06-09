import { useEffect, useState } from "react";
import axios from "axios";
import { env } from "../config";
import { useParams, Link } from "react-router-dom";
import Categories from "../components/AllCategories";
import PostsMap from "../components/PostsMap";

// Simple SVG Icon Components
const ErrorIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 15px', display: 'block' }}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const EmptyIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#95a5a6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 15px', display: 'block' }}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const AllMapsByCategory = () => {
  const { key } = useParams();

  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pageData, setPageData] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  useEffect(() => {
    if (!key) return;

    setLoading(true);
    setError(null);

    axios
      .get(`${env.baseUrl}/api/events/${key}?page=${pageData.current_page}`)
      .then((response) => {
        const eventPosts = response.data.posts.data;

        setCategory(response.data.category);
        setPosts(eventPosts);
        console.log("Fetched posts:", eventPosts);

        setPageData({
          current_page: response.data.posts.current_page,
          last_page: response.data.posts.last_page,
          total: response.data.posts.total,
        });
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setError("Failed to load events. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [key, pageData.current_page]);

  // Pagination handler
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pageData.last_page) {
      setPageData(prev => ({ ...prev, current_page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="category-page">
        <section className="inner-banner">
          <div className="container">
            <div className="text-block">
              <h3><em>Category</em></h3>
              <h1>Loading...</h1>
            </div>
          </div>
        </section>
        
        <section className="thisweek event-category">
          <div className="container">
            <div className="lt-panel">
              <Categories type="events" direction="vertical" />
            </div>
            <div className="rt-panel">
              <div className="state-message">
                <div className="spinner"></div>
                <p>Loading events...</p>
              </div>
            </div>
            <div className="clearfix" />
          </div>
        </section>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="category-page">
        <section className="inner-banner">
          <div className="container">
            <div className="text-block">
              <h3><em>Category</em></h3>
              <h1>{category || "Category"}</h1>
            </div>
          </div>
        </section>
        
        <section className="thisweek event-category">
          <div className="container">
            <div className="lt-panel">
              <Categories type="events" direction="vertical" />
            </div>
            <div className="rt-panel">
              <div className="state-message state-error">
                <ErrorIcon />
                <h2>Something went wrong</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="btn-retry">
                  Try Again
                </button>
              </div>
            </div>
            <div className="clearfix" />
          </div>
        </section>
        </div>
    );
  }

  // Empty state - no events found
  if (!posts.length) {
    return (
      <div className="category-page">
        <section className="inner-banner">
          <div className="container">
            <div className="text-block">
              <h3><em>Category</em></h3>
              <h1>{category || "Category"}</h1>
            </div>
          </div>
        </section>
        
        <section className="thisweek event-category">
          <div className="container">
            <div className="lt-panel">
              <Categories type="events" direction="vertical" />
            </div>
            <div className="rt-panel">
              <div className="state-message state-empty">
                <EmptyIcon />
                <h2>No Events Found</h2>
                <p>There are no events available in this category yet.</p>
              </div>
            </div>
            <div className="clearfix" />
          </div>
        </section>
        </div>
    );
  }

  // Main content - events found
  return (
    <div className="category-page">
      <section className="inner-banner">
        <div className="container">
          <div className="text-block">
            <h3><em>Category</em></h3>
            <h1>{category}</h1>
          </div>
        </div>
      </section>

      <section className="thisweek event-category">
        <div className="container">
          <div className="lt-panel">
            <Categories type="events" direction="vertical" />
          </div>

          <div className="rt-panel">
            {/* Events Count */}
            <div className="events-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2c3e50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="events-count">
                {pageData.total} {pageData.total === 1 ? 'Event' : 'Events'} Found
              </span>
            </div>

            {/* Events Map Section */}
            <section className="passive-map">
              <PostsMap posts={posts} />
            </section>

            {/* Pagination */}
            {pageData.last_page > 1 && (
              <div className="custom-pagination">
                <button
                  onClick={() => handlePageChange(pageData.current_page - 1)}
                  disabled={pageData.current_page === 1}
                  className="page-nav"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Previous
                </button>
                
                <div className="page-numbers">
                  {Array.from({ length: pageData.last_page }, (_, i) => i + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`page-num ${pageNum === pageData.current_page ? 'active' : ''}`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(pageData.current_page + 1)}
                  disabled={pageData.current_page === pageData.last_page}
                  className="page-nav"
                >
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <div className="clearfix" />
        </div>
      </section>
    </div>
  );
};

export default AllMapsByCategory;