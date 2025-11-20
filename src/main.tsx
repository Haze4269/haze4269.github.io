import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Handle unhandled promise rejections (often from browser extensions or third-party scripts)
window.addEventListener("unhandledrejection", (event) => {
  // Suppress errors related to checkoutUrls (likely from browser extensions)
  if (
    event.reason?.message?.includes("checkoutUrls") ||
    event.reason?.toString()?.includes("checkoutUrls") ||
    (event.reason && typeof event.reason === "object" && "checkoutUrls" in event.reason)
  ) {
    console.warn("Suppressed error from browser extension:", event.reason);
    event.preventDefault();
    return;
  }
  
  // Log other unhandled rejections but don't crash the app
  console.error("Unhandled promise rejection:", event.reason);
  event.preventDefault();
});

// Handle general errors
window.addEventListener("error", (event) => {
  // Suppress errors related to checkoutUrls
  if (
    event.message?.includes("checkoutUrls") ||
    event.filename?.includes("content.js")
  ) {
    console.warn("Suppressed error from browser extension:", event.message);
    event.preventDefault();
    return;
  }
});

createRoot(document.getElementById("root")!).render(<App />);
