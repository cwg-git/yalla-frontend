import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="row">
          {/* Our Links */}
          <div className="col-md-9 our-links">
            <h3>Our links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/this-week">This Week</a></li>
              <li><a href="/legacy">Legacy</a></li>
              <li><a href="/about-us">About us</a></li>
              <li><a href="/categories">Categories</a></li>
              <li><a href="/agendas">Agendas</a></li>
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
