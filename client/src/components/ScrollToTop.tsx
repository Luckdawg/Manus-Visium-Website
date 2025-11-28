import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * ScrollToTop component ensures the page scrolls to the top
 * whenever the route changes, providing a better user experience
 * for navigation between pages.
 */
export default function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);

  return null;
}
