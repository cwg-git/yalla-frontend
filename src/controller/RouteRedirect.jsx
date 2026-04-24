import { Suspense } from "react";
import { useParams } from "react-router-dom";

import Home from "../pages/Home";
import ThisWeek from "../pages/ThisWeek";
import Legacy from "../pages/Legacy";
import Categories from "../pages/Categories";
import Agendas from "../pages/Agendas";
import About from "../pages/About";
import Contact from "../pages/Contact";

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

    // Legacy filters
    yesterday: <Legacy type="yesterday" />,
    today: <Legacy type="today" />,
    forever: <Legacy type="forever" />,

    // Category pages
    "event-category": <EventsByCategoorie />,
    "post-category": <PostsByCategoorie />,
    "maps-category": <MapsByCategorie />,
    "all-maps": <AllMapsByCategory />,
    "search": <SearchPage />,

    // Single pages
    post: key ? <SinglePost /> : null,
    event: key ? <SingleEvent /> : null,
    map: key ? <SingleMap /> : null,

    // Fallback
    404: <div>404 Not Found</div>,
  };

  // If URL is just domain.com/
  if (!object) return <Home />;

  return (
    <Suspense fallback={<div />}>
      {routeMap[object] || routeMap["404"]}
    </Suspense>
  );
};

export default RedirectComponent;
