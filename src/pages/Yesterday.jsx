import React from "react";
import CmsPage from "./CmsPage";
import YesterdayCalender from "./YesterdayCalender";

const Yesterday = () => {
  return (
    <div>
      <CmsPage slug="yesterday" titleFallback="Yesterday">
        <section className="testimonial text-center" style={{ paddingTop: "20px" }}>
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

        <YesterdayCalender />

      </CmsPage>  
    </div>
  );
};

export default Yesterday;
