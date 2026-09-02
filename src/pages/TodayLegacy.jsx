import React from "react";
import CmsPage from "./CmsPage";
import TodayCalender from "./TodayCalender";

const TodayLegacy = () => {
  return (
    <div>
      <CmsPage slug="today-legacy" titleFallback="Today">
        <TodayCalender />
      </CmsPage>
    </div>
  );
};

export default TodayLegacy;
