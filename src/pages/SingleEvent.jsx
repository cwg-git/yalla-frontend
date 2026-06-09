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
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";
import ArticleTranslateWidget from "../components/ArticleTranslateWidget";
import ArticleComments from "../components/ArticleComments";

const SingleEvent = () => {
  const [post, setPost] = useState({});
  const [recentPosts, setRecentPosts] = useState([]);
  const params = useParams();
  const { key } = params;

  useEffect(() => {
    axios
      .get(`${env.baseUrl}/api/details/${key}`)
      .then((response) => {
        setPost(response.data || {});
      })
      .catch((error) => console.error("Error fetching post:", error));

    axios
      .get(`${env.baseUrl}/api/posts/post`)
      .then((response) => {
        const filtered = (response.data.data || []).filter((p) => p.slug !== key);
        setRecentPosts(filtered.slice(0, 5));
      })
      .catch((error) => console.error("Error fetching recent posts:", error));
  }, [key]);

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
            <div className="col-lg-8">
              <div className="content-block">
                <h1>{post.title}</h1>

                {readMoreLink && (
                  <p
                    className="text-muted mt-3"
                    style={{
                      fontSize: "0.92rem",
                      color: "#6c757d",
                      lineHeight: "1.7",
                    }}
                  >
                    <strong>Disclaimer:</strong> The content above has been sourced from
                    external or third-party platforms. All rights belong to their
                    respective owners. For the original version, please visit{" "}
                    <a href={readMoreLink} target="_blank" rel="noopener noreferrer">
                      this source link
                    </a>
                    .
                  </p>
                )}

                <div
                  className="post-body mt-3"
                  lang="es"
                  translate="yes"
                  dangerouslySetInnerHTML={{ __html: post.content || "" }}
                />

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

                <div className="share-section mt-5">
                  <h4>Share this event:</h4>
                  <div
                    className="flex gap-2"
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                      marginTop: "8px",
                    }}
                  >
                    <FacebookShareButton url={window.location.href} quote={post.title}>
                      <FacebookIcon size={30} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={window.location.href} title={post.title}>
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          background: "#000",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="white"
                        >
                          <path d="M18.244 2H21.5l-7.19 8.22L22 22h-6.828l-5.346-7.021L3.66 22H.4l7.693-8.793L2 2h6.995l4.835 6.36L18.244 2zm-1.2 18h1.803L7.972 4H6.037l11.007 16z" />
                        </svg>
                      </div>
                    </TwitterShareButton>
                    <LinkedinShareButton url={window.location.href} title={post.title}>
                      <LinkedinIcon size={30} round />
                    </LinkedinShareButton>
                    <WhatsappShareButton url={window.location.href} title={post.title}>
                      <WhatsappIcon size={30} round />
                    </WhatsappShareButton>
                  </div>
                </div>

                <ArticleTranslateWidget pageLanguage="es" />
                <ArticleComments articleType="event" articleKey={key} title={post.title} />
              </div>
            </div>

            <div className="col-lg-4">
              <div className="sidebar">
                <div className="box">
                  <h3>Event Details</h3>

                  <div className="inner-block">
                    <div className="icon">
                      <i className="fa-solid fa-calendar-days"></i>
                    </div>
                    <div className="text">
                      Date <br />
                      {post.start_date && new Date(post.start_date).toLocaleDateString("en-GB")}
                    </div>
                  </div>

                  <div className="inner-block">
                    <div className="icon">
                      <i className="fa-regular fa-folder"></i>
                    </div>
                    <div className="text">
                      Category <br />
                      <ul style={{ paddingLeft: "15px", margin: 0 }}>
                        <li>{post.category_id || "Uncategorized"}</li>
                      </ul>
                    </div>
                  </div>

                  <h3 style={{ marginTop: "20px" }}>Share this event</h3>

                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <FacebookShareButton url={window.location.href} quote={post.title}>
                      <FacebookIcon size={30} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={window.location.href} title={post.title}>
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          background: "#000",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="white"
                        >
                          <path d="M18.244 2H21.5l-7.19 8.22L22 22h-6.828l-5.346-7.021L3.66 22H.4l7.693-8.793L2 2h6.995l4.835 6.36L18.244 2zm-1.2 18h1.803L7.972 4H6.037l11.007 16z" />
                        </svg>
                      </div>
                    </TwitterShareButton>
                    <LinkedinShareButton url={window.location.href} title={post.title}>
                      <LinkedinIcon size={30} round />
                    </LinkedinShareButton>
                    <WhatsappShareButton url={window.location.href} title={post.title}>
                      <WhatsappIcon size={30} round />
                    </WhatsappShareButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SingleEvent;
