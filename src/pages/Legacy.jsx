import React, { useEffect } from "react";
import axios from "axios";
import { env } from "../config";

import Categories from "../components/Categories";
import ThisWeek from "./LegacyPage";
import Today from "./Today"
import Yesterday from "./Yesterday"
import GibranImg from "../images/Kahlil-Gibran-Portrait.webp";
import CmsPage from "./CmsPage";

const Legacy = ({ type }) => {

  useEffect(() => {
    axios.get(`${env.baseUrl}/api/categories/events`).catch(() => {});
  }, []);

  return (
    <div>
      {/* Banner - From existing CMS Page */}
      <CmsPage slug="legacy" titleFallback="Our Legacy">

      {/* ---------- CONDITIONAL RENDER ---------- */}

      {type === "today" && <Today />}

      {type === "yesterday" && <Yesterday />}

      {!type && <ThisWeek />}
      </CmsPage>

      {/* ---------- LEGACY CONTENT ---------- */}
    </div>
  );
};
export default Legacy;