import React, { useState, useEffect } from "react";
import { PiCaretLeft, PiCaretRight } from "react-icons/pi";
import axios from "axios";
import { env } from "../config";
import Categories from "../components/Categories";
import CmsPage from "./CmsPage";
import dayjs from "dayjs";

// ---------- Helper: format date as YYYY-MM-DD ----------
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ---------- One category’s monthly calendar ----------
const MonthlyCategoryCalendar = ({ category, events }) => {
  const daysInMonth = new Date(
    events.currentMonth.getFullYear(),
    events.currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfWeek = new Date(
    events.currentMonth.getFullYear(),
    events.currentMonth.getMonth(),
    1
  ).getDay();

  const rows = [];
  let cells = [];
  let day = 1;

  // Fill blank cells before the 1st
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(null);
  }

  while (day <= daysInMonth) {
    cells.push(day);
    if (cells.length === 7) {
      rows.push(cells);
      cells = [];
    }
    day++;
  }
  // Fill remaining empty cells
  while (cells.length < 7 && cells.length > 0) {
    cells.push(null);
  }
  if (cells.length > 0) rows.push(cells);

  // Helper to get events for a specific day & category
  const getEventsForDay = (dayNumber) => {
    if (!dayNumber) return [];
    const dateStr = formatDate(
      new Date(events.currentMonth.getFullYear(), events.currentMonth.getMonth(), dayNumber)
    );
    return events.allEvents.filter(
      (ev) =>
        ev.start_date &&
        dayjs(ev.start_date).format("YYYY-MM-DD") === dateStr &&
        ev.category_id === category.name
    );
  };

  return (
    <div style={{ marginBottom: "3rem" }} key={category.id}>
      <h3
        style={{
          borderLeft: "4px solid #db7521",
          paddingLeft: "12px",
          marginBottom: "1.5rem",
        }}
      >
        {category.name}
      </h3>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed",
        }}
      >
        <thead>
          <tr>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <th
                key={d}
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  padding: "8px",
                  backgroundColor: "#f5f5f5",
                  border: "1px solid #ddd",
                }}
              >
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((week, wIdx) => (
            <tr key={wIdx}>
              {week.map((dayNum, dIdx) => (
                <td
                  key={dIdx}
                  style={{
                    height: "80px",
                    verticalAlign: "top",
                    padding: "4px",
                    border: "1px solid #eee",
                    backgroundColor: dayNum ? "#fff" : "#f9f9f9",
                  }}
                >
                  {dayNum && (
                    <>
                      <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                        {dayNum}
                      </div>
                      {getEventsForDay(dayNum).map((ev) => (
                        <div
                          key={ev.id}
                          style={{
                            fontSize: "0.75rem",
                            lineHeight: 1.2,
                            marginBottom: "2px",
                            backgroundColor: "#ffe9d4",
                            padding: "2px 3px",
                            borderRadius: "3px",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <a
                            href={ev.link || `/event/${ev.slug}`}
                            style={{
                              textDecoration: "none",
                              color: "#db7521",
                            }}
                            title={ev.title}
                          >
                            {ev.title}
                          </a>
                        </div>
                      ))}
                    </>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ---------- Main Agenda Component ----------
const Agendas = () => {
  const [categories, setCategories] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Fetch categories (same as TodayCalender)
  useEffect(() => {
    axios
      .get(`${env.baseUrl}/api/categories/events`)
      .then((res) => {
        let cats = res.data.categories || res.data.data || res.data;
        if (cats && cats.data) cats = cats.data;
        if (!Array.isArray(cats)) cats = [];
        setCategories(cats);
      })
      .catch((err) => console.error("Categories error:", err));
  }, []);

  // Fetch ALL events for the current month (same endpoint as TodayCalender)
  useEffect(() => {
    const start = formatDate(currentMonth);
    const lastDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );
    const end = formatDate(lastDay);
    const url = `${env.baseUrl}/api/posts/week?start_date=${start}&end_date=${end}`;

    console.log("Fetching events for:", start, "-", end); // debug
    axios
      .get(url)
      .then((res) => {
        const data = res.data.events || res.data.data || [];
        console.log("Events received:", data); // debug
        setAllEvents(data);
      })
      .catch((err) => {
        console.error("Events error:", err);
        setAllEvents([]);
      });
  }, [currentMonth]);

  const handlePrevMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(new Date(prev.getFullYear(), prev.getMonth(), 1));
  };

  const handleNextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(new Date(next.getFullYear(), next.getMonth(), 1));
  };

  return (
    <div>
      {/* Banner - From existing CMS Page */}
      <CmsPage slug="agendas" titleFallback="Monthly Agenda">
        <div className="post-categories">
          <div className="container">
          {/* Month Navigator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              marginBottom: "2rem",
            }}
          >
            <button
              onClick={handlePrevMonth}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="Previous month"
            >
              <PiCaretLeft size={18} />
            </button>
            <h4 style={{ margin: 0 }}>
              {currentMonth.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
              })}
            </h4>
            <button
              onClick={handleNextMonth}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="Next month"
            >
              <PiCaretRight size={18} />
            </button>
          </div>

          {/* One monthly table per category */}
          {categories.map((cat) => (
            <MonthlyCategoryCalendar
              key={cat.id}
              category={cat}
              events={{ allEvents, currentMonth }}
            />
          ))}
        </div>
        </div>

        {/* Event categories section */}
        <section className="event-categories">
          <Categories type="events" />
        </section>
      </CmsPage>
    </div>
  );
};

export default Agendas;