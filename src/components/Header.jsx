import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import logo from '../images/logo.jpg';
import ar from '../images/ar.webp';
import en from '../images/en.webp';
import fr from '../images/fr.webp';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const getObjectFromPathname = () => {
    const pathname = location.pathname;
    const match = pathname.split('/')[1];
    return match;
  };

  const isActive = (_pageObject_) => {
    const _object_ = getObjectFromPathname();
    return _object_ === _pageObject_ ? 'active' : '';
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
      setIsSearchOpen(false);
      setSearchText('');
    }
  };

  const handleSearchIconClick = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchText('');
  };

  // Language switcher - now working
  const switchLanguage = (lang) => {
    if (lang === 'en') {
      // English - reload original page
      window.location.reload();
      return;
    }
    
    // Get current page path
    const currentPath = window.location.pathname + window.location.search;
    
    // Create Google Translate proxy URL
    const translateUrl = `https://translate.google.com/translate?hl=${lang}&sl=en&tl=${lang}&u=${encodeURIComponent(window.location.href)}`;
    
    // Open in same tab
    window.location.href = translateUrl;
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
              <a 
                href="#search" 
                role="button" 
                aria-label="Search"
                onClick={(e) => {
                  e.preventDefault();
                  handleSearchIconClick();
                }}
              >
                <i className={`fa ${isSearchOpen ? 'fa-times' : 'fa-search'}`}></i>
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
              <button 
                onClick={() => switchLanguage('ar')}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <img src={ar} alt="Arabic Language" />
              </button>
              <button 
                onClick={() => switchLanguage('en')}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <img src={en} alt="English Language" />
              </button>
              <button 
                onClick={() => switchLanguage('fr')}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <img src={fr} alt="French Language" />
              </button>
            </div>
          </div>
          <div className="clearfix"></div>
        </div>

        {/* Desktop Search Overlay */}
        <div className={`desktop-search-overlay ${isSearchOpen ? 'open' : ''}`}>
          <div className="container">
            <form onSubmit={handleSearchSubmit} className="desktop-search-form">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search posts and events..."
                className="desktop-search-input"
                autoFocus
              />
              <button type="submit" className="desktop-search-btn">
                <i className="fa fa-search"></i>
              </button>
              <button 
                type="button" 
                className="desktop-search-close"
                onClick={() => setIsSearchOpen(false)}
              >
                <i className="fa fa-times"></i>
              </button>
            </form>
          </div>
        </div>

        {/* Mobile menu toggle */}
        <div className="mobile-menu-block">
          <span className="menu-icon" 
              onClick={() => {
                console.log("menu clicked");
                setIsMobileMenuOpen(true);
              }}>
            <ul>
              <li></li>
              <li></li>
              <li></li>
            </ul>
            <span className="clearfix"></span>
          </span>
        </div>

        {/* Mobile menu overlay */}
        <div className={`overlay ${isMobileMenuOpen ? 'open-mobile-menu' : ''}`}>
          <div className="menu-box"></div>
          <button
            className="closebtn"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            &times;
          </button>
          <div className="overlay-content">
            <div className="menu-block"></div>
            
            {/* Mobile Search Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              if (searchText.trim()) {
                navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
                setIsMobileMenuOpen(false);
                setSearchText('');
              }
            }} className="mobile-search-form">
              <div className="mobile-search-input-group">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search posts and events..."
                  className="mobile-search-input"
                />
                <button type="submit" className="mobile-search-btn">
                  <i className="fa fa-search"></i>
                </button>
              </div>
            </form>

            <ul className="mobile-menu">
              <li><a href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</a></li>
              <li><a href="/categories" onClick={() => setIsMobileMenuOpen(false)}>Categories</a></li>
              <li><a href="/this-week" onClick={() => setIsMobileMenuOpen(false)}>This Week</a></li>
              <li><a href="/agendas" onClick={() => setIsMobileMenuOpen(false)}>Agendas</a></li>
              <li><a href="/legacy" onClick={() => setIsMobileMenuOpen(false)}>Legacy</a></li>
              <li className="lang-switch">
                <button 
                  onClick={() => { switchLanguage('ar'); setIsMobileMenuOpen(false); }}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  <img src={ar} alt="Arabic" />
                </button>
                <button 
                  onClick={() => { switchLanguage('en'); setIsMobileMenuOpen(false); }}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  <img src={en} alt="English" />
                </button>
                <button 
                  onClick={() => { switchLanguage('fr'); setIsMobileMenuOpen(false); }}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  <img src={fr} alt="French" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="clearfix"></div>
      </div>
    </header>
  );
};

export default Header;