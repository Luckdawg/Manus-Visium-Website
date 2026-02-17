import { PageLayout } from "@/components/layouts/PageLayout";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeatureGrid, Feature } from "@/components/sections/FeatureGrid";
import { CTASection } from "@/components/sections/CTASection";

const features: Feature[] = [
  {
    title: "Real-Time Monitoring",
    description: "Continuous visibility across all systems and operations"
  },
  {
    title: "Predictive Analytics",
    description: "AI-powered forecasting and anomaly detection"
  },
  {
    title: "Unified Intelligence",
    description: "Single platform for all data sources and insights"
  }
];

export default function Healthcare() {
  return (
    <PageLayout>
      <HeroSection
        title={<>Healthcare <span className="text-primary">Analytics</span></>}
        description="Optimize patient safety, operational efficiency, and regulatory compliance"
      />

      <FeatureGrid
        title="Comprehensive Solution"
        description="TruContext provides the intelligence and insights needed to optimize operations, enhance security, and ensure compliance in healthcare analytics."
        features={features}
      />

      <CTASection
        title="Ready to Get Started?"
        description="See how TruContext can transform your operations"
      />
    </PageLayout>
  );
}
