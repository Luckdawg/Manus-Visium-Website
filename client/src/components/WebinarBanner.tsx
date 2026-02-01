import { X, Calendar, Clock, Video } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function WebinarBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white shadow-2xl sticky top-0 z-50">
      <div className="container py-4 px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Left Section - Announcement */}
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm">
                  <Video className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide mb-1">
                  🎯 Webinar Alert
                </h3>
                <p className="text-sm md:text-base font-semibold leading-tight">
                  Don't miss the <span className="font-bold text-yellow-200">Visium + IREX</span> live webinar on Peru's 54,000-camera AI surveillance network
                </p>
                <p className="text-xs md:text-sm text-white/90 mt-2">
                  Architecture, rollout, and growth roadmap
                </p>
              </div>
            </div>
          </div>

          {/* Middle Section - Details */}
          <div className="w-full md:w-auto">
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2 text-xs bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="font-semibold">Thu, Feb 5</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span className="font-semibold">2:00 PM EST</span>
              </div>
              <div className="col-span-2 text-white/80 text-xs">
                11:00 AM PST / 2:00 PM Peru Time
              </div>
            </div>
          </div>

          {/* Right Section - CTA and Close */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <a
              href="https://us02web.zoom.us/webinar/register/WN_xvO1BxwSSVOaVsIdcUvBQg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none"
            >
              <Button
                className="w-full md:w-auto bg-white text-purple-600 hover:bg-yellow-200 font-bold transition-all duration-200 shadow-lg"
              >
                Register Now
              </Button>
            </a>
            <button
              onClick={() => setIsVisible(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 flex-shrink-0"
              aria-label="Close banner"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Bottom - Duration and Platform Info */}
        <div className="mt-3 pt-3 border-t border-white/20 text-xs text-white/80 flex flex-wrap gap-4">
          <span className="flex items-center gap-1">
            <span className="font-semibold">Duration:</span> 30 minutes
          </span>
          <span className="flex items-center gap-1">
            <span className="font-semibold">Platform:</span> Zoom (Registration Required)
          </span>
        </div>
      </div>
    </div>
  );
}
