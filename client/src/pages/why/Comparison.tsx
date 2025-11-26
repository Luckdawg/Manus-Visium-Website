import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

export default function Comparison() {
  const comparisonData = [
    {
      feature: "Data Integration",
      traditional: "Manual ETL, limited sources",
      trucontext: "Unified platform, multiple sources",
      value: "Save time, reduce errors"
    },
    {
      feature: "Analytics & Visualization",
      traditional: "Basic charts, limited interactivity",
      trucontext: "Interactive dashboards, AI insights",
      value: "Faster, more accurate decisions"
    },
    {
      feature: "Scalability",
      traditional: "Degrades with large data",
      trucontext: "Seamlessly handles large datasets",
      value: "Reliable enterprise performance"
    },
    {
      feature: "Security & Access Control",
      traditional: "Basic or inconsistent",
      trucontext: "Enterprise-grade permissions & audit logs",
      value: "Compliance & secure collaboration"
    },
    {
      feature: "Maintenance & Overhead",
      traditional: "High manual effort",
      trucontext: "Managed platform with automation",
      value: "Reduced operational burden"
    }
  ];

  const useCases = [
    {
      title: "Enterprise Data Consolidation",
      challenge: "Multiple departments use disconnected spreadsheets and tools.",
      application: "Integrates all sources into a single platform.",
      outcome: "Streamlined reporting, faster insights, better collaboration."
    },
    {
      title: "Mineral Traceability & Supply Chain",
      challenge: "Tracking mineral provenance across suppliers and logistics channels.",
      application: "Aggregates sensor, shipment, and regulatory data.",
      outcome: "Reduced errors, improved transparency, faster compliance."
    },
    {
      title: "Video Surveillance Analytics",
      challenge: "Police and security agencies struggle to analyze video data quickly.",
      application: "AI-driven video analytics flags key events and consolidates footage.",
      outcome: "Faster response times, improved operational efficiency, enhanced public safety."
    },
    {
      title: "Predictive Maintenance",
      challenge: "Equipment failures cause downtime and high costs.",
      application: "Analyzes sensor data to predict maintenance needs.",
      outcome: "Reduced downtime, cost savings, optimized efficiency."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-12 sm:py-16">
        <div className="container max-w-4xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            How TruContext Compares
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 max-w-3xl mx-auto">
            Explore potential applications, see how TruContext stands out from traditional tools, 
            and discover the value it could deliver.
          </p>
          <Link href="/demo">
            <Button size="lg" className="text-sm sm:text-base">
              Request a Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container">
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="text-left py-3 px-3 sm:px-4 text-sm sm:text-base font-semibold">
                    Feature / Capability
                  </th>
                  <th className="text-left py-3 px-3 sm:px-4 text-sm sm:text-base font-semibold">
                    Traditional / Legacy Tools
                  </th>
                  <th className="text-left py-3 px-3 sm:px-4 text-sm sm:text-base font-semibold">
                    TruContext
                  </th>
                  <th className="text-left py-3 px-3 sm:px-4 text-sm sm:text-base font-semibold">
                    Potential Value / Outcome
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {comparisonData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3 sm:px-4 font-medium text-sm sm:text-base text-gray-900">
                      {row.feature}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-sm sm:text-base text-gray-600">
                      {row.traditional}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-sm sm:text-base text-blue-600 font-medium">
                      {row.trucontext}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-sm sm:text-base text-green-600 font-medium">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Use-Case Scenarios Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container max-w-6xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
            Potential Use-Case Scenarios
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-shadow bg-white">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                  {useCase.title}
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <p className="text-sm sm:text-base text-gray-700">
                    <strong className="text-gray-900">Challenge:</strong> {useCase.challenge}
                  </p>
                  <p className="text-sm sm:text-base text-gray-700">
                    <strong className="text-blue-600">TruContext Application:</strong> {useCase.application}
                  </p>
                  <p className="text-sm sm:text-base text-gray-700">
                    <strong className="text-green-600">Potential Outcome:</strong> {useCase.outcome}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container text-center">
          <Link href="/demo">
            <Button size="lg" className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4">
              Request a Demo
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
