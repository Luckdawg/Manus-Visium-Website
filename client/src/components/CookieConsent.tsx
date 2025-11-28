import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { X, Cookie } from "lucide-react";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookieConsent", JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }));
    // Trigger storage event for analytics to pick up consent change
    window.dispatchEvent(new StorageEvent("storage", {
      key: "cookieConsent",
      newValue: localStorage.getItem("cookieConsent"),
    }));
    setShowBanner(false);
  };

  const handleDeclineAll = () => {
    localStorage.setItem("cookieConsent", JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    // Trigger storage event for analytics to pick up consent change
    window.dispatchEvent(new StorageEvent("storage", {
      key: "cookieConsent",
      newValue: localStorage.getItem("cookieConsent"),
    }));
    setShowBanner(false);
  };

  const handleSavePreferences = (preferences: { analytics: boolean; marketing: boolean }) => {
    localStorage.setItem("cookieConsent", JSON.stringify({
      necessary: true,
      ...preferences,
      timestamp: new Date().toISOString()
    }));
    // Trigger storage event for analytics to pick up consent change
    window.dispatchEvent(new StorageEvent("storage", {
      key: "cookieConsent",
      newValue: localStorage.getItem("cookieConsent"),
    }));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-primary shadow-2xl">
      <div className="container py-6">
        <div className="flex items-start gap-4">
          <Cookie className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              We Value Your Privacy
            </h3>
            
            {!showDetails ? (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                  By clicking "Accept All", you consent to our use of cookies. You can manage your preferences or learn more in our{" "}
                  <Link href="/legal/privacy">
                    <span className="text-primary hover:underline cursor-pointer font-medium">Privacy Policy</span>
                  </Link>.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleAcceptAll} size="sm" className="bg-primary hover:bg-primary/90">
                    Accept All
                  </Button>
                  <Button onClick={handleDeclineAll} size="sm" variant="outline">
                    Decline All
                  </Button>
                  <Button onClick={() => setShowDetails(true)} size="sm" variant="ghost">
                    Customize
                  </Button>
                </div>
              </>
            ) : (
              <CookiePreferences 
                onSave={handleSavePreferences}
                onBack={() => setShowDetails(false)}
              />
            )}
          </div>

          <button
            onClick={() => setShowBanner(false)}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            aria-label="Close banner"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface CookiePreferencesProps {
  onSave: (preferences: { analytics: boolean; marketing: boolean }) => void;
  onBack: () => void;
}

const CookiePreferences = ({ onSave, onBack }: CookiePreferencesProps) => {
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Choose which cookies you want to accept. Necessary cookies are always enabled.
      </p>

      <div className="space-y-3">
        {/* Necessary Cookies */}
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            checked={true}
            disabled
            className="mt-1"
          />
          <div className="flex-1">
            <h4 className="font-medium text-sm text-gray-900">Necessary Cookies</h4>
            <p className="text-xs text-gray-600 mt-1">
              Required for the website to function properly. Cannot be disabled.
            </p>
          </div>
        </div>

        {/* Analytics Cookies */}
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            checked={analytics}
            onChange={(e) => setAnalytics(e.target.checked)}
            className="mt-1"
          />
          <div className="flex-1">
            <h4 className="font-medium text-sm text-gray-900">Analytics Cookies</h4>
            <p className="text-xs text-gray-600 mt-1">
              Help us understand how visitors interact with our website to improve user experience.
            </p>
          </div>
        </div>

        {/* Marketing Cookies */}
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            checked={marketing}
            onChange={(e) => setMarketing(e.target.checked)}
            className="mt-1"
          />
          <div className="flex-1">
            <h4 className="font-medium text-sm text-gray-900">Marketing Cookies</h4>
            <p className="text-xs text-gray-600 mt-1">
              Used to deliver personalized advertisements and track campaign effectiveness.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={() => onSave({ analytics, marketing })} size="sm" className="bg-primary hover:bg-primary/90">
          Save Preferences
        </Button>
        <Button onClick={onBack} size="sm" variant="outline">
          Back
        </Button>
      </div>
    </div>
  );
};

export default CookieConsent;
