import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CookieConsent.css";

const STORAGE_KEY = "cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (!consent) {
        setVisible(true);
      }
    } catch (e) {
      // Fallback in case localStorage is disabled or restricted
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch (e) {}
    setVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "declined");
    } catch (e) {}
    setVisible(false);
  };

  const handleClose = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "dismissed");
    } catch (e) {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      className="cookie-consent-banner"
      role="region"
      aria-label="Cookie consent banner"
    >
      <div className="cookie-consent-content">
        <div className="cookie-icon" aria-hidden="true">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
            <path d="M8.5 8.5v.01" />
            <path d="M7.5 15.5v.01" />
            <path d="M12 12v.01" />
            <path d="M11 17v.01" />
            <path d="M16 14v.01" />
          </svg>
        </div>
        <div className="cookie-text">
          <h4 className="cookie-title">We value your privacy</h4>
          <p className="cookie-desc">
            We use cookies to improve your browsing experience, deliver personalized content, and analyze our traffic. By clicking &ldquo;Accept All&rdquo;, you consent to our use of cookies. Read our{" "}
            <Link to="/privacy-policy" className="cookie-policy-link">
              Privacy Policy
            </Link>{" "}
            to learn more.
          </p>
        </div>
      </div>

      <div className="cookie-actions">
        <button
          type="button"
          className="cookie-btn cookie-btn-decline"
          onClick={handleDecline}
        >
          Decline
        </button>
        <button
          type="button"
          className="cookie-btn cookie-btn-accept"
          onClick={handleAccept}
        >
          Accept All
        </button>
        <button
          type="button"
          className="cookie-close-btn"
          onClick={handleClose}
          title="Dismiss"
          aria-label="Dismiss cookie notice"
        >
          ✕
        </button>
      </div>
    </aside>
  );
};

export default CookieConsent;
