import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

export interface TourStep {
  target: string; // CSS selector for the element to highlight
  title: string;
  content: string;
  placement?: "top" | "bottom" | "left" | "right";
  action?: () => void; // Optional action to perform when step is shown
}

interface TourProps {
  steps: TourStep[];
  tourId: string; // Unique ID for this tour (used for localStorage)
  onComplete?: () => void;
  onSkip?: () => void;
}

export default function Tour({ steps, tourId, onComplete, onSkip }: TourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user has already seen this tour
    const hasSeenTour = localStorage.getItem(`tour_${tourId}_completed`);
    if (!hasSeenTour) {
      // Delay tour start to allow page to render
      const timer = setTimeout(() => {
        setIsActive(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [tourId]);

  useEffect(() => {
    if (isActive && steps[currentStep]) {
      const step = steps[currentStep];
      
      // Execute step action if provided
      if (step.action) {
        step.action();
      }

      // Find target element and calculate position
      const targetElement = document.querySelector(step.target);
      if (targetElement) {
        // Add highlight class
        targetElement.classList.add("tour-highlight");

        // Scroll element into view
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });

        // Wait for scroll to complete before calculating position
        setTimeout(() => {
          const rect = targetElement.getBoundingClientRect();
          
          // Calculate tooltip position based on placement (using viewport coordinates for fixed positioning)
          let top = 0;
          let left = 0;

          const placement = step.placement || "bottom";
          const tooltipWidth = 400;
          const tooltipHeight = 200; // Approximate

          switch (placement) {
            case "top":
              top = rect.top - tooltipHeight - 20;
              left = rect.left + rect.width / 2 - tooltipWidth / 2;
              break;
            case "bottom":
              top = rect.bottom + 20;
              left = rect.left + rect.width / 2 - tooltipWidth / 2;
              break;
            case "left":
              top = rect.top + rect.height / 2 - tooltipHeight / 2;
              left = rect.left - tooltipWidth - 20;
              break;
            case "right":
              top = rect.top + rect.height / 2 - tooltipHeight / 2;
              left = rect.right + 20;
              break;
          }

          // Ensure tooltip stays within viewport
          const maxLeft = window.innerWidth - tooltipWidth - 20;
          const maxTop = window.innerHeight - tooltipHeight - 20;
          left = Math.max(20, Math.min(left, maxLeft));
          top = Math.max(20, Math.min(top, maxTop));

          setPosition({ top, left });
        }, 500);

        // Cleanup previous highlights
        return () => {
          document.querySelectorAll(".tour-highlight").forEach((el) => {
            el.classList.remove("tour-highlight");
          });
        };
      }
    }
  }, [currentStep, isActive, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    localStorage.setItem(`tour_${tourId}_completed`, "true");
    setIsActive(false);
    document.querySelectorAll(".tour-highlight").forEach((el) => {
      el.classList.remove("tour-highlight");
    });
    if (onComplete) {
      onComplete();
    }
  };

  const skipTour = () => {
    localStorage.setItem(`tour_${tourId}_completed`, "true");
    setIsActive(false);
    document.querySelectorAll(".tour-highlight").forEach((el) => {
      el.classList.remove("tour-highlight");
    });
    if (onSkip) {
      onSkip();
    }
  };

  if (!isActive || !steps[currentStep]) {
    return null;
  }

  const step = steps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[9998]" />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[9999] w-[400px]"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        <Card className="shadow-2xl border-2 border-primary">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.content}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={skipTour}
                className="ml-2 -mt-2 -mr-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </div>
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button variant="outline" size="sm" onClick={handlePrevious}>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                )}
                <Button size="sm" onClick={handleNext} className="bg-primary text-white">
                  {currentStep < steps.length - 1 ? (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    "Finish"
                  )}
                </Button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={skipTour}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Skip tour
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add CSS for highlight effect */}
      <style>{`
        .tour-highlight {
          position: relative;
          z-index: 9997 !important;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.5) !important;
          border-radius: 8px;
        }
      `}</style>
    </>
  );
}

// Hook to manually trigger a tour
export function useTour(tourId: string) {
  const restartTour = () => {
    localStorage.removeItem(`tour_${tourId}_completed`);
    window.location.reload();
  };

  const hasSeenTour = () => {
    return localStorage.getItem(`tour_${tourId}_completed`) === "true";
  };

  return { restartTour, hasSeenTour };
}
