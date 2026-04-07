import { useEffect, useState } from "react";
import axios from "axios";
import { env } from "../config";
import { useParams } from "react-router-dom";
import Categories from "../components/Categories";
import LegacyBlock from "../components/LegacyBlock";
import PostsMap from "../components/PostsMap";
import dayjs from "dayjs";

const EventsByCategoorie = () => {

  const { key } = useParams();

  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const [pageData, setPageData] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const handlePageChange = (page) => {
    if (page !== pageData.current_page && page > 0 && page <= pageData.last_page) {
      setPageData((prev) => ({
        ...prev,
        current_page: page,
      }));
    }
  };

  useEffect(() => {

    if (!key) return;

    axios
      .get(`${env.baseUrl}/api/events/${key}?page=${pageData.current_page}`)
      .then((response) => {

        const eventPosts = response.data.posts.data;

        setCategory(response.data.category);
        setPosts(eventPosts);

        setPageData({
          current_page: response.data.posts.current_page,
          last_page: response.data.posts.last_page,
          total: response.data.posts.total,
        });

      })
      .catch((error) => console.error("Error fetching posts:", error));

  }, [key, pageData.current_page]);



  /* WEEK OF MONTH CALCULATION */

  const getWeekOfMonth = (date) => {

    const start = dayjs(date).startOf("month");
    const diff = dayjs(date).diff(start, "day");

    return Math.ceil((diff + start.day()) / 7);

  };



  /* FILTER EVENTS FOR SELECTED MONTH + WEEK */

  const weekPosts = posts.filter((post) => {

    const postDate = dayjs(post.post_date);

    const sameMonth = postDate.isSame(currentMonth, "month");

    const week = getWeekOfMonth(postDate);

    return sameMonth && week === currentWeek;

  });



  return (

    <div>

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

            <div className="calendar-box">


              {/* MONTH NAV */}

              <div className="calendar-header">

                <button
                  className="nav-arrow"
                  onClick={() => {
                    setCurrentMonth(currentMonth.subtract(1, "month"));
                    setCurrentWeek(1);
                  }}
                >
                  ‹
                </button>

                <div className="calendar-month">
                  {currentMonth.format("YYYY MMMM")}
                </div>

                <button
                  className="nav-arrow"
                  onClick={() => {
                    setCurrentMonth(currentMonth.add(1, "month"));
                    setCurrentWeek(1);
                  }}
                >
                  ›
                </button>

              </div>


              {/* WEEK NAV */}

              <div className="week-navigation">

                <button
                  className="nav-arrow"
                  onClick={() => {
                    if (currentWeek > 1) setCurrentWeek(currentWeek - 1);
                  }}
                >
                  ‹
                </button>

                <span className="week-label">
                  WEEK {currentWeek}
                </span>

                <button
                  className="nav-arrow"
                  onClick={() => {
                    if (currentWeek < 5) setCurrentWeek(currentWeek + 1);
                  }}
                >
                  ›
                </button>

              </div>


              {/* DAYS HEADER */}

              <div className="week-days">
                <div>MON</div>
                <div>TUE</div>
                <div>WED</div>
                <div>THU</div>
                <div>FRI</div>
                <div>SAT</div>
                <div>SUN</div>
              </div>


              {/* EVENTS */}

              <div className="events-list">

                {weekPosts.length === 0 && (
                  <div className="no-events">
                    No events this week
                  </div>
                )}


                {weekPosts.map((post) => {

                  const date = dayjs(post.post_date);

                  return (

                    <div className="event-row" key={post.id}>

                      <div className="event-date">
                        <span className="day">{date.format("DD")}</span>
                        <span className="month">{date.format("MMM")}</span>
                      </div>

                      <div className="event-card">

                        <img src={post.image} alt={post.title} />

                        <div className="event-content">

                          <div className="event-meta">
                            <span className="event-time">All Day</span>
                          </div>

                          <div className="event-title">
                            <a href={`/event/${post.slug}`}>
                              {post.title}
                            </a>
                          </div>

                          <div className="event-category">
                            {post.category_id}
                          </div>

                        </div>

                      </div>

                    </div>

                  );

                })}

              </div>


            </div>

          </div>


          <div className="clearfix" />

        </div>

      </section>


      <section className="passive-map">
        <div className="container">
          <PostsMap posts={posts} />
        </div>
      </section>


      <LegacyBlock />

    </div>

  );

};

export default EventsByCategoorie;