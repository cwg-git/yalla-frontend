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

// ----- Helper functions (same as yours) -----
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const days = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDayOfWeek = firstDay.getDay();
  for (let i = 0; i < startDayOfWeek; i++) days.push(null);
  for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
  return days;
};
// -------------------------------------------

// ---------- Component for one category's daily calendar ----------
const CategoryCalendar = ({ category, events, currentDate, selectedDate, onDateSelect, onPrevMonth, onNextMonth }) => {
  const dateLabelsRef = useRef(null);
  const days = getDaysInMonth(currentDate);

  const handleScrollLeft = () => {
    if (dateLabelsRef.current) dateLabelsRef.current.scrollBy({ left: -150, behavior: 'smooth' });
  };
  const handleScrollRight = () => {
    if (dateLabelsRef.current) dateLabelsRef.current.scrollBy({ left: 150, behavior: 'smooth' });
  };

  const getEventsForDate = (dateStr) => {
    return events.filter(ev => 
      ev.start_date && 
      dayjs(ev.start_date).format("YYYY-MM-DD") === dateStr && 
      ev.category_id === category.name
    );
  };

  const getEventCountForDay = (day) => {
    if (!day) return 0;
    const dayStr = dayjs(day).format("YYYY-MM-DD");
    return events.filter(ev => 
      ev.start_date && 
      dayjs(ev.start_date).format("YYYY-MM-DD") === dayStr && 
      ev.category_id === category.name
    ).length;
  };

  const isSelected = (day) => day && formatDate(day) === selectedDate;

  const selectedDateObj = parseDate(selectedDate);
  const selectedDayOfWeek = selectedDateObj.toLocaleDateString(undefined, { weekday: "long" });
  const selectedDayOfMonth = selectedDateObj.getDate();
  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    // Force each calendar to be a visible block – prevents CSS hiding
    <div 
      style={{ 
        marginBottom: "3rem", 
        borderBottom: "1px solid #eee", 
        paddingBottom: "2rem",
        clear: "both",
        position: "relative",
        display: "block",
        overflow: "visible",
        height: "auto",
        float: "none",
        width: "100%"
      }}
    >
      <h3 style={{ borderLeft: "4px solid #db7521", paddingLeft: "12px", marginBottom: "1.5rem" }}>
        {category.name}
      </h3>

      {/* The main calendar – add inline overrides for MEC classes */}
      <div 
        className="mec-calendar mec-calendar-daily" 
        style={{ overflow: "visible", height: "auto", position: "relative", clear: "both" }}
      >
        {/* Month Navigator */}
        <div className="cla-nav">
          <div className="mec-skin-daily-view-month-navigator-container mec-calendar-a-month mec-clear">
            <div className="mec-month-navigator">
              <div className="mec-previous-month mec-color mec-load-month" onClick={onPrevMonth}>
                <i className="mec-sl-angle-left"></i>
              </div>
              <h4>
                {currentDate.toLocaleDateString(undefined, { year: "numeric", month: "long" })}
              </h4>
              <div className="mec-color mec-next-month mec-load-month" onClick={onNextMonth}>
                <i className="mec-sl-angle-right"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="mec-skin-daily-view-events-container" style={{ overflow: "visible" }}>
          <div className="mec-month-container mec-calendar-a-day mec-clear">
            {/* Today Container */}
            <div className="mec-today-container mec-calendar-d-top">
              <h2>{selectedDayOfMonth}</h2>
              <h3>{selectedDayOfWeek}</h3>
              <div className="mec-today-count">
                {selectedDateEvents.length} Event{selectedDateEvents.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Date Labels with scroll buttons */}
            <div className="mec-date-labels-container mec-calendar-d-table" style={{ position: "relative" }}>
              <button 
                className="mec-table-d-prev mec-color" 
                onClick={handleScrollLeft}
                style={{
                  position: 'absolute', left: 0, width: '55px', margin: 0, top: 0, padding: 0, height: '56px', zIndex: 1, background: 'transparent', border: 'none', cursor: 'pointer'
                }}
              >
                <PiCaretLeft size={18} />
              </button>
              <div 
                ref={dateLabelsRef}
                className="mec-daily-view-date-labels"
                style={{
                  display: 'flex', overflowX: 'auto', scrollBehavior: 'smooth', gap: '2px',
                  padding: '0 35px', scrollbarWidth: 'none', msOverflowStyle: 'none'
                }}
              >
                {days.map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} className="mec-daily-view-day mec-empty" style={{ minWidth: '50px', height: '56px' }}></div>;
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
                      onClick={() => onDateSelect(day)}
                      style={{
                        minWidth: '50px', height: '56px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', cursor: 'pointer', flexShrink: 0
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
                  position: 'absolute', right: 0, width: '55px', margin: 0, top: 0, padding: 0, height: '56px', zIndex: 1, background: 'transparent', border: 'none', cursor: 'pointer'
                }}
              >
                <PiCaretRight size={18} />
              </button>
            </div>

            {/* Events List */}
            <div className="mec-date-labels-container mec-calendar-day-events mec-clear">
              <ul className="mec-daily-view-dates-events">
                <li className="mec-daily-view-date-events">
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
                              <img loading="lazy" width="150" height="150" src={ev.image} alt={ev.title} />
                            </div>
                          )}
                          <div className="mec-weekly-contents">
                            <div className="mec-event-time mec-color">
                              <PiClock size={16} style={{ marginRight: 4, verticalAlign: "middle" }} />{" "}
                              {ev.time || ev.start_time || "All Day"}
                            </div>
                            <h4 className="mec-event-title">
                              <a className="mec-color-hover" href={ev.link || `/event/${ev.slug}`}>
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
                                <PiFolderSimple size={16} style={{ marginRight: 2, verticalAlign: "middle" }} />
                                <ul className="mec-categories">
                                  <li className="mec-category">{ev.category_id}</li>
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
  );
};

