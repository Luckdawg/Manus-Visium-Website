import { useEffect, useRef, useState } from 'react';

interface UseParallaxOptions {
  speed?: number; // Parallax speed multiplier (0.1 = slow, 1.0 = fast)
  direction?: 'up' | 'down';
}

/**
 * Hook to create parallax scrolling effect on an element
 * @param options - Parallax configuration options
 * @returns ref to attach to element and transform value
 */
export function useParallax(options: UseParallaxOptions = {}) {
  const { speed = 0.3, direction = 'up' } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    const handleScroll = () => {
      if (!ref.current) return;

      const element = ref.current;
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Calculate parallax offset based on scroll position
      // Only apply parallax when element is in viewport
      if (elementTop < windowHeight && elementTop + elementHeight > 0) {
        const scrolled = windowHeight - elementTop;
        const parallaxOffset = scrolled * speed;
        const finalOffset = direction === 'up' ? -parallaxOffset : parallaxOffset;
        setOffset(finalOffset);
      }
    };

    // Initial calculation
    handleScroll();

    // Add scroll listener with passive flag for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed, direction]);

  return { ref, offset };
}
