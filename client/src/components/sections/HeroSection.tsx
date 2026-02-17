import { ReactNode } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  title: string | ReactNode;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  className?: string;
}

/**
 * Reusable hero section component
 * Used across solution pages, case studies, and landing pages
 */
export function HeroSection({
  title,
  description,
  ctaText = "Schedule a Demo",
  ctaLink = "/demo",
  className = "gradient-hero py-12"
}: HeroSectionProps) {
  return (
    <section className={className}>
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {title}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {description}
          </p>
          <Link href={ctaLink}>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              {ctaText}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
