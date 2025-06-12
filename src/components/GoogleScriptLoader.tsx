"use client";
import { useEffect } from "react";

export default function GoogleScriptLoader() {
  useEffect(() => {
    // Check if Google is already loaded
    const isGoogleLoaded =
      typeof window !== "undefined" &&
      window.google &&
      window.google.accounts;

    if (isGoogleLoaded && window.handleGoogleScriptLoad) {
      window.handleGoogleScriptLoad();
    }

    // Set up a MutationObserver to detect when the Google script might be loaded
    // This is a fallback for cases where onLoad doesn't fire correctly
    if (
      typeof window !== "undefined" &&
      !isGoogleLoaded &&
      window.MutationObserver
    ) {
      const observer = new MutationObserver((mutations) => {
        if (typeof window.google !== "undefined" && window.google.accounts) {
          if (window.handleGoogleScriptLoad) {
            window.handleGoogleScriptLoad();
          }
          observer.disconnect();
        }
      });

      observer.observe(document, { childList: true, subtree: true });

      // Clean up observer after a timeout (5 seconds)
      const timeoutId = setTimeout(() => {
        observer.disconnect();
      }, 5000);

      return () => {
        clearTimeout(timeoutId);
        observer.disconnect();
      };
    }
  }, []);

  return null;
}
