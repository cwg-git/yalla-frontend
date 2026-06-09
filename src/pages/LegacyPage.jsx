import React, { useState, useEffect } from "react";
import {
  PiFolderSimple,
  PiCaretLeft,
  PiCaretRight,
  PiClock,
} from "react-icons/pi";
import axios from "axios";
import Categories from "../components/Categories";
import { env } from "../config";
import dayjs from "dayjs";

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

const LegacyPage = () => {
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
        <section className="testimonial text-center">
          <div className="container">
            <h3>The Prophet 1923</h3>
            <h2>
              <em>
                “Yesterday is but today’s memory, and tomorrow is today’s dream.”
              </em>
            </h2>

            <div className="d-flex">
              <img
                className="img-circle"
                src="images/Kahlil-Gibran-Portrait.webp"
                alt="Khalil Gibran"
              />

              <div className="name-designation">
                <h4>Khalil Gibran</h4>
                <h5>January 6, 1883 – April 10, 1931</h5>
              </div>
            </div>
          </div>
        </section>
        <section className="post-categories">
          <Categories type="posts" />
        </section>
        <section className="event-categories">
            <Categories type="events" />
        </section>
        <section className="post-categories map-categories">
          <Categories type="maps" />
        </section>
      </div>
    </div>
  );
};

export default LegacyPage;

