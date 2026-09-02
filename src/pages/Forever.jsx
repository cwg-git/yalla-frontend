import React from "react";
import Categories from "../components/Categories";
import CmsPage from "./CmsPage";

const Forever = () => {
  return (
    <div>
      <CmsPage slug="forever" titleFallback="Forever">
        <section className="text-center" style={{ padding: "40px 0" }}>
          <div className="container">
            <p style={{ fontSize: "18px", fontStyle: "italic", margin: "20px 0" }}>
              Text we will insert soon, explaining what the Forever page consist of and how it works with the timeline.
            </p>
          </div>
        </section>
        <section className="post-categories map-categories">
          <Categories type="maps" />
        </section>
      </CmsPage>
    </div>
  );
};

export default Forever;
