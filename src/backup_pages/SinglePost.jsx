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

const SinglePost = () => {
  const [post, setPost] = useState({});
  const [recentPosts, setRecentPosts] = useState([]);
  const params = useParams();
  const { key } = params;

  useEffect(() => {
    // Fetch single post details
    axios
      .get(`${env.baseUrl}/api/details/${key}`)
      .then((response) => {
        setPost(response.data);
      })
      .catch((error) => console.error("Error fetching post:", error));

    // Fetch recent posts
    axios
      .get(`${env.baseUrl}/api/posts/post`)
      .then((response) => {
        const filtered = response.data.data.filter((p) => p.slug !== key);
        setRecentPosts(filtered.slice(0, 5)); // Show only 5 recent posts
      })
      .catch((error) => console.error("Error fetching recent posts:", error));
  }, [key]);

  // ✅ Read More Button Logic
  const getReadMoreLink = () => {
    if (!post) return null;

    // If source is 'eventbrite', use evenbrite_link
    if (post.source && post.source.toLowerCase() === "eventbrite") {
      return post.evenbrite_link || null;
    }

    // Otherwise, use the source link
    return post.source || null;
  };

  const readMoreLink = getReadMoreLink();

  console.log(readMoreLink)

  return (
    <div>
      <section className="single-post">
        <div className="container">
          <div className="row">
            {/* Left Section (Main Post) */}
            <div className="col-lg-8">
              <div className="content-block">
                {/* ✅ Feature Image */}
                {post.image && (
                  <div className="feature-image mb-3">
                    <img
                      src={post.image}
                      alt={post.title}
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}

                <h1>{post.title}</h1>

                {/* ✅ Disclaimer */}
                {readMoreLink && (
                  <p
                    className="text-muted mt-3"
                    style={{
                      fontSize: "0.9rem",
                      color: "#6c757d",
                      lineHeight: "1.6",
                    }}
                  >
                    <strong>Disclaimer:</strong> The content above has been
                    sourced from external or third-party platforms. All rights
                    belong to their respective owners. For the original version,
                    please visit{" "}
                    <a
                      href={readMoreLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      this source link
                    </a>
                    .
                  </p>
                )}

                {/* ✅ Post Content */}
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
                      className="btn btn-primary">
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
                       <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        background: "#000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <path d="M18.244 2H21.5l-7.19 8.22L22 22h-6.828l-5.346-7.021L3.66 22H.4l7.693-8.793L2 2h6.995l4.835 6.36L18.244 2zm-1.2 18h1.803L7.972 4H6.037l11.007 16z"/>
                      </svg>
                    </div>
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

            {/* Right Section (Sidebar) */}
            <div className="col-lg-4">
              <div className="sidebar">
                <h4>Recent Posts</h4>
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
                        <span
                          className="date text-muted"
                          style={{ fontSize: "0.9rem" }}
                        >
                          {new Date(recent.post_date).toLocaleDateString(
                            "en-GB"
                          )}
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

export default SinglePost;
