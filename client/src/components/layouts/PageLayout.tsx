import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * Shared page layout wrapper component
 * Provides consistent structure for all pages
 */
export function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <div className={`min-h-screen ${className}`}>
      {children}
    </div>
  );
}
