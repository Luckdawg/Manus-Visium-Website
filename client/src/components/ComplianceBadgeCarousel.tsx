import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ComplianceBadge from './ComplianceBadge';

type BadgeType = 'hipaa' | 'pci-dss' | 'fedramp';

interface ComplianceBadgeCarouselProps {
  autoRotate?: boolean;
  rotationInterval?: number;
  showControls?: boolean;
  className?: string;
}

const badges: BadgeType[] = ['hipaa', 'pci-dss', 'fedramp'];

export default function ComplianceBadgeCarousel({
  autoRotate = true,
  rotationInterval = 5000,
  showControls = true,
  className = ''
}: ComplianceBadgeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % badges.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotationInterval]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + badges.length) % badges.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % badges.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentBadge = badges[currentIndex];

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      {/* Carousel Container */}
      <div className="relative w-full max-w-md">
        {/* Badge Display */}
        <div className="flex justify-center py-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-100">
          <ComplianceBadge
            type={currentBadge}
            size="large"
            showLabel={true}
          />
        </div>

        {/* Navigation Controls */}
        {showControls && (
          <>
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Previous badge"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Next badge"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Dot Indicators */}
      <div className="flex gap-2">
        {badges.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-primary w-8'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to badge ${index + 1}`}
            aria-current={index === currentIndex}
          />
        ))}
      </div>

      {/* Badge Counter */}
      <p className="text-sm text-gray-600 font-medium">
        {currentIndex + 1} of {badges.length} Compliance Standards
      </p>
    </div>
  );
}
