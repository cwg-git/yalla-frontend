import React from "react";
import CmsPage from "./CmsPage";
import YesterdayCalender from "./YesterdayCalender";

const TodayLegacy = () => {
  return (
    <div>
      <CmsPage slug="today-legacy" titleFallback="Today">
        <YesterdayCalender />
      </CmsPage>
    </div>
  );
};

export default TodayLegacy;
