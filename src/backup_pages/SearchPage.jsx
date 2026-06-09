import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { env } from "../config";
import { Link, useSearchParams } from "react-router-dom";
import Categories from "../components/Categories";
import LegacyBlock from "../components/LegacyBlock";
import PostsMap from "../components/PostsMap";
import dayjs from "dayjs";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [searchText, setSearchText] = useState(query);
  const [searchedYes, setSearchedYes] = useState(false);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const [pageData, setPageData] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const [activeTab, setActiveTab] = useState("all"); // all, posts, events

  // Debounced search suggestions
  const fetchSuggestions = useCallback(async (text) => {
    if (text.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(`${env.baseUrl}/api/search/suggestions?q=${text}`);
      setSuggestions(response.data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Suggestions error:", error);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchText.trim()) {
        fetchSuggestions(searchText);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchText, fetchSuggestions]);

  // Main search function
  const performSearch = async (searchQuery, page = 1) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    setShowSuggestions(false);

    setSearchParams({ q: searchQuery });

    try {
      const response = await axios.get(
        `${env.baseUrl}/api/search/all?q=${encodeURIComponent(searchQuery)}&page=${page}&per_page=12`
      );

      setPosts(response.data.posts?.data || []);
      setEvents(response.data.events?.data || []);

      setPageData({
        current_page: page,
        last_page: Math.max(
          response.data.posts?.last_page || 1,
          response.data.events?.last_page || 1
        ),
        total: response.data.total_results || 0,
      });
    } catch (error) {
      console.error("Search error:", error);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial search from URL
  useEffect(() => {
    if (query) {
      setSearchText(query);
      performSearch(query);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    performSearch(searchText);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pageData.last_page) {
      performSearch(searchText, page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isEventExpired = (postDate) => {
    return dayjs(postDate).isBefore(dayjs(), 'day');
  };

  return (
    <div>
      {/* Search Banner */}
      <section className="inner-banner">
        <div className="container">
          <div className="text-block">
            <h3>
              <em>Search</em>
            </h3>
            <h1>{searched && query ? `Results: "${query}"` : "Search Posts & Events"}</h1>
          </div>
        </div>
      </section>

      <section className="thisweek event-category">
        <div className="container">
          <div className="lt-panel">
            <Categories type="posts" direction="vertical" />
          </div>

          <div className="rt-panel">
            {/* Search Form */}
            <div className="search-form-box">
              <form onSubmit={handleSubmit}>
                <div className="search-input-group">
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => {setSearchText(e.target.value); setSearchedYes(true);}}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Search for posts and events..."
                    className="form-control"
                    autoComplete="off"
                  />
                  <button type="submit" className="theme-btn">
                    Search
                  </button>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && searchedYes && suggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    {suggestions.map((suggestion, index) => (
                      <Link
                        key={index}
                        to={suggestion.url}
                        className="suggestion-item"
                        onClick={() => setShowSuggestions(false)}
                      >
                        {suggestion.title}
                        <span className="suggestion-type">
                          {suggestion.type === 'event' ? '(Event)' : '(Post)'}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </form>
            </div>

            {/* Loading */}
            {loading && (
              <div className="post-block">
                <div className="text-center py-5">
                  <p>Searching...</p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="post-block">
                <div className="text-center py-5">
                  <p className="text-danger">{error}</p>
                  <button
                    onClick={() => performSearch(searchText)}
                    className="theme-btn"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* No Results */}
            {!loading && !error && searched && posts.length === 0 && events.length === 0 && (
              <div className="post-block">
                <div className="text-center py-5">
                  <h3>No Results Found</h3>
                  <p>No posts or events match "{query}"</p>
                  <p>Try different keywords or check spelling</p>
                </div>
              </div>
            )}

            {/* Results */}
            {!loading && !error && searched && (posts.length > 0 || events.length > 0) && (
              <>
                {/* Tabs */}
                <div className="search-tabs">
                  <button
                    className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                  >
                    All ({pageData.total})
                  </button>
                  <button
                    className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('posts')}
                  >
                    Posts ({posts.length})
                  </button>
                  <button
                    className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
                    onClick={() => setActiveTab('events')}
                  >
                    Events ({events.length})
                  </button>
                </div>

                {/* Posts Results - Same HTML as PostsByCategoorie */}
                {(activeTab === 'all' || activeTab === 'posts') && posts.length > 0 && (
                  <div className="post-block">
                    <div className="d-none d-lg-block d-md-none">
                      <div className="row">
                        {posts.map((post) => (
                          <div className="col-lg-4" key={`post-${post.id}`}>
                            <div className="post-box">
                              <div className="post-image position-relative">
                                <div className="img-block">
                                  <figure className="thumbnail zoom-effect">
                                    <a href={`/post/${post.slug}`}>
                                      <img src={post.image} alt={post.title} />
                                    </a>
                                  </figure>
                                  <div className="bordered-effect">
                                    <a
                                      href={`/post/${post.slug}`}
                                      aria-label={post.title}
                                    ></a>
                                  </div>
                                </div>
                                <div className="post-content">
                                  <div className="post-title">
                                    <h2>
                                      <a href={`/post/${post.slug}`}>{post.title}</a>
                                    </h2>
                                  </div>
                                  <div className="post-category">
                                    {post.category_id}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="d-none d-md-block d-lg-none">
                      <div className="row">
                        {posts.map((post) => (
                          <div className="col-sm-6" key={`post-${post.id}`}>
                            <div className="post-box">
                              <div className="post-image position-relative">
                                <div className="img-block">
                                  <figure className="thumbnail zoom-effect">
                                    <a href={`/post/${post.slug}`}>
                                      <img src={post.image} alt={post.title} />
                                    </a>
                                  </figure>
                                  <div className="bordered-effect">
                                    <a
                                      href={`/post/${post.slug}`}
                                      aria-label={post.title}
                                    ></a>
                                  </div>
                                </div>
                                <div className="post-content">
                                  <div className="post-title">
                                    <h2>
                                      <a href={`/post/${post.slug}`}>{post.title}</a>
                                    </h2>
                                  </div>
                                  <div className="post-category">
                                    {post.category_id}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="d-block d-xs-none d-md-none">
                      <div className="row">
                        {posts.map((post) => (
                          <div className="col-xs-12" key={`post-${post.id}`}>
                            <div className="post-box">
                              <div className="post-image position-relative">
                                <div className="img-block">
                                  <figure className="thumbnail zoom-effect">
                                    <a href={`/post/${post.slug}`}>
                                      <img src={post.image} alt={post.title} />
                                    </a>
                                  </figure>
                                  <div className="bordered-effect">
                                    <a
                                      href={`/post/${post.slug}`}
                                      aria-label={post.title}
                                    ></a>
                                  </div>
                                </div>
                                <div className="post-content">
                                  <div className="post-title">
                                    <h2>
                                      <a href={`/post/${post.slug}`}>{post.title}</a>
                                    </h2>
                                  </div>
                                  <div className="post-category">
                                    {post.category_id}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Events Results - Same HTML as EventsByCategoorie */}
                {(activeTab === 'all' || activeTab === 'events') && events.length > 0 && (
                  <div className="calendar-box">
                    {/* EVENTS */}
                    <div className="events-list">
                      {events.length === 0 && (
                        <div className="no-events">
                          No events found
                        </div>
                      )}

                      {events.map((event) => {
                        const date = dayjs(event.start_date);
                        const expired = isEventExpired(event.start_date);

                        return (
                          <div className={`event-row ${expired ? 'expired' : ''}`} key={`event-${event.id}`}>
                            <div className="event-date">
                              <span className="day">{date.format("DD")}</span>
                              <span className="month">{date.format("MMM")}</span>
                            </div>

                            <div className="event-card">
                              <img src={event.image} alt={event.title} />

                              <div className="event-content">
                                <div className="event-meta">
                                  <span className="event-time">
                                    <i className="fa-regular fa-clock"></i> All Day
                                  </span>
                                </div>

                                <div className="event-title">
                                  <a href={`/event/${event.slug}`}>
                                    {event.title}
                                    {expired && (
                                      <span className="expired-tag">Expired</span>
                                    )}
                                  </a>
                                </div>

                                <div className="event-category">
                                  <i className="fa-regular fa-folder"></i> {event.category_id}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Pagination - Same as PostsByCategoorie */}
                {pageData.last_page > 1 && (
                  <nav className="post-pagination" aria-label="Search navigation">
                    <ul className="pagination">
                      <li
                        className={`page-item ${
                          pageData.current_page === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          type="button"
                          className="page-link"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageData.current_page - 1);
                          }}
                        >
                          &laquo; Previous
                        </button>
                      </li>

                      {[...Array(pageData.last_page)].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                          <li
                            key={pageNumber}
                            className={`page-item ${
                              pageNumber === pageData.current_page ? "active" : ""
                            }`}
                          >
                            <button
                              type="button"
                              className="page-link"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(pageNumber);
                              }}
                            >
                              {pageNumber}
                            </button>
                          </li>
                        );
                      })}

                      <li
                        className={`page-item ${
                          pageData.current_page === pageData.last_page
                            ? "disabled"
                            : ""
                        }`}
                      >
                        <button
                          type="button"
                          className="page-link"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageData.current_page + 1);
                          }}
                        >
                          Next &raquo;
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </>
            )}
          </div>

          <div className="clearfix" />
        </div>
      </section>

      {/* Map Section */}
      {(activeTab === 'all' || activeTab === 'events') && events.length > 0 && (
        <section className="passive-map">
          <div className="container">
            <PostsMap posts={events} />
          </div>
        </section>
      )}

      <LegacyBlock />
    </div>
  );
};

export default SearchPage;