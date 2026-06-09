import React, { useState, useEffect } from "react";
import {
  PiFolderSimple,
  PiCaretLeft,
  PiCaretRight,
  PiClock,
} from "react-icons/pi";
import axios from "axios";
import LegacyBlock from "../components/LegacyBlock";
import Categories from "../components/Categories";
import { env } from "../config";

// Helper: get week number in month
function getWeekNumber(date) {
  // Get the first day of the month
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  // Get the day of week for the first day (0=Sun, 1=Mon, ...)
  const firstDayOfWeek = firstDay.getDay();
  // Calculate offset: if week starts on Monday, adjust so Monday=0
  const offset = (firstDayOfWeek + 6) % 7;
  // Calculate the week number in the month
  return Math.ceil((date.getDate() + offset) / 7);
}

const YesterdayCalender = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(
    getStartOfWeek(new Date())
  );

  // Fetch categories on mount
  useEffect(() => {
    axios
      .get(`${env.baseUrl}/api/categories/events`)
      .then((response) => setCategories([...response.data.categories]))
      .catch((err) => console.error(err));
  }, []);

  // Fetch events for the current week and selected categories
  useEffect(() => {
    const start = formatDate(currentWeekStart);
    const end = formatDate(getEndOfWeek(currentWeekStart));
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
      .catch((err) => setEvents([]));
  }, [currentWeekStart, selectedCategories]);

  // Helper: get start of week (Monday)
  function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(d.setDate(diff));
  }

  // Helper: get array of days for the week
  function getWeekDays(start) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  }

  // Helper: get end of week (Sunday)
  function getEndOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() + (7 - day);
    return new Date(d.setDate(diff));
  }

  // Helper: format date as YYYY-MM-DD
  function formatDate(date) {
    return date.toISOString().split("T")[0];
  }
  // Handle category checkbox change
  const handleCategoryChange = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Navigation handlers
  const handlePrevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(getStartOfWeek(prev));
  };
  const handleNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(getStartOfWeek(next));
  };

  // Month navigation handlers
  const handlePrevMonth = () => {
    const prevMonth = new Date(currentWeekStart);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentWeekStart(getStartOfWeek(prevMonth));
  };
  const handleNextMonth = () => {
    const nextMonth = new Date(currentWeekStart);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentWeekStart(getStartOfWeek(nextMonth));
  };

  return (
    <div>
      {/* Banner */}
       

      <div>
        <section className="thisweek">
          <div className="container">
            <h4>Yesterday Events by Category</h4>
            <div id="mec_skin_38523" className="mec-wrap colorskin-custom">
              <form
                id="mec_search_form_38523"
                className="mec-search-form mec-totalcal-box mec-dropdown-classic mec-skin-search-init"
                autoComplete="off"
              >
                <div className="mec-dropdown-wrap">
                  <div className="mec-simple-checkboxes-search">
                    <PiFolderSimple
                      size={18}
                      style={{ verticalAlign: "middle" }}
                    />
                    <label htmlFor="mec_sf_category_38523">Category: </label>
                    <div className="mec-searchbar-category-wrap">
                      <ul id="mec_sf_category_38523">
                        {categories.map((cat) => (
                          <li key={cat.id} id={`mec_category-${cat.id}`}>
                            <label className="selectit">
                              <input
                                defaultValue={cat.id}
                                title={cat.name}
                                type="checkbox"
                                name="tax_input[mec_category][]"
                                id={`in-mec_category-${cat.id}`}
                                checked={selectedCategories.includes(
                                  cat.slugurl || cat.name
                                )}
                                onChange={() =>
                                  handleCategoryChange(cat.slugurl || cat.name)
                                }
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
              <div className="mec-calendar mec-calendar-daily mec-calendar-weekly">
                <div className="mec-skin-weekly-view-month-navigator-container mec-calendar-a-month mec-clear">
                  <div className="mec-month-navigator" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                    <div
                      className="mec-previous-month mec-load-month mec-color"
                      style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <button
                        type="button"
                        className="mec-load-month-link"
                        onClick={handlePrevMonth}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          margin: 0,
                          cursor: "pointer",
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        aria-label="Previous month"
                      >
                        <PiCaretLeft size={18} />
                      </button>
                    </div>
                    <h4 className="mec-month-label">
                      {currentWeekStart.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                      })}
                    </h4>
                    <div
                      className="mec-next-month mec-load-month mec-color"
                      style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                    >
                      <button
                        type="button"
                        className="mec-load-month-link"
                        onClick={handleNextMonth}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          margin: 0,
                          cursor: "pointer",
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        aria-label="Next month"
                      >
                        <PiCaretRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mec-skin-weekly-view-events-container">
                  <div className="mec-month-container">
                    <div className="mec-calendar-d-top">
                      <div
                        className="mec-previous-month mec-load-week mec-color"
                        onClick={handlePrevWeek}>
                        <PiCaretLeft size={18} />
                      </div>
                      <h3 className="mec-current-week">
                        Week <span>{getWeekNumber(currentWeekStart)}</span>
                      </h3>
                      <div
                        className="mec-next-month mec-load-week mec-color"
                        onClick={handleNextWeek}>
                        <PiCaretRight size={18} />
                      </div>
                    </div>
                    <div className="mec-weeks-container mec-calendar-d-table">
                      <dl className="mec-weekly-view-week mec-weekly-view-week-active">
                        {getWeekDays(currentWeekStart).map((day, idx) => (
                          <dt
                            key={formatDate(day)}
                            className="mec-weekly-view-weekday-cell"
                          >
                            <span className="mec-weekly-view-weekday">
                              {day.toLocaleDateString(undefined, {
                                weekday: "short",
                              })}
                            </span>{" "}
                            <span className="mec-weekly-view-monthday">
                              {day.getDate()}
                            </span>
                          </dt>
                        ))}
                      </dl>
                    </div>
                    <div className="mec-week-events-container">
                      <ul className="mec-weekly-view-dates-events">
                        {events.length === 0 ? (
                          <li
                            style={{
                              width: "100%",
                              textAlign: "center",
                              padding: "60px 0",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                              }}
                            >
                              <span style={{ fontSize: 24, color: "#888" }}>
                                No Events
                              </span>
                            </div>
                          </li>
                        ) : (
                          getWeekDays(currentWeekStart).map((day, idx) => {
                            const dayEvents = events.filter((ev) => {
                              const eventDate =
                                ev.post_date ||
                                ev.date ||
                                ev.start_date ||
                                ev.startDate;
                              return eventDate === formatDate(day);
                            });
                            if (dayEvents.length === 0) return null;
                            return dayEvents.map((ev) => (
                              <li
                                key={ev.id + "-" + formatDate(day)}
                                className="mec-weekly-view-date-events mec-calendar-day-events mec-clear"
                              >
                                <a
                                  href={ev.link || `/post/${ev.slug}` }
                                  rel="noopener noreferrer"
                                  className="block hover:no-underline"
                                >
                                  <article className="mec-event-article">
                                    <div className="mec-event-list-weekly-date mec-color">
                                      <span className="mec-date-day">
                                        {day.getDate()}
                                      </span>
                                      {day.toLocaleDateString(undefined, {
                                        month: "long",
                                      })}
                                    </div>
                                    <div className="mec-weekly-contents-wrapper">
                                      {ev.image && (
                                        <div className="mec-event-image">
                                          <img
                                            loading="lazy"
                                            decoding="async"
                                            width={150}
                                            height={150}
                                            src={ev.image}
                                            className="attachment-thumbnail size-thumbnail 
                                        wp-post-image"
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
                                          {ev.time ||
                                            ev.start_time ||
                                            "All Day"}
                                        </div>
                                        <h4 className="mec-event-title">
                                          {ev.link ? (
                                            <a
                                              className="mec-color-hover"
                                              href={ev.link || `/post/${ev.slug}` }
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              {ev.title}
                                            </a>
                                          ) : (
                                            ev.title
                                          )}
                                        </h4>
                                        <div className="mec-event-detail">
                                          {ev.location && (
                                            <div className="mec-event-loc-place">
                                              {ev.location}
                                            </div>
                                          )}
                                        </div>
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
                                </a>
                              </li>
                            ));
                          })
                        )}
                      </ul>
                      <div className="mec-event-footer" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="event-categories">
          <Categories type="events" />
        </section>
      </div>
      <section>
        <LegacyBlock />
      </section>
    </div>
  );
};

export default YesterdayCalender;

