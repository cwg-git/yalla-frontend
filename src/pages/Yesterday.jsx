import React, { useEffect, useState } from "react";
import axios from "axios";
import { env } from "../config";
import { PiClock } from "react-icons/pi";
import YesterdayCalender from "./YesterdayCalender"
import CmsPage from "./CmsPage";

const Yesterday = () => {
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
      <CmsPage slug="yesterday" titleFallback="Yesterday">

     <YesterdayCalender />
      </CmsPage>  
    </div>
  );
};

export default Yesterday;
