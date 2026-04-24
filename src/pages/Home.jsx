import { useEffect, useState } from "react";
import axios from "axios";
import icon1 from "../images/icon1.webp";
import icon2 from "../images/icon2.webp";
import icon3 from "../images/icon3.webp";
import icon4 from "../images/icon4.webp";
import Categories from "../components/Categories";
import LegacyBlock from "../components/LegacyBlock";
import { env } from "../config";
const Home = () => {
  const [posts, setPosts] = useState([]);
  const [pageData, setPageData] = useState({
    current_page: 1,
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
    axios
      .get(`${env.baseUrl}/api/posts/post?page=${pageData.current_page || 1}`)
      .then((response) => {
        setPosts(response.data.data);
        setPageData((prevState) => ({
          ...prevState,
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          total: response.data.total,
        }));
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, [pageData.current_page]); // <-- THIS is key

  return (
    <div>
      <section className="banner-block text-center d-none d-lg-block d-md-none">
        <div className="container">
          <div className="text-block text-center">
            <h3>
              <em>
                Welcome,<strong> Bienvenue,</strong>
              </em>
            </h3>
            <h1>أهلاً وسهلاً</h1>
            <h2>
              <span className="il">𐤀𐤊𐤌𐤀𐤋𐤊𐤍</span>
            </h2>
          </div>
        </div>
      </section>
      <section className="mobile-banner d-none d-md-block d-lg-none text-center">
        <div className="top-block">
          <div className="text-block">
            <h3>
              <strong>Welcome, Bienvenue,</strong>
            </h3>
            <h1>أهلاً وسهلاً ,</h1>
            <h2>
              <span className="il">𐤀𐤊𐤌𐤀𐤋𐤊𐤍</span>
            </h2>
          </div>
        </div>
        <div className="bottom-block">
          <p>The signing ceremony of “Hudhud Sin” by the poet Ali Matar</p>
        </div>
      </section>
      <section className="main-category-block">
        <div className="container">
          <div className="circle-block">
            <div className="row">
              <div className="col-md-3 col-sm-6">
                <div className="item text-center">
                  <figure className="box-img">
                    <img src={icon1} alt="Today" />
                  </figure>
                  <div className="box-title">
                    <a href="/today">Today</a>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div className="item text-center">
                  <figure className="box-img">
                    <img src={icon2} alt="This Week" />
                  </figure>
                  <div className="box-title">
                    <a href="/this-week">This week</a>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div className="item text-center">
                  <figure className="box-img">
                    <img src={icon3} alt="Agendas" />
                  </figure>
                  <div className="box-title">
                    <a href="/agendas">Agendas</a>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div className="item text-center">
                  <figure className="box-img">
                    <img src={icon4} alt="Legacy" />
                  </figure>
                  <div className="box-title">
                    <a href="/legacy">Legacy</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="post-block">
        <div className="container">
          <div className="title-block">
            <h4>Recent Posts</h4>
          </div>

          <div className="d-block d-lg-block d-md-none">
            <div className="row">
              {posts.map((post) => (
                <div className="col-lg-4 col-md-4" key={post.id}>
                  <div className="post-box">
                    <div className="post-image position-relative">
                      <div className="img-block">
                        <figure className="thumbnail zoom-effect">
                          <a href={`/post/${post.slug}`}>
                            <img src={post.image} alt={post.title} />
                          </a>
                        </figure>
                        <div className="bordered-effect">
                          <a href={`/post/${post.slug}`}  aria-label={post.title}></a>
                        </div>
                      </div>
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

          {/* Pagination */}
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
                  onClick={() => handlePageChange(pageData.current_page - 1)}
                >
                  &laquo; Previous
                </button>
              </li>

              {/* First Page */}
              {pageData.current_page > 2 && (
                <li
                  className={`page-item ${
                    pageData.current_page === 1 ? "active" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </button>
                </li>
              )}

              {/* Ellipsis before current range */}
              {pageData.current_page > 3 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}

              {/* Pages Around Current Page */}
              {Array.from({ length: pageData.last_page }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page >= pageData.current_page - 1 &&
                    page <= pageData.current_page + 1
                )
                .map((page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      page === pageData.current_page ? "active" : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}

              {/* Ellipsis after current range */}
              {pageData.current_page < pageData.last_page - 2 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}

              {/* Last Page */}
              {pageData.current_page < pageData.last_page - 1 && (
                <li
                  className={`page-item ${
                    pageData.current_page === pageData.last_page ? "active" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => handlePageChange(pageData.last_page)}
                  >
                    {pageData.last_page}
                  </button>
                </li>
              )}

              {/* Next Button */}
              <li
                className={`page-item ${
                  pageData.current_page === pageData.last_page ? "disabled" : ""
                }`}
              >
                <button
                  type="button"
                  className="page-link"
                  onClick={() => handlePageChange(pageData.current_page + 1)}
                >
                  Next &raquo;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </section>
      <Categories type="posts" />
      <Categories type="events" />
      <LegacyBlock />
    </div>
  );
};

export default Home;
