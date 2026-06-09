import React, { useState } from "react";
import axios from "axios";
import { env } from "../config";

const Footer = () => {
  const [form, setForm] = useState({
    email: "",
    preference: "blogs", // default: blogs
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handlePreferenceChange = (e) => {
    setForm((prev) => ({ ...prev, preference: e.target.value }));
  };

  const handleEmailChange = (e) => {
    setForm((prev) => ({ ...prev, email: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email) return;

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      await axios.post(`${env.baseUrl}/api/newsletter/subscribe`, {
        email: form.email,
        preference: form.preference,
        preferences: [form.preference],
        source: "footer",
      });

      setStatus({
        type: "success",
        message: "Subscribed successfully! Check your inbox.",
      });
      setForm({ email: "", preference: "blogs" });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Subscription failed. Please try again later.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };
  return (
    <footer>
      <div className="container">
        <div className="row">
          {/* Our Links */}
          <div className="col-md-6 our-links">
            <h3>Our links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/this-week">This Week</a></li>
              <li><a href="/legacy">Legacy</a></li>
              <li><a href="/about-us">About us</a></li>
              <li><a href="/categories">Categories</a></li>
              <li><a href="/agendas">Agendas</a></li>
              <li><a href="/press">Press</a></li>
              <li><a href="/subscriptions">Subscription</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Lebanese Legacy */}
          <div className="col-md-3">
            <h3>Lebanese Legacy</h3>
            <ul>
              <li><a href="/legacy">Legacy</a></li>
              <li><a href="/yesterday">Yesterday</a></li>
              <li><a href="/today">Today</a></li>
              <li><a href="/forever">Forever</a></li>
            </ul>
          </div>
          <div className="col-md-3 subscribe">
            <h3>Subscribe Now</h3>
            <p>I want to receive updates about:</p>
            <select
              className="form-control"
              value={form.preference}
              onChange={handlePreferenceChange}
            >
              <option value="blogs">Blogs</option>
              <option value="events">Events</option>
              <option value="both">Both Blogs &amp; Events</option>
            </select>
            <p>Enter your email address</p>
            <input
              className="form-control"
              type="email"
              placeholder="Your email address"
              value={form.email}
              onChange={handleEmailChange}
              required
            />
            <button
              type="button"
              className="btn-submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
            {status.message && (
              <p
                className={status.type === "error" ? "text-danger" : "text-success"}
                style={{ marginTop: "10px", fontSize: "14px" }}
              >
                {status.message}
              </p>
            )}
          </div>
        </div>
        

        {/* Bottom Block */}
        <div className="bottom-block d-flex justify-content-between">
          <p>© Yallalebanon.com</p>
          <a href="/privacy-policy">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
