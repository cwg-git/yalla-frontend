import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { env } from "../config";
import axios from "axios";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";

const SingleEvent = () => {
  const [post, setPost] = useState({});
  const [recentPosts, setRecentPosts] = useState([]);
  const params = useParams();
  const { key } = params;

  useEffect(() => {
    // Fetch single post/event
    axios
      .get(`${env.baseUrl}/api/details/${key}`)
      .then((response) => setPost(response.data))
      .catch((error) => console.error("Error fetching post:", error));

    // Fetch recent posts
    axios
      .get(`${env.baseUrl}/api/posts/post`)
      .then((response) => {
        const filtered = response.data.data.filter((p) => p.slug !== key);
        setRecentPosts(filtered.slice(0, 5));
      })
      .catch((error) => console.error("Error fetching recent posts:", error));
  }, [key]);

  // ✅ Read More logic based on DB fields
  const getReadMoreLink = () => {
    if (!post) return null;

    if (post.source && post.source.toLowerCase() === "eventbrite") {
      return post.evenbrite_link || null;
    }

    return post.source || null;
  };

  const readMoreLink = getReadMoreLink();

  return (
    <div>
      <section className="single-post">
        <div className="container">
          <div className="row">
            {/* Main Content */}
            <div className="col-lg-8">
              <div className="content-block">
                {post.image && (
                  <div className="feature-image mb-3">
                    <img
                      src={post.image}
                      alt={post.title}
                      style={{ width: "100%", borderRadius: "8px" }}
                    />
                  </div>
                )}

                <h1>{post.title}</h1>

                <div
                  className="post-body mt-3"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* ✅ Read More Button */}
                {readMoreLink && (
                  <div className="mt-4">
                    <a
                      href={readMoreLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Read More
                    </a>
                  </div>
                )}

                {/* ✅ Share Section */}
                <div className="share-section mt-5">
                  <h4>Share this post:</h4>
                  <div
                    className="flex gap-2"
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                      marginTop: "8px",
                    }}
                  >
                    <FacebookShareButton
                      url={window.location.href}
                      quote={post.title}
                    >
                      <FacebookIcon size={30} round />
                    </FacebookShareButton>
                    <TwitterShareButton
                      url={window.location.href}
                      title={post.title}
                    >
                      <TwitterIcon size={30} round />
                    </TwitterShareButton>
                    <LinkedinShareButton
                      url={window.location.href}
                      title={post.title}
                    >
                      <LinkedinIcon size={30} round />
                    </LinkedinShareButton>
                    <WhatsappShareButton
                      url={window.location.href}
                      title={post.title}
                    >
                      <WhatsappIcon size={30} round />
                    </WhatsappShareButton>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="sidebar">
                <h4>Recent posts</h4>
                <ul>
                  {recentPosts.map((recent) => (
                    <li key={recent.id} style={{ marginBottom: "15px" }}>
                      <div className="img-thumblain">
                        <img
                          src={recent.image}
                          alt={recent.title}
                          style={{
                            width: "100%",
                            borderRadius: "6px",
                            marginBottom: "6px",
                          }}
                        />
                      </div>
                      <div className="post-content">
                        <h3 style={{ fontSize: "1rem", margin: "0" }}>
                          <a href={`/post/${recent.slug}`}>{recent.title}</a>
                        </h3>
                        <span className="date text-muted" style={{ fontSize: "0.9rem" }}>
                          {new Date(recent.post_date).toLocaleDateString("en-GB")}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SingleEvent;
