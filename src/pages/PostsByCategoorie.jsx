import { useEffect, useState } from "react";
import axios from "axios";
import { env } from "../config";
import { useParams } from "react-router-dom";
import Categories from "../components/Categories";
import LegacyBlock from "../components/LegacyBlock";
import PostsMap from "../components/PostsMap";
const PostsByCategoorie = () => {
  const params = useParams();
  const { key } = params;
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [pageData, setPageData] = useState({
    current_page: 0,
    last_page: 0,
    total: 0,
  });

  const handlePageChange = (page) => {
    if (
      page !== pageData.current_page &&
      page > 0 &&
      page <= pageData.last_page
    ) {
      setPageData((prevState) => ({
        ...prevState,
        current_page: page,
      }));
    }
  };
  useEffect(() => {
    if (!key) return; // wait until key is available

    axios
      .get(`${env.baseUrl}/api/posts/${key}?page=${pageData.current_page || 1}`)
      .then((response) => {
        console.log(response.data);
        setCategory(response.data.category);
        setPosts(response.data.posts.data); // since Laravel paginate wraps data
        setPageData({
          current_page: response.data.posts.current_page,
          last_page: response.data.posts.last_page,
          total: response.data.posts.total,
        });
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, [key, pageData.current_page]);
  
  return (
    <div>
      <section className="inner-banner">
        <div className="container">
          <div className="text-block">
            <h3>
              <em>Category</em>
            </h3>
            <h1>{category}</h1>
          </div>
        </div>
      </section>
      <section className="thisweek event-category">
        <div className="container">
          <div className="lt-panel">
            <Categories type="posts" direction="vertical" activeItem={key} />
            {/* <Categories type="events" direction="vertical" /> */}
          </div>
          <div className="rt-panel">
            <div className="post-block">
              <div className="d-block d-lg-block d-md-none">
                <div className="row">
                  {posts.map((post) => (
                    <div className="col-lg-4" key={post.id}>
                      <div className="post-box">
                        <div className="post-image position-relative">
                          {" "}
                          <div class="img-block">
                            <figure className="thumbnail zoom-effect">
                              <a href={`/post/${post.slug}`}>
                                <img src={post.image} alt={post.title} />
                              </a>
                            </figure>
                            <div class="bordered-effect">
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
              <div className="d-block d-md-block d-lg-none">
                <div className="row">
                  {posts.map((post) => (
                    <div className="col-sm-6" key={post.id}>
                      <div className="post-box">
                        <div className="post-image position-relative">
                          {" "}
                          <div class="img-block">
                            <figure className="thumbnail zoom-effect">
                              <a href={`/post/${post.slug}`}>
                                <img src={post.image} alt={post.title} />
                              </a>
                            </figure>
                            <div class="bordered-effect">
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
                    <div className="col-xs-12" key={post.id}>
                      <div className="post-box">
                        <div className="post-image position-relative">
                          {" "}
                          <div class="img-block">
                            <figure className="thumbnail zoom-effect">
                              <a href={`/post/${post.slug}`}>
                                <img src={post.image} alt={post.title} />
                              </a>
                            </figure>
                            <div class="bordered-effect">
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
              <nav className="post-pagination" aria-label="post navigation">
                <ul className="pagination">
                  {/* Previous Button */}
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

                  {/* Page Number Buttons */}
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

                  {/* Next Button */}
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
            </div>
          </div>
          <div className="clearfix" />
        </div>
      </section>
      {/* <section className="passive-map">
        <div className="container">
          <iframe
            src="https://www.google.com/maps/d/embed?mid=1wQ9-Q_Stox1n6bwyudXNlTfS93J1kpA&ehbc=2E312F&noprof=1"
            width={640}
            height={480}
            title="Lebanon Map"
          />
        </div>
      </section> */}
      <section className="passive-map">
        <div className="container">
          <PostsMap posts={posts} />
        </div>
      </section>
      <LegacyBlock />
    </div>
  );
};

export default PostsByCategoorie;
