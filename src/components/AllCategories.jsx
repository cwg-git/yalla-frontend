import { useEffect, useState } from "react";
import axios from "axios";
import { env } from "../config";
import { useLocation } from "react-router-dom";
const AllCategories = ({ type, direction = "horizontal", activeItem }) => {
  const location = useLocation();

  const activeSlug = location.pathname.split("/").pop();
  //console.log(currentactive);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    
    // Fetch Categories
    if (!type) {
      console.error("Type is required to fetch categories");
      return;
    }
    if (type === "posts") {
      axios
        .get(`${env.baseUrl}/api/categories/posts`)
        .then((response) => setCategories([...response.data.categories]))
        .catch((error) => console.error("Error fetching categories:", error));
    } else if (type === "events") {
      axios
        .get(`${env.baseUrl}/api/categories/events`)
        .then((response) => setCategories([...response.data.categories]))
        .catch((error) => console.error("Error fetching categories:", error));
    } else if (type === "maps") {
      axios
        .get(`${env.baseUrl}/api/categories/maps`)
        .then((response) => setCategories([...response.data.categories]))
        .catch((error) =>
          console.error("Error fetching map categories:", error)
        );
    }
  }, [type]);
  if (!type) {
    return null; // Return null if type is not provided
  }
  if (direction === "horizontal") {
    if (type === "posts") {
      return (
        <section className="post-categories">
          <div className="container">
            <div className="title-block">
              <h4>Post Categories</h4>
            </div>
            <div className="row">
              {categories.map((category) => (
                <div className="col-md-4 col-sm-4 col-xs-4" key={category.id}>
                  <a
                    className="btn"
                    href={`/post-category/${category.slugurl}`}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <img
                      src={`${env.baseUrl}/${category.icon}`}
                      alt={category.name}
                      height={30}
                      style={{
                        padding: "0 10px 0 15px",
                        zIndex: 10,
                        borderRadius: "50%",
                      }}
                    />
                    <span>{category.name}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    } else if (type === "events") {
      return (
        <section className="event-categories">
          <div className="container">
            <div className="title-block">
              <h4>Events Categories</h4>
            </div>
            <div className="row">
              {categories.map((category) => (
                <div className="col-md-4 col-sm-4 col-xs-4" key={category.id}>
                  <a
                    className="btn"
                    href={`/all-maps/${category.slugurl}`}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <img
                      src={`${env.baseUrl}/${category.icon}`}
                      alt={category.name}
                      height={30}
                      style={{
                        padding: "0 10px 0 15px",
                        zIndex: 10,
                        borderRadius: "50%",
                      }}
                    />
                    <span>{category.name}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    } else if (type === "maps") {
      return (
        <section className="post-categories map-categories">
          <div className="container">
            <div className="title-block">
            <h4>Map Categories</h4>
            </div>
            <div className="row">
              {categories.map((category) => (
                <div className="col-md-4 col-sm-4 col-xs-4" key={category.id}>
                  <a
                    className="btn"
                    href={`/maps-category/${category.slugurl}`}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    {category.icon && (
                      <img
                        src={`${env.baseUrl}/${category.icon}`}
                        alt={category.name}
                        height={30}
                        style={{
                          padding: "0 10px 0 15px",
                          zIndex: 10,
                          borderRadius: "50%",
                        }}
                      />
                    )}
                    <span>{category.name}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
  } else {
    if (type === "posts") {
      return (
        <div className="side-menu">
          <h4>Posts Categories</h4>
          <ul>
            {categories.map((cat) => (
              <li
                className={activeSlug === cat.slugurl ? "active" : ""}
                key={cat.id}
              >
                <a href={`/post-category/${cat.slugurl}`}>{cat.name}</a>
              </li>
            ))}
          </ul>
        </div>
      );
    } else if (type === "events") {
      return (
        <div className="side-menu">
          <h4>Events Categories</h4>
          <ul>
            {categories.map((cat) => (
              <li 
                className={activeSlug === cat.slugurl ? "active" : ""}
                key={cat.id}
              >
                <a href={`/all-maps/${cat.slugurl}`}>{cat.name}</a>
              </li>
            ))}
          </ul>
        </div>
      );
    }
  }
};

export default AllCategories;
