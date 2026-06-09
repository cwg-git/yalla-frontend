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
import dayjs from "dayjs";

import CmsPage from "./CmsPage";

// ---------- Helper functions (unchanged) ----------
function getWeekNumber(date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayOfWeek = firstDay.getDay();
  const offset = (firstDayOfWeek + 6) % 7;
  return Math.ceil((date.getDate() + offset) / 7);
}

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function getEndOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() + (7 - day);
  return new Date(d.setDate(diff));
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function getWeekDays(start) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push(day);
  }
  return days;
}
// ------------------------------------------------

const ThisWeek = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(
    getStartOfWeek(new Date())
  );

  // Fetch categories
  useEffect(() => {
    axios
      .get(`${env.baseUrl}/api/categories/events`)
      .then((response) => setCategories(response.data.categories || []))
      .catch((err) => console.error(err));
  }, []);

  // Fetch ALL events for the current week (no category filter)
  useEffect(() => {
    const start = formatDate(currentWeekStart);
    const end = formatDate(getEndOfWeek(currentWeekStart));
    const url = `${env.baseUrl}/api/posts/week?start_date=${start}&end_date=${end}`;
    axios
      .get(url)
      .then((res) => setEvents(res.data.events || res.data.data || []))
      .catch((err) => setEvents([]));
  }, [currentWeekStart]);

  // Global navigation (affects all categories)
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

  // Render a complete calendar for one category
  const renderCategoryCalendar = (category) => {
    // Filter events for this category (category_id holds the category name)
    const categoryEvents = events.filter(
      (ev) => ev.category_id === category.name
    );
    const weekDays = getWeekDays(currentWeekStart);

    return (
      <div key={category.id} style={{ marginBottom: "3rem" }}>
        {/* Category title */}
        <h3
          style={{
            borderLeft: "4px solid #db7521",
            paddingLeft: "12px",
            marginBottom: "1.5rem",
            fontSize: "1.75rem",
          }}
        >
          {category.name}
        </h3>

        {/* Full calendar structure (identical to original) */}
        <div className="mec-calendar mec-calendar-daily mec-calendar-weekly">
          {/* Month navigator */}
          <div className="mec-skin-weekly-view-month-navigator-container mec-calendar-a-month mec-clear">
            <div
              className="mec-month-navigator"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
              }}
            >
              <button
                onClick={handlePrevMonth}
                className="mec-load-month-link"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                aria-label="Previous month"
              >
                <PiCaretLeft size={18} />
              </button>
              <h4 className="mec-month-label">
                {currentWeekStart.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                })}
              </h4>
              <button
                onClick={handleNextMonth}
                className="mec-load-month-link"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                aria-label="Next month"
              >
                <PiCaretRight size={18} />
              </button>
            </div>
          </div>

          {/* Week navigator */}
          <div className="mec-calendar-d-top">
            <div
              className="mec-previous-month mec-load-week mec-color"
              onClick={handlePrevWeek}
              style={{ cursor: "pointer" }}
            >
              <PiCaretLeft size={18} />
            </div>
            <h3 className="mec-current-week">
              Week <span>{getWeekNumber(currentWeekStart)}</span>
            </h3>
            <div
              className="mec-next-month mec-load-week mec-color"
              onClick={handleNextWeek}
              style={{ cursor: "pointer" }}
            >
              <PiCaretRight size={18} />
            </div>
          </div>

          {/* Day headers */}
          <div className="mec-weeks-container mec-calendar-d-table">
            <dl className="mec-weekly-view-week mec-weekly-view-week-active">
              {weekDays.map((day) => (
                <dt key={formatDate(day)} className="mec-weekly-view-weekday-cell">
                  <span className="mec-weekly-view-weekday">
                    {day.toLocaleDateString(undefined, { weekday: "short" })}
                  </span>{" "}
                  <span className="mec-weekly-view-monthday">{day.getDate()}</span>
                </dt>
              ))}
            </dl>
          </div>

          {/* Events container */}
          <div className="mec-week-events-container">
            <ul className="mec-weekly-view-dates-events">
              {categoryEvents.length === 0 ? (
                <li
                  style={{
                    width: "100%",
                    textAlign: "center",
                    padding: "60px 0",
                  }}
                >
                  <span style={{ fontSize: 24, color: "#888" }}>
                    No events this week
                  </span>
                </li>
              ) : (
                weekDays.map((day) => {
                  const dayEvents = categoryEvents.filter((ev) => {
                    if (!ev.start_date) return false;
                    return (
                      dayjs(ev.start_date).format("YYYY-MM-DD") ===
                      dayjs(day).format("YYYY-MM-DD")
                    );
                  });
                  if (dayEvents.length === 0) return null;
                  return dayEvents.map((ev) => (
                    <li
                      key={`${category.id}-${ev.id}-${formatDate(day)}`}
                      className="mec-weekly-view-date-events mec-calendar-day-events mec-clear"
                    >
                      <a
                        href={ev.link || `/event/${ev.slug}`}
                        rel="noopener noreferrer"
                        className="block hover:no-underline"
                      >
                        <article className="mec-event-article">
                          <div className="mec-event-list-weekly-date mec-color">
                            <span className="mec-date-day">{day.getDate()}</span>
                            {day.toLocaleDateString(undefined, { month: "long" })}
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
                                  className="attachment-thumbnail size-thumbnail wp-post-image"
                                  alt={ev.title}
                                />
                              </div>
                            )}
                            <div className="mec-weekly-contents">
                              <div className="mec-event-time mec-color">
                                <PiClock
                                  size={16}
                                  style={{ marginRight: 4, verticalAlign: "middle" }}
                                />{" "}
                                {ev.time || ev.start_time || "All Day"}
                              </div>
                              <h4 className="mec-event-title">
                                <a
                                  className="mec-color-hover"
                                  href={ev.link || `/event/${ev.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {ev.title}
                                </a>
                              </h4>
                              <div className="mec-event-detail">
                                {ev.location && (
                                  <div className="mec-event-loc-place">{ev.location}</div>
                                )}
                              </div>
                              {ev.category_id && (
                                <div className="mec-categories-wrapper">
                                  <PiFolderSimple
                                    size={16}
                                    style={{ marginRight: 2, verticalAlign: "middle" }}
                                  />
                                  <ul className="mec-categories">
                                    <li className="mec-category">{ev.category_id}</li>
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
    );
  };

  return (
    <div>
      {/* Banner - From existing CMS Page */}
      <CmsPage slug="thisweek" titleFallback="This Week">

      <div>
        <section className="thisweek">
          <div className="container">
            <h4>Weekly Events by Category</h4>
            <div id="mec_skin_38523" className="mec-wrap colorskin-custom" style={{ display: "unset" }}  >
              {/* One full calendar per category */}
              {categories.map((category) => renderCategoryCalendar(category))}
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
      </CmsPage>
    </div>
  );
};

export default ThisWeek;