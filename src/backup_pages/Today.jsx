import React, { useEffect, useState } from "react";
import axios from "axios";
import { env } from "../config";
import { PiClock } from "react-icons/pi";
import TodayCalender from "./TodayCalender"

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
      <section class="inner-banner">
        <div class="container">
          <div class="text-block">
            <h3>
              <em>Today's</em>
            </h3>
            <h1>
              <em>Event's</em>
            </h1>
          </div>
        </div>
      </section>

      <>
        {/* TODAY BLOCK */}
        <section className="today-block">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6">
                <img
                  src="/images/WhatsApp-Image-2024-08-11-at-5.49.55-PM-1.webp"
                  alt=""
                />
              </div>

              <div className="col-md-6">
                <h2>In Today’s chapter</h2>

                <p>
                  We will present legacies right under our eyes, surrounding the
                  echos of your ears.
                </p>

                <p>
                  Lebanon possesses a truly unique aspect that qualifies it as a
                  living museum, visible right before our eyes. This vibrant and
                  active museum is one that many would envy, showcasing a
                  remarkable journey through the 20th and early 21st
                  centuries—all within a single day.
                </p>

                <p>
                  Each car is not just an object but a vessel of memories and
                  nostalgia.
                </p>

                <em>
                  <strong>Lebanon, the open air museum</strong>
                </em>
                <br />
                <em>
                  <strong>لبنان المتحف المفتوح</strong>
                </em>
                <br />
                <em>
                  <strong>Liban, le musée à ciel ouvert</strong>
                </em>
              </div>
            </div>
          </div>
        </section>

        {/* DISCOVER BLOCK */}
        <section className="discover-block">
          <div className="container">
            <h2>Discover Lebanon’s Events</h2>

            <div className="row">
              {[1, 2, 3].map((item, i) => (
                <div className="col-md-4" key={i}>
                  <div className="card">
                    <div className="icon">
                      <img src={`/images/icon${item}.png`} alt="" />
                    </div>
                    <p>
                      {i === 0 && "A different Museum, an open air one."}
                      {i === 1 && "The Lebanese Car Blog"}
                      {i === 2 && "7 eras of automobile history"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* POST CATEGORIES */}
        <section className="post-categories">
          <div className="container">
            {/* TESTIMONIAL */}
            <div className="testimonial-block text-center">
              <img src="/images/logo.jpg" alt="" />
              <h3>
                Ask not what your country can do for you, ask what you can do
                for your country.
              </h3>
              <h4>Gibran Khalil Gibran</h4>

              <ul className="star">
                {[...Array(5)].map((_, i) => (
                  <li key={i}>
                    <i className="fa-solid fa-star"></i>
                  </li>
                ))}
              </ul>
            </div>

           
          </div>
        </section>
      </>

     <TodayCalender />
    </div>
  );
};

export default Today;
