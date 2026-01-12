import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Shield, AlertCircle, TrendingUp, Lock, CheckCircle2, DollarSign } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import CountUp from "@/components/CountUp";

export default function FinancialServicesCybersecurity() {
  return (
    <>
      <SEOHead
        title="Financial Services Cybersecurity Platform | PCI-DSS Compliance | Fraud Detection"
        description="Protect financial institutions with TruContext's fraud detection and cybersecurity platform. Real-time threat detection, PCI-DSS compliance, and transaction security for banks and fintech."
        keywords="financial services cybersecurity, PCI-DSS compliance, fraud detection platform, banking security, fintech cybersecurity, transaction security, financial data protection, insider threat detection banking"
        canonicalUrl="/solutions/financial-services-cybersecurity"
      />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Financial Services Cybersecurity with <span className="text-primary">Fraud Detection</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Protect financial institutions from cyber threats and fraud with real-time threat detection and transaction analytics. TruContext delivers PCI-DSS compliant cybersecurity for banks, credit unions, fintech platforms, and payment processors with advanced fraud detection and insider threat monitoring.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Schedule a Demo
                  </Button>
                </Link>
                <Link href="/company/contact">
                  <Button size="lg" variant="outline">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* The Challenge */}
        <section className="py-8 md:py-12 bg-white">
          <div className="container">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              The Challenge
            </h2>
            <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
              Financial institutions face sophisticated cyber threats targeting customer data, transaction systems, and regulatory compliance. Fraud losses exceeded $28 billion in 2024, with average cost per incident reaching $4.45 million. Legacy fraud detection systems miss coordinated attacks and insider threats while struggling to maintain PCI-DSS, SOX, and regulatory compliance.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Fraud & Theft</h3>
                      <p className="text-gray-600">Coordinated attacks on payment systems and customer accounts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-6 w-6 text-orange-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Insider Threats</h3>
                      <p className="text-gray-600">Rogue employees and contractors accessing customer data</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Lock className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Regulatory Burden</h3>
                      <p className="text-gray-600">PCI-DSS, SOX, GLBA, and state privacy laws create compliance complexity</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-8 md:py-12 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="container">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Financial Fraud Detection & Cybersecurity Analytics
            </h2>
            <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
              TruContext is a financial services cybersecurity platform delivering real-time fraud detection and threat analytics for banking systems, payment networks, and transaction processing. Our fraud detection platform ensures PCI-DSS compliance while detecting account takeover, payment fraud, and insider threats.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <DollarSign className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <h3 className="text-xl font-bold text-gray-900">Fraud Detection & Prevention</h3>
                  </div>
                  <p className="text-gray-600">
                    Real-time detection of account takeover, payment fraud, and money laundering patterns. Identify coordinated fraud rings and prevent losses before they occur using graph-based transaction correlation.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <Shield className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                    <h3 className="text-xl font-bold text-gray-900">Insider Threat Detection</h3>
                  </div>
                  <p className="text-gray-600">
                    Monitor employee and contractor access to customer data, accounts, and systems. Detect privilege abuse, data exfiltration, and unauthorized transactions with behavioral analytics.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <AlertCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <h3 className="text-xl font-bold text-gray-900">Cyber Threat Detection</h3>
                  </div>
                  <p className="text-gray-600">
                    Detect APT attacks targeting banking infrastructure, payment systems, and customer data. Monitor for credential theft, lateral movement, and data exfiltration across network and endpoints.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <CheckCircle2 className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                    <h3 className="text-xl font-bold text-gray-900">Compliance Automation</h3>
                  </div>
                  <p className="text-gray-600">
                    Automated PCI-DSS, SOX, GLBA, and state privacy law compliance monitoring. Generate audit reports and demonstrate security controls to regulators and auditors.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Key Financial Services Security Capabilities</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Transaction Monitoring</p>
                    <p className="text-sm text-gray-600">Real-time analysis of payment flows and transaction patterns</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">AML/KYC Monitoring</p>
                    <p className="text-sm text-gray-600">Anti-money laundering and know-your-customer compliance</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Account Access Monitoring</p>
                    <p className="text-sm text-gray-600">Track privileged access and detect unauthorized account access</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Network Segmentation</p>
                    <p className="text-sm text-gray-600">Enforce payment network isolation and monitor cross-segment traffic</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Proven ROI */}
        <section className="py-8 md:py-12 bg-white">
          <div className="container">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Proven Financial Services ROI
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    <CountUp end={85} suffix="%" />
                  </div>
                  <p className="text-gray-600 font-semibold">Fraud Detection Improvement</p>
                  <p className="text-sm text-gray-500 mt-2">Catch fraud before customer impact</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">
                    <CountUp end={70} suffix="%" />
                  </div>
                  <p className="text-gray-600 font-semibold">Faster Investigation</p>
                  <p className="text-sm text-gray-500 mt-2">Reduce fraud investigation time</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    <CountUp end={95} suffix="%" />
                  </div>
                  <p className="text-gray-600 font-semibold">Compliance Automation</p>
                  <p className="text-sm text-gray-500 mt-2">Reduce audit and reporting burden</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 rounded-lg p-8 border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Financial Services Security Metrics</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-700 mb-2"><strong>Fraud Loss Prevention:</strong> Detect and stop fraud attempts before funds are transferred</p>
                  <p className="text-gray-700 mb-2"><strong>Compliance Audit Readiness:</strong> Automated documentation for PCI-DSS, SOX, GLBA, and state privacy laws</p>
                </div>
                <div>
                  <p className="text-gray-700 mb-2"><strong>Customer Trust:</strong> Demonstrate security controls and fraud prevention to customers and regulators</p>
                  <p className="text-gray-700 mb-2"><strong>Cost Avoidance:</strong> Average fraud incident costs $4.45 million—prevention is critical</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section className="py-8 md:py-12 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="container">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Regulatory Compliance & Standards
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">PCI-DSS & Payment Security</h3>
                  <p className="text-gray-600 mb-4">
                    Automated monitoring of PCI-DSS requirements including access controls, encryption, vulnerability management, and incident response. Maintain compliance across payment processing systems and card data environments.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ Payment card data protection (PCI-DSS v3.2.1)</li>
                    <li>✓ Network segmentation enforcement</li>
                    <li>✓ Vulnerability scanning and management</li>
                    <li>✓ Access control monitoring</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Financial Regulations</h3>
                  <p className="text-gray-600 mb-4">
                    Support for banking and financial services regulations including SOX, GLBA, state privacy laws, and international standards like GDPR and CCPA.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ Sarbanes-Oxley (SOX) compliance</li>
                    <li>✓ Gramm-Leach-Bliley Act (GLBA)</li>
                    <li>✓ State privacy laws (CCPA, GDPR)</li>
                    <li>✓ Anti-Money Laundering (AML) monitoring</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-8 md:py-12 bg-gradient-to-r from-primary to-secondary text-white">
          <div className="container text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              Protect Financial Assets with Advanced Fraud Detection
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              See how TruContext helps financial institutions detect fraud, prevent cyber attacks, and maintain regulatory compliance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  Schedule a Demo
                </Button>
              </Link>
              <Link href="/company/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
