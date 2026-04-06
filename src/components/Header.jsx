import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import logo from '../images/logo.jpg';
import ar from '../images/ar.webp';
import en from '../images/en.webp';
import fr from '../images/fr.webp';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getObjectFromPathname = () => {
    const pathname = location.pathname;
    const match = pathname.split('/')[1];
    return match;
  };

  const isActive = (_pageObject_) => {
    const _object_ = getObjectFromPathname();
    return _object_ === _pageObject_ ? 'active' : '';
  };

  return (
    <header id="header" className="header sticky-top">
      <div className="container position-relative d-flex align-items-center justify-content-end">
        {/* Logo */}
        <div className="logo-block">
          <a href="/"><img src={logo} alt="Yalla Lebanon Logo" /></a>
        </div>

        <div className="rt-block ms-auto">
          {/* Top social & search */}
          <div className="top-block d-flex justify-content-end">
            <div className="socila-media">
              <ul className="d-flex">
                <li>
                  <a href="https://www.facebook.com/YallaLebanondotcom/" target="_blank" rel="noopener noreferrer">
                    <i className="fa fa-facebook"></i>
                  </a>
                </li> 
                <li>
                  <a href="https://www.instagram.com/yallalebanon_com/" target="_blank" rel="noopener noreferrer">
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                </li>
                <li>
                  <a href="https://x.com/i/flow/login?redirect_after_login=%2FYallaLebanon" target="_blank" rel="noopener noreferrer">
                    <i className="fa-brands fa-x-twitter"></i>
                  </a>
                </li>
              </ul>
            </div>

            <div className="search">
              <a href="/search" role="button" aria-label="Search">
                <i className="fa fa-search"></i>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="bottom-block d-flex justify-content-end align-items-center">
            <div className="navigation">
              <div id="nav-wrap">
                <ul className="sf-menu">
                  <li className={isActive('')}>
                    <a href="/">Home</a>
                  </li>
                  <li className={isActive('categories')}>
                    <a href="/categories">Categories</a>
                  </li>
                  <li className={isActive('this-week')}>
                    <a href="/this-week">This Week</a>
                  </li>
                  <li className={isActive('agendas')}>
                    <a href="/agendas">Agendas</a>
                  </li>
                  <li className={isActive('legacy')}>
                    <a href="/legacy">Legacy</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Language switch */}
            <div className="language-btn d-flex">
              <a href="/ar" role="button"><img src={ar} alt="Arabic Language" /></a>
              <a href="/en" role="button"><img src={en} alt="English Language" /></a>
              <a href="/fr" role="button"><img src={fr} alt="French Language" /></a>
            </div>
          </div>
          <div className="clearfix"></div>
        </div>

        {/* Mobile menu toggle */}
        <div className="mobile-menu-block">
          <span className="menu-icon" onClick={() => setIsMobileMenuOpen(true)}>
            <ul>
              <li></li>
              <li></li>
              <li></li>
            </ul>
            <span className="clearfix"></span>
          </span>
        </div>

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div className="overlay open-mobile-menu">
            <button className="closebtn" onClick={() => setIsMobileMenuOpen(false)}>&times;</button>
            <ul className="mobile-menu">
              <li><a href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</a></li>
              <li><a href="/categories" onClick={() => setIsMobileMenuOpen(false)}>Categories</a></li>
              <li><a href="/this-week" onClick={() => setIsMobileMenuOpen(false)}>This Week</a></li>
              <li><a href="/agendas" onClick={() => setIsMobileMenuOpen(false)}>Agendas</a></li>
              <li><a href="/legacy" onClick={() => setIsMobileMenuOpen(false)}>Legacy</a></li>
              <li className="lang-switch">
                <a href="/ar" onClick={() => setIsMobileMenuOpen(false)}><img src={ar} alt="Arabic" /></a>
                <a href="/en" onClick={() => setIsMobileMenuOpen(false)}><img src={en} alt="English" /></a>
                <a href="/fr" onClick={() => setIsMobileMenuOpen(false)}><img src={fr} alt="French" /></a>
              </li>
            </ul>
          </div>
        )}

        <div className="clearfix"></div>
      </div>
    </header>
  );
};

export default Header;
