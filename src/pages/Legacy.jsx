import React, { useEffect } from "react";
import axios from "axios";
import { env } from "../config";
import CmsPage from "./CmsPage";
import LegacyPage from "./LegacyPage";

const Legacy = () => {
  useEffect(() => {
    axios.get(`${env.baseUrl}/api/categories/events`).catch(() => {});
  }, []);

  return (
    <div>
      <CmsPage slug="legacy" titleFallback="Our Legacy">
        <LegacyPage />
      </CmsPage>
    </div>
  );
};

export default Legacy;