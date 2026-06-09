import React, { useEffect } from "react";
import axios from "axios";
import { env } from "../config";

import LegacyBlock from "../components/LegacyBlock";
import Categories from "../components/Categories";
import LegacyPage from "./LegacyPage";
import Today from "./Today"
import Yesterday from "./Yesterday"
import GibranImg from "../images/Kahlil-Gibran-Portrait.webp";

const Legacy = ({ type }) => {

  useEffect(() => {
    axios.get(`${env.baseUrl}/api/categories/events`).catch(() => {});
  }, []);

  return (
    <div>
      

      {/* ---------- CONDITIONAL RENDER ---------- */}

      <LegacyPage />

    </div>
  );
};
export default Legacy;