import { useEffect, useState } from "react";

const GOOGLE_TRANSLATE_SCRIPT_ID = "google-translate-element-script";

const ArticleTranslateWidget = ({ pageLanguage = "es" }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initWidget = () => {
      if (
        !window.google ||
        !window.google.translate ||
        !window.google.translate.TranslateElement
      ) {
        return;
      }

      const mountNode = document.getElementById("article-translate-widget");
      if (!mountNode) return;

      mountNode.innerHTML = "";
      // Recreate the widget after the article content has mounted.
      // This keeps translation available even when the article HTML arrives asynchronously.
      // eslint-disable-next-line no-new
      new window.google.translate.TranslateElement(
        {
          pageLanguage,
          includedLanguages: "es,en,ca,fr",
          autoDisplay: false,
        },
        "article-translate-widget"
      );
      setIsReady(true);
    };

    if (window.google?.translate?.TranslateElement) {
      initWidget();
      return undefined;
    }

    window.googleTranslateElementInit = initWidget;

    if (!document.getElementById(GOOGLE_TRANSLATE_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = GOOGLE_TRANSLATE_SCRIPT_ID;
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onerror = () => setIsReady(false);
      document.body.appendChild(script);
    }

    return undefined;
  }, [pageLanguage]);

  return (
    <div
      className="article-translate-widget"
      style={{
        display: "none",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        borderRadius: 14,
        padding: "16px 18px",
        background: "#fff",
        marginTop: 24,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <h4 style={{ margin: 0 }}>Translate this article</h4>
          <p style={{ margin: "6px 0 0", color: "#666" }}>
            Use the language selector to translate the title and content without leaving the page.
          </p>
        </div>
        <span
          style={{
            fontSize: 12,
            borderRadius: 999,
            padding: "6px 10px",
            background: isReady ? "#e8f7ee" : "#f5f5f5",
            color: isReady ? "#16794c" : "#666",
          }}
        >
          {isReady ? "Ready" : "Loading"}
        </span>
      </div>
      <div id="article-translate-widget" style={{ marginTop: 12 }} />
    </div>
  );
};

export default ArticleTranslateWidget;
