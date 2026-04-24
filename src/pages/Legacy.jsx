import React, { useEffect } from "react";
import axios from "axios";
import { env } from "../config";

import LegacyBlock from "../components/LegacyBlock";
import Categories from "../components/Categories";
import ThisWeek from "./LegacyPage";
import Today from "./Today"
import Yesterday from "./Yesterday"
import GibranImg from "../images/Kahlil-Gibran-Portrait.webp";

const Legacy = ({ type }) => {

  useEffect(() => {
    axios.get(`${env.baseUrl}/api/categories/events`).catch(() => {});
  }, []);

  return (
    <div>
      <section className="inner-banner">
                <div className="container">
                    <div className="text-block">
                        <h3><em>Our</em></h3>
                        <h1><em>Legacy</em></h1>
                    </div>
                </div>
            </section>

      {/* ---------- CONDITIONAL RENDER ---------- */}

      {type === "today" && <Today />}

      {type === "yesterday" && <Yesterday />}

      {!type && <ThisWeek />}

    </div>
  );
};
export default Legacy;