// ---------- Main TodayCalender component ----------
const TodayCalender = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(() => formatDate(new Date()));

  // Fetch categories – robust parsing
  useEffect(() => {
    axios.get(`${env.baseUrl}/api/categories/events`)
      .then(res => {
        let cats = 
          res.data.categories || 
          res.data.data || 
          res.data;
        if (cats && cats.data) cats = cats.data;
        if (!Array.isArray(cats)) cats = [];
        setCategories(cats);
      })
      .catch(err => console.error(err));
  }, []);

  // Fetch events for current month
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const start = `${year}-${month}-01`;
    const lastDay = new Date(year, currentDate.getMonth() + 1, 0).getDate();
    const end = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;
    const url = `${env.baseUrl}/api/posts/week?start_date=${start}&end_date=${end}`;
    axios.get(url)
      .then(res => setEvents(res.data.events || res.data.data || []))
      .catch(() => setEvents([]));
  }, [currentDate]);

  const handlePrevMonth = () => {
    const prev = new Date(currentDate);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentDate(prev);
    setSelectedDate(formatDate(new Date(prev.getFullYear(), prev.getMonth(), 1)));
  };

  const handleNextMonth = () => {
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + 1);
    setCurrentDate(next);
    setSelectedDate(formatDate(new Date(next.getFullYear(), next.getMonth(), 1)));
  };

  const handleDateSelect = (day) => {
    if (day) setSelectedDate(formatDate(day));
  };

  return (
    <div>
      <div className="post-categories">
        <div className="container">
          <div className="title-block">
            <h4 className="border-top">Daily Events by Category</h4>
          </div>
          <div id="mec_skin_38529" className="mec-wrap colorskin-custom" style={{ display: "unset" }}>
            {categories.map((category, idx) => (
              <CategoryCalendar
                key={category.id || idx}
                category={category}
                events={events}
                currentDate={currentDate}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
              />
            ))}
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