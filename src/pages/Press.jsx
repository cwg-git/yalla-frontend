// Press.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { env } from "../config";
import PostsMap from "../components/PostsMap";

const Press = () => {
  // Actual category slugs from API: "traditional-popular" and "press"
  const TRADITIONAL_CATEGORY_KEY = "traditional-popular";
  const PRESS_CATEGORY_KEY = "press";

  const [traditionalPosts, setTraditionalPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tradRes, pressRes] = await Promise.allSettled([
          axios.get(`${env.baseUrl}/api/posts/${TRADITIONAL_CATEGORY_KEY}`),
          axios.get(`${env.baseUrl}/api/posts/${PRESS_CATEGORY_KEY}`)
        ]);

        let hasData = false;

        if (tradRes.status === "fulfilled" && tradRes.value?.data) {
          const tData = tradRes.value.data.posts?.data || tradRes.value.data.posts || [];
          setTraditionalPosts(tData);
          if (tData.length) hasData = true;
        }

        if (pressRes.status === "fulfilled" && pressRes.value?.data) {
          const pData = pressRes.value.data.posts?.data || pressRes.value.data.posts || [];
          setPopularPosts(pData);
          if (pData.length) hasData = true;
        }

        if (!hasData && tradRes.status === "rejected" && pressRes.status === "rejected") {
          setError("Failed to load posts.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Reusable grid component that renders the three responsive layouts
  const PostGrid = ({ posts }) => {
    if (!posts.length) return null;

    return (
      <>
        {/* Desktop view (lg and up) */}
        <div className="d-none d-lg-block d-md-none">
          <div className="row">
            {posts.map((post) => (
              <div className="col-lg-4" key={post.id}>
                <div className="post-box">
                  <div className="post-image position-relative">
                    <figure className="thumbnail">
                      <a href={`/post/${post.slug}`}>
                        <img src={post.image} alt={post.title} />
                      </a>
                    </figure>
                    <div className="post-content">
                      <div className="post-title">
                        <h2>
                          <a href={`/post/${post.slug}`}>{post.title}</a>
                        </h2>
                      </div>
                      <div className="post-category">{post.category_id}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tablet view (md) */}
        <div className="d-none d-md-block d-lg-none">
          <div className="row">
            {posts.map((post) => (
              <div className="col-sm-6" key={post.id}>
                <div className="post-box">
                  <div className="post-image position-relative">
                    <figure className="thumbnail">
                      <a href={`/post/${post.slug}`}>
                        <img src={post.image} alt={post.title} />
                      </a>
                    </figure>
                    <div className="post-content">
                      <div className="post-title">
                        <h2>
                          <a href={`/post/${post.slug}`}>{post.title}</a>
                        </h2>
                      </div>
                      <div className="post-category">{post.category_id}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile view (xs) */}
        <div className="d-block d-xs-none d-md-none">
          <div className="row">
            {posts.map((post) => (
              <div className="col-xs-12" key={post.id}>
                <div className="post-box">
                  <div className="post-image position-relative">
                    <figure className="thumbnail">
                      <a href={`/post/${post.slug}`}>
                        <img src={post.image} alt={post.title} />
                      </a>
                    </figure>
                    <div className="post-content">
                      <div className="post-title">
                        <h2>
                          <a href={`/post/${post.slug}`}>{post.title}</a>
                        </h2>
                      </div>
                      <div className="post-category">{post.category_id}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container text-danger">{error}</div>;

  return (
    <div>
      {/* Inner Banner – exactly as in your HTML */}
      <section className="inner-banner">
        <div className="container">
          <div className="text-block">
            <h3><em>Latest</em></h3>
            <h1><em>Press Release</em></h1>
          </div>
        </div>
      </section>

      {/* Traditional Posts Section */}
      <section className="thisweek event-category press">
        <div className="container">
          <div className="post-block">
            <div className="title-block">
              <h4>Traditional & Popular Posts</h4>
            </div>
            <PostGrid posts={traditionalPosts} />
          </div>
        </div>
      </section>

      {/* Press Posts Section */}
      <section className="thisweek event-category press">
        <div className="container">
          <div className="post-block">
            <div className="title-block">
              <h4>Press Releases</h4>
            </div>
            <PostGrid posts={popularPosts} />
          </div>
        </div>
      </section>

      {/* Map Section – optional, keep if needed */}
      <section className="passive-map">
        <div className="container">
          <PostsMap posts={[...traditionalPosts, ...popularPosts]} />
        </div>
      </section>
    </div>
  );
};

export default Press;