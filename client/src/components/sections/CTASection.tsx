import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  variant?: "primary" | "gradient";
}

/**
 * Reusable call-to-action section component
 * Used at the bottom of solution pages and case studies
 */
export function CTASection({
  title,
  description,
  ctaText = "Schedule a Demo",
  ctaLink = "/demo",
  variant = "gradient"
}: CTASectionProps) {
  const className = variant === "gradient"
    ? "py-12 bg-gradient-to-r from-primary to-secondary text-white"
    : "py-12 bg-primary text-white";

  return (
    <section className={className}>
      <div className="container text-center">
        <h2 className="text-4xl font-bold mb-6">{title}</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          {description}
        </p>
        <Link href={ctaLink}>
          <Button 
            size="lg" 
            variant="secondary" 
            className="bg-white text-primary hover:bg-gray-100"
          >
            {ctaText}
          </Button>
        </Link>
      </div>
    </section>
  );
}
