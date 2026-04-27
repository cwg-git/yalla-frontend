import React, { useState, useEffect, useRef } from "react";
import {
  PiFolderSimple,
  PiClock,
  PiCaretLeft,
  PiCaretRight,
} from "react-icons/pi";
import axios from "axios";
import { env } from "../config";
import Categories from "../components/Categories";
import dayjs from "dayjs";

// Helper: format date as YYYY-MM-DD (local timezone)
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Helper: parse YYYY-MM-DD string to local Date object
function parseDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Helper: get days in month
const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const days = [];
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const startDayOfWeek = firstDay.getDay();
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    // Create date using local time (year, month, day)
    days.push(new Date(year, month, i));
  }
  
  return days;
};

const TodayCalender = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  // Set initial selected date using local time
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return formatDate(today);
  });
  const [scrollPosition, setScrollPosition] = useState(0);
  const dateLabelsRef = useRef(null);

  // Calculate days
  const days = getDaysInMonth(currentDate);

  // Fetch categories on mount
  useEffect(() => {
    axios
      .get(`${env.baseUrl}/api/categories/events`)
      .then((response) => setCategories([...response.data.categories]))
      .catch((err) => console.error(err));
  }, []);

  // Fetch events for the current month and selected categories
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const start = `${year}-${month}-01`;
    // const end = `${year}-${month}-31`;
    const lastDay = new Date(year, currentDate.getMonth() + 1, 0).getDate();
    const end = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;
    const catParam =
      selectedCategories.length > 0 ? selectedCategories.join(",") : "";
    const url = `${
      env.baseUrl
    }/api/posts/week?start_date=${start}&end_date=${end}${
      catParam ? `&categories=${catParam}` : ""
    }`;
    axios
      .get(url)
      .then((res) => setEvents(res.data.events || res.data.data || []))
      .catch(() => setEvents([]));
  }, [currentDate, selectedCategories]);

  // Handle category checkbox change
  const handleCategoryChange = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Month navigation handlers
  const handlePrevMonth = () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentDate(prevMonth);
    // Set to first day of month
    const firstDay = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
    setSelectedDate(formatDate(firstDay));
    setScrollPosition(0);
    // Reset scroll position
    if (dateLabelsRef.current) {
      dateLabelsRef.current.scrollLeft = 0;
    }
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentDate(nextMonth);
    // Set to first day of month
    const firstDay = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
    setSelectedDate(formatDate(firstDay));
    setScrollPosition(0);
    // Reset scroll position
    if (dateLabelsRef.current) {
      dateLabelsRef.current.scrollLeft = 0;
    }
  };

  // Carousel scroll handlers
  const handleScrollLeft = () => {
    if (dateLabelsRef.current) {
      const container = dateLabelsRef.current;
      const scrollAmount = 150; // Scroll by fixed amount
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (dateLabelsRef.current) {
      const container = dateLabelsRef.current;
      const scrollAmount = 150; // Scroll by fixed amount
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Update scroll position on scroll
  const handleScroll = () => {
    if (dateLabelsRef.current) {
      setScrollPosition(dateLabelsRef.current.scrollLeft);
    }
  };

  // Handle day selection
  const handleDayClick = (day) => {
    if (day) {
      console.log("Clicked day:", day);
      console.log("Formatted date:", formatDate(day));
      setSelectedDate(formatDate(day));
    }
  };

  // Get events for selected date
  const selectedDateEvents = events.filter((ev) => {
    if (!ev.start_date) return false;

    return dayjs(ev.start_date).format("YYYY-MM-DD") === selectedDate;
  });

  // Count events for each day
  const getEventCountForDay = (day) => {
  if (!day) return 0;

  const dayStr = dayjs(day).format("YYYY-MM-DD");

  return events.filter((ev) => {
    if (!ev.start_date) return false;

    return dayjs(ev.start_date).format("YYYY-MM-DD") === dayStr;
  }).length;
};

  const isSelected = (day) => {
    if (!day) return false;
    return formatDate(day) === selectedDate;
  };

  // Parse selected date for display - use parseDate to avoid timezone issues
  const selectedDateObj = parseDate(selectedDate);
  const selectedDayOfWeek = selectedDateObj.toLocaleDateString(undefined, { weekday: "long" });
  const selectedDayOfMonth = selectedDateObj.getDate();

  return (
    <div>
      <div className="post-categories">
        <div className="container">
          <div className="title-block">
            <h4 className="border-top">Daily Events by Category</h4>
          </div>

          <div id="mec_skin_38529" className="mec-wrap colorskin-custom">
            {/* Category Filter */}
            <form
              id="mec_search_form_38529"
              className="mec-search-form mec-totalcal-box mec-dropdown-classic mec-skin-search-init"
              autoComplete="off"
            >
              <div className="mec-dropdown-wrap">
                <div className="mec-simple-checkboxes-search">
                  <i className="mec-sl-folder"></i>
                  <label htmlFor="mec_sf_category_38529">Category: </label>
                  <div className="mec-searchbar-category-wrap">
                    <ul id="mec_sf_category_38529">
                      {categories.map((cat) => (
                        <li key={cat.id} id={`mec_category-${cat.id}`}>
                          <label className="selectit">
                            <input
                              value={cat.slugurl || cat.name}
                              title={cat.name}
                              type="checkbox"
                              name="tax_input[mec_category][]"
                              id={`in-mec_category-${cat.id}`}
                              checked={selectedCategories.includes(cat.slugurl || cat.name)}
                              onChange={() => handleCategoryChange(cat.slugurl || cat.name)}
                            />{" "}
                            {cat.name}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </form>

            <div className="mec-calendar mec-calendar-daily">
              {/* Month Navigator */}
              <div className="cla-nav">
                <div className="mec-skin-daily-view-month-navigator-container mec-calendar-a-month mec-clear">
                  <div className="mec-month-navigator">
                    <div className="mec-previous-month mec-color mec-load-month" onClick={handlePrevMonth}>
                      <i className="mec-sl-angle-left"></i>
                    </div>
                    <h4>
                      {currentDate.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                      })}
                    </h4>
                    <div className="mec-color mec-next-month mec-load-month" onClick={handleNextMonth}>
                      <i className="mec-sl-angle-right"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mec-skin-daily-view-events-container" id="mec_skin_events_38529">
                <div className="mec-month-container mec-calendar-a-day mec-clear">
                  {/* Today Container */}
                  <div className="mec-today-container mec-calendar-d-top">
                    <h2>{selectedDayOfMonth}</h2>
                    <h3>{selectedDayOfWeek}</h3>
                    <div className="mec-today-count">
                      {selectedDateEvents.length} Event{selectedDateEvents.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Date Labels - Custom Scrollable */}
                  <div className="mec-date-labels-container mec-calendar-d-table">
                    <button 
                      className="mec-table-d-prev mec-color" 
                      onClick={handleScrollLeft}
                      style={{
                        position: 'absolute',
                        left: 0,
                        width: '55px',
                        margin: 0,
                        top: 0,
                        padding: 0,
                        height: '56px',
                      }}
                    >
                      <PiCaretLeft size={18} />
                    </button>
                    <div 
                      ref={dateLabelsRef}
                      className="mec-daily-view-date-labels"
                      onScroll={handleScroll}
                      style={{
                        display: 'flex',
                        overflowX: 'auto',
                        scrollBehavior: 'smooth',
                        gap: '2px',
                        padding: '0 35px',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                      }}
                    >
                      {days.map((day, idx) => {
                        if (!day) {
                          return (
                            <div key={`empty-${idx}`} className="mec-daily-view-day mec-empty"></div>
                          );
                        }
                        const eventCount = getEventCountForDay(day);
                        const dayClasses = [
                          "mec-daily-view-day",
                          eventCount > 0 ? "mec-has-event" : "",
                          isSelected(day) ? "mec-daily-view-day-active mec-color" : "",
                        ].filter(Boolean).join(" ");
                        
                        return (
                          <div
                            key={formatDate(day)}
                            className={dayClasses}
                            data-events-count={eventCount}
                            data-month-id={`${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, "0")}`}
                            data-day-id={formatDate(day).replace(/-/g, "")}
                            data-day-weekday={day.toLocaleDateString(undefined, { weekday: "long" })}
                            data-day-monthday={day.getDate()}
                            onClick={() => handleDayClick(day)}
                            style={{
                              minWidth: '50px',
                              height: '56px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              flexShrink: 0
                            }}
                          >
                            {day.getDate()}
                          </div>
                        );
                      })}
                    </div>
                    <button 
                      className="mec-table-d-next mec-color" 
                      onClick={handleScrollRight}
                      style={{
                        position: 'absolute',
                        right: 0,
                        width: '55px',
                        margin: 0,
                        top: 0,
                        padding: 0,
                        height: '56px',
                      }}
                    >
                      <PiCaretRight size={18} />
                    </button>
                  </div>

                  {/* Events List */}
                  <div className="mec-date-labels-container mec-calendar-day-events mec-clear">
                    <ul className="mec-daily-view-dates-events">
                      <li className="mec-daily-view-date-events" id={`mec_daily_view_date_events38529_${selectedDate.replace(/-/g, "")}`}>
                        {selectedDateEvents.length === 0 ? (
                          <article className="mec-event-article">
                            <div className="mec-daily-view-no-event mec-no-event">No event</div>
                          </article>
                        ) : (
                          selectedDateEvents.map((ev) => (
                            <article key={ev.id} className="mec-event-article">
                              <div className="mec-weekly-contents-wrapper">
                                {ev.image && (
                                  <div className="mec-event-image">
                                    <img
                                      loading="lazy"
                                      decoding="async"
                                      width="150"
                                      height="150"
                                      src={ev.image}
                                      className="attachment-thumbnail size-thumbnail wp-post-image"
                                      alt={ev.title}
                                    />
                                  </div>
                                )}
                                <div className="mec-weekly-contents">
                                  <div className="mec-event-time mec-color">
                                    <PiClock
                                                                                size={16}
                                                                                style={{
                                                                                  marginRight: 4,
                                                                                  verticalAlign: "middle",
                                                                                }}
                                                                              />{" "}
                                    {ev.time || ev.start_time || "All Day"}
                                  </div>

                                  <h4 className="mec-event-title">
                                    <a
                                      className="mec-color-hover"
                                      data-event-id={ev.id}
                                      href={ev.link || `/event/${ev.slug}`}
                                      target="_self"
                                      rel="noopener"
                                    >
                                      {ev.title}
                                    </a>
                                  </h4>

                                  {ev.location && (
                                    <div className="mec-event-detail">
                                      <div className="mec-event-loc-place">{ev.location}</div>
                                    </div>
                                  )}

                                  {ev.category_id && (
                                                                            <div className="mec-categories-wrapper">
                                                                              <PiFolderSimple
                                                                                size={16}
                                                                                style={{
                                                                                  marginRight: 2,
                                                                                  verticalAlign: "middle",
                                                                                }}
                                                                              />
                                                                              <ul className="mec-categories">
                                                                                <li className="mec-category">
                                                                                  {ev.category_id}
                                                                                </li>
                                                                              </ul>
                                                                            </div>
                                                                          )}
                                </div>
                              </div>
                            </article>
                          ))
                        )}
                      </li>
                    </ul>
                    <div className="mec-event-footer"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
        </div>
      </div>
      <section className="event-categories">
          <Categories type="events" />
        </section>
    </div>
  );
};

export default TodayCalender;