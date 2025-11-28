/**
 * Privacy-focused analytics utility
 * Only tracks when user has accepted analytics cookies
 */

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

interface AnalyticsEvent {
  name: string;
  url: string;
  referrer?: string;
  screen?: string;
  language?: string;
  title?: string;
}

class Analytics {
  private endpoint: string;
  private websiteId: string;
  private enabled: boolean = false;

  constructor() {
    this.endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT || "";
    this.websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID || "";
    
    // Check if analytics is enabled based on cookie consent
    this.checkConsent();
    
    // Listen for consent changes
    window.addEventListener("storage", (e) => {
      if (e.key === "cookieConsent") {
        this.checkConsent();
      }
    });
  }

  private checkConsent(): void {
    try {
      const consentStr = localStorage.getItem("cookieConsent");
      if (consentStr) {
        const consent: CookieConsent = JSON.parse(consentStr);
        this.enabled = consent.analytics === true;
      } else {
        this.enabled = false;
      }
    } catch (error) {
      console.error("Failed to parse cookie consent:", error);
      this.enabled = false;
    }
  }

  private getPayload(): AnalyticsEvent {
    return {
      name: "pageview",
      url: window.location.pathname + window.location.search,
      referrer: document.referrer || undefined,
      screen: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      title: document.title,
    };
  }

  /**
   * Track a page view
   * Only sends data if user has accepted analytics cookies
   */
  public trackPageView(): void {
    if (!this.enabled || !this.endpoint || !this.websiteId) {
      return;
    }

    try {
      const payload = this.getPayload();
      
      // Send analytics event
      fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          website: this.websiteId,
          ...payload,
        }),
      }).catch((error) => {
        // Silently fail - don't block page load
        console.debug("Analytics tracking failed:", error);
      });
    } catch (error) {
      console.debug("Analytics error:", error);
    }
  }

  /**
   * Track a custom event (e.g., button click, form submission)
   * Only sends data if user has accepted analytics cookies
   */
  public trackEvent(eventName: string, eventData?: Record<string, any>): void {
    if (!this.enabled || !this.endpoint || !this.websiteId) {
      return;
    }

    try {
      fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          website: this.websiteId,
          name: eventName,
          url: window.location.pathname,
          data: eventData,
        }),
      }).catch((error) => {
        console.debug("Event tracking failed:", error);
      });
    } catch (error) {
      console.debug("Event tracking error:", error);
    }
  }

  /**
   * Check if analytics is currently enabled
   */
  public isEnabled(): boolean {
    return this.enabled;
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Convenience functions
export const trackPageView = () => analytics.trackPageView();
export const trackEvent = (name: string, data?: Record<string, any>) => analytics.trackEvent(name, data);
export const isAnalyticsEnabled = () => analytics.isEnabled();
