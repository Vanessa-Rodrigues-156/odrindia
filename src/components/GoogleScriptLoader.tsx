"use client";
import { useEffect } from "react";

export default function GoogleScriptLoader() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.handleGoogleScriptLoad) {
      window.handleGoogleScriptLoad();
    }
  }, []);
  return null;
}
