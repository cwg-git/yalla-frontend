import { useEffect, useState } from "react";
import axios from "axios";
import { env } from "../config";
import { useParams } from "react-router-dom";
import Categories from "../components/Categories";
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

  const getWeekDates = () => {
    const startOfMonth = currentMonth.startOf("month");
    
    // Find the start of week 1 (first day of month)
    let weekStart;
    
    if (currentWeek === 1) {
      weekStart = startOfMonth;
    } else {
      // For week 2 and beyond, add (currentWeek - 1) * 7 days from start of month
      weekStart = startOfMonth.add((currentWeek - 1) * 7, "day");
    }
    
    const days = [];

    for (let i = 0; i < 7; i++) {
      days.push(weekStart.add(i, "day"));
    }

    return days;
  };

  const weekDays = getWeekDates();

  /* WEEK OF MONTH CALCULATION - FIXED */
  const getWeekOfMonth = (date) => {
    const startOfMonth = dayjs(date).startOf("month");
    const dayOfMonth = dayjs(date).date();
    
    // Week 1: days 1-7
    // Week 2: days 8-14
    // Week 3: days 15-21
    // Week 4: days 22-28
    // Week 5: days 29-31
    return Math.ceil(dayOfMonth / 7);
  };

  /* GET TOTAL WEEKS IN CURRENT MONTH */
  const getWeeksInMonth = (month) => {
    const daysInMonth = month.daysInMonth();
    return Math.ceil(daysInMonth / 7);
  };

  /* CHECK IF EVENT IS EXPIRED */
  const isEventExpired = (postDate) => {
    return dayjs(postDate).isBefore(dayjs(), 'day');
  };

  /* VALIDATE CURRENT WEEK ON MONTH CHANGE */
  useEffect(() => {
    const weeksInMonth = getWeeksInMonth(currentMonth);
    if (currentWeek > weeksInMonth) {
      setCurrentWeek(weeksInMonth);
    }
  }, [currentMonth]);

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

  /* FILTER EVENTS FOR SELECTED MONTH + WEEK */
  const weekPosts = posts.filter((post) => {
    if (!post.start_date) return false; // 🚫 skip invalid events
    const postDate = dayjs(post.start_date);
    const sameMonth = postDate.isSame(currentMonth, "month");
    const week = getWeekOfMonth(postDate);
    
    return sameMonth && week === currentWeek;
  });
  console.log("Week Posts:", weekPosts);

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
                  className="nav-arrow prev"
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
                  className="nav-arrow next"
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
                  WEEK {currentWeek} of {getWeeksInMonth(currentMonth)}
                </span>

                <button
                  className="nav-arrow"
                  onClick={() => {
                    const weeksInMonth = getWeeksInMonth(currentMonth);
                    if (currentWeek < weeksInMonth) setCurrentWeek(currentWeek + 1);
                  }}
                >
                  ›
                </button>
              </div>

              {/* DAYS HEADER */}
              <div className="week-days">
                {weekDays.map((day, index) => (
                  <div key={index} className="week-day">
                    <span className="weekday">{day.format("ddd").toUpperCase()}</span>
                    <span className="date">{day.format("DD")}</span>
                  </div>
                ))}
              </div>

              {/* EVENTS */}
              <div className="events-list">
                {weekPosts.length === 0 && (
                  <div className="no-events">
                    No events this week
                  </div>
                )}

                {weekPosts.map((post) => {
                  const date = dayjs(post.start_date);
                  const expired = isEventExpired(post.start_date);

                  return (
                    <div className={`event-row ${expired ? 'expired' : ''}`} key={post.id}>
                      <div className="event-date">
                        <span className="day">{date.format("DD")}</span>
                        <span className="month">{date.format("MMM")}</span>
                      </div>

                      <div className="event-card">
                        <img src={post.image} alt={post.title} />

                        <div className="event-content">
                          <div className="event-meta">
                            <span className="event-time"><i className="fa-regular fa-clock"></i> All Day</span>
                          </div>

                          <div className="event-title">
                            <a href={`/event/${post.slug}`}>
                              {post.title}
                              {expired && (
                                <span className="expired-tag">Expired</span>
                              )}
                            </a>
                          </div>

                          <div className="event-category">
                           <i className="fa-regular fa-folder"></i> {post.category_id}
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
          <PostsMap posts={weekPosts} />
        </div>
      </section>
    </div>
  );
};

export default EventsByCategoorie;