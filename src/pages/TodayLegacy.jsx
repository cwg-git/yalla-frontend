import React from "react";
import CmsPage from "./CmsPage";
import TodayCalender from "./TodayCalender";
import LegacyBlock from "../components/LegacyBlock";

const TodayLegacy = () => {
  return (
    <div>
      <style>{`
        /* Hide the broken legacy links that come from the CMS content */
        .cms-page--today-legacy .cms-page-content a[href="/legacy"],
        .cms-page--today-legacy .cms-page-content a[href="/yesterday"],
        .cms-page--today-legacy .cms-page-content a[href="/today-legacy"],
        .cms-page--today-legacy .cms-page-content a[href="/forever"],
        .cms-page--today-legacy .cms-page-content img[src*="box-bg"] {
          display: none !important;
        }
      `}</style>
      <CmsPage slug="today-legacy" titleFallback="Today">
        <LegacyBlock />
        <TodayCalender />
      </CmsPage>
    </div>
  );
};

export default TodayLegacy;
