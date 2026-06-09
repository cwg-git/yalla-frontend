import { useEffect, useState } from "react";
import axios from "axios";
import { env } from "../config";

const CmsPage = ({ slug, titleFallback, children }) => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError("");

    axios
      .get(`${env.baseUrl}/api/pages/${slug}`)
      .then((response) => {
        if (!active) return;
        setPage(response.data.page || null);
      })
      .catch(() => {
        if (!active) return;
        setPage(null);
        setError("Page not found");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return <div className="cms-page-loading" />;
  }

  if (!page) {
    return (
      <div className="cms-page cms-page--missing">
        <section className="inner-banner">
          <div className="container">
            <div className="text-block">
              <h3><em>Content</em></h3>
              <h1><em>{titleFallback || slug}</em></h1>
            </div>
          </div>
        </section>
        <section className="about-us">
          <div className="container">
            <p>{error || "This page is not available yet."}</p>
          </div>
        </section>
        {children}
      </div>
    );
  }

  const rawContent = page.content_html || page.content || "";
  const hasInlineImages = /<img\b/i.test(rawContent);
  const contentHtml = resolveInlineImageUrls(rawContent);

  // Split on the placeholder to inject children
  const PLACEHOLDER = "Dynamic Content";
  const hasDynamicSlot = children && contentHtml.includes(PLACEHOLDER);
  const [beforeSlot, afterSlot] = hasDynamicSlot
    ? contentHtml.split(PLACEHOLDER)
    : [contentHtml, ""];

  return (
    <div className={`cms-page cms-page--${slug}`}>
      {page.image_url && !hasInlineImages ? (
        <section className="page-hero" style={{ display: "none" }}>
          <div className="container">
            <img src={page.image_url} alt={page.title} className="img-fluid" />
          </div>
        </section>
      ) : null}

      {hasDynamicSlot ? (
        <>
          <div
            className="cms-page-content"
            dangerouslySetInnerHTML={{ __html: beforeSlot }}
          />
          {children}
          <div
            className="cms-page-content"
            dangerouslySetInnerHTML={{ __html: afterSlot }}
          />
        </>
      ) : (
        <>
          <div
            className="cms-page-content"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
          {children}
        </>
      )}
    </div>
  );
};

const resolveInlineImageUrls = (html) => {
  if (!html) return "";

  const baseUrl = (env.baseUrl || "").replace(/\/$/, "");

  return html.replace(
    /<img\b([^>]*?)\bsrc=(['"])(.*?)\2([^>]*?)>/gi,
    (match, before, quote, src, after) => {
      const cleanedSrc = src.trim();

      if (
        !cleanedSrc ||
        /^(?:https?:)?\/\//i.test(cleanedSrc) ||
        cleanedSrc.startsWith("data:") ||
        cleanedSrc.startsWith("blob:") ||
        cleanedSrc.startsWith("cid:")
      ) {
        return match;
      }

      const normalizedSrc = cleanedSrc.startsWith("/")
        ? cleanedSrc
        : `/${cleanedSrc}`;

      return `<img${before}src=${quote}${baseUrl}${normalizedSrc}${quote}${after}>`;
    }
  );
};

export default CmsPage;