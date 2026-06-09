import React, { useEffect, useState } from "react";
import axios from "axios";
import { env } from "../config";
import { PiClock } from "react-icons/pi";
import TodayCalender from "./TodayCalender"
import CmsPage from "./CmsPage";

const Today = () => {
  const [events, setEvents] = useState([]);

  // format date
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    const today = formatDate(new Date());

    axios
      .get(`${env.baseUrl}/api/posts/day?date=${today}`)
      .then((res) => {
        setEvents(res.data.events || res.data.data || []);
      })
      .catch(() => setEvents([]));
  }, []);

  return (
    <div>
      {/* Banner - From existing CMS Page */}
      <CmsPage slug="today" titleFallback="Today">
      {/* TODAY BLOCK */}

     <TodayCalender />
     </CmsPage>
    </div>
  );
};

export default Today;
