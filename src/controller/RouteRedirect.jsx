import { Suspense } from "react";
import { useParams } from "react-router-dom";

import Home from "../pages/Home";
import ThisWeek from "../pages/ThisWeek";
import Today from "../pages/Today";
import TodayLegacy from "../pages/TodayLegacy";
import Yesterday from "../pages/Yesterday";
import Forever from "../pages/Forever";
import Legacy from "../pages/Legacy";
import Categories from "../pages/Categories";
import Agendas from "../pages/Agendas";
import About from "../pages/About";
import Contact from "../pages/Contact";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import CmsPage from "../pages/CmsPage";
import Subscriptions from "../pages/Subscriptions";

import Press from "../pages/Press";

import SinglePost from "../pages/SinglePost";
import SingleEvent from "../pages/SingleEvent";

import EventsByCategoorie from "../pages/EventsByCategoorie";
import PostsByCategoorie from "../pages/PostsByCategoorie";
import SearchPage from "../pages/SearchPage";

import MapsByCategorie from "../pages/MapsByCategorie";
import AllMapsByCategory from "../pages/AllMapsByCategory";
import SingleMap from "../pages/SingleMap";

const RedirectComponent = () => {
  const params = useParams();
  const { object, key } = params;

  const routeMap = {
    // Static pages
    "this-week": <ThisWeek />,
    legacy: <Legacy />,
    categories: <Categories />,
    agendas: <Agendas />,
    "about-us": <About />,
    contact: <Contact />,
    "privacy-policy": <PrivacyPolicy />,

    // Legacy filters
    yesterday: <Yesterday />,
    today: <Today />,
    "today-legacy": <TodayLegacy />,
    forever: <Forever />,

    // Category pages
    "event-category": <EventsByCategoorie />,
    "post-category": <PostsByCategoorie />,
    "maps-category": <MapsByCategorie />,
    "all-maps": <AllMapsByCategory />,
    "search": <SearchPage />,
    "subscriptions": <Subscriptions />,
    "press": <Press />,

    // Single pages
    post: key ? <SinglePost /> : null,
    event: key ? <SingleEvent /> : null,
    map: key ? <SingleMap /> : null,

    // Fallback
    404: <div>404 Not Found</div>,
  };

  // If URL is just domain.com/
  if (!object) return <Home />;

  if (!routeMap[object]) {
    return (
      <Suspense fallback={<div />}>
        <CmsPage slug={object} titleFallback={object} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<div />}>
      {routeMap[object] || routeMap["404"]}
    </Suspense>
  );
};

export default RedirectComponent;
