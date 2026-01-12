import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Shield, AlertCircle, TrendingUp, Lock, CheckCircle2, Heart } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import CountUp from "@/components/CountUp";
import ComplianceBadge from "@/components/ComplianceBadge";

export default function HealthcareCybersecurity() {
  return (
    <>
      <SEOHead
        title="Healthcare Cybersecurity Analytics Platform | HIPAA Compliance | TruContext"
        description="Protect patient data with TruContext's healthcare cybersecurity platform. Real-time threat detection, HIPAA compliance, and ransomware protection for healthcare organizations."
        keywords="healthcare cybersecurity, HIPAA compliance, healthcare data protection, ransomware protection healthcare, medical device security, healthcare threat detection, patient data security"
        canonicalUrl="/solutions/healthcare-cybersecurity"
      />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Healthcare Cybersecurity Platform with <span className="text-primary">HIPAA Compliance</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Protect patient data and medical devices with real-time threat detection and ransomware protection. TruContext delivers healthcare-specific cybersecurity analytics ensuring HIPAA compliance, HITECH Act adherence, and comprehensive medical device security.
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
              Healthcare organizations face unprecedented cybersecurity threats. Ransomware attacks targeting hospitals have increased 300% in recent years, with average recovery costs exceeding $10 million. Legacy security tools struggle to protect connected medical devices, patient data systems, and critical infrastructure simultaneously while maintaining HIPAA compliance.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Ransomware Attacks</h3>
                      <p className="text-gray-600">Hospitals targeted for patient data and operational disruption</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-6 w-6 text-orange-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Medical Device Vulnerabilities</h3>
                      <p className="text-gray-600">Connected devices lack security monitoring and patching</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Lock className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Compliance Complexity</h3>
                      <p className="text-gray-600">HIPAA, HITECH, and state breach notification laws create audit burden</p>
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
              Healthcare-Specific Threat Detection & Compliance
            </h2>
            <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
              TruContext is a healthcare cybersecurity analytics platform delivering real-time threat detection for patient data systems, medical devices, and clinical networks. Our healthcare data protection solution ensures HIPAA compliance while detecting ransomware, insider threats, and unauthorized access attempts.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <Heart className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <h3 className="text-xl font-bold text-gray-900">Patient Data Protection</h3>
                  </div>
                  <p className="text-gray-600">
                    Real-time monitoring of Electronic Health Records (EHR) systems, patient databases, and data repositories. Detect unauthorized access, data exfiltration, and insider threats targeting sensitive patient information (PII, PHI, genetic data).
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <Shield className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                    <h3 className="text-xl font-bold text-gray-900">Medical Device Security</h3>
                  </div>
                  <p className="text-gray-600">
                    Monitor connected medical devices (pacemakers, infusion pumps, imaging systems) for anomalous behavior and unauthorized commands. Detect firmware vulnerabilities and prevent device hijacking attacks.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <AlertCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <h3 className="text-xl font-bold text-gray-900">Ransomware Detection</h3>
                  </div>
                  <p className="text-gray-600">
                    Identify ransomware campaigns before encryption occurs. Detect lateral movement, credential theft, and file system encryption patterns. Enable rapid response to minimize downtime and patient impact.
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
                    Automated HIPAA compliance monitoring, audit logging, and breach notification workflows. Generate compliance reports for OCR (Office for Civil Rights) investigations and demonstrate security controls.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Key Healthcare Security Capabilities</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">EHR System Monitoring</p>
                    <p className="text-sm text-gray-600">Real-time monitoring of Epic, Cerner, and other EHR platforms</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Network Segmentation</p>
                    <p className="text-sm text-gray-600">Enforce clinical network isolation and monitor cross-segment traffic</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Access Control Monitoring</p>
                    <p className="text-sm text-gray-600">Track privileged access to patient data and detect abuse</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Incident Response</p>
                    <p className="text-sm text-gray-600">Automated breach detection and notification workflows</p>
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
              Proven Healthcare Security ROI
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    <CountUp end={75} suffix="%" />
                  </div>
                  <p className="text-gray-600 font-semibold">Reduction in MTTD</p>
                  <p className="text-sm text-gray-500 mt-2">Detect threats before patient impact</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">
                    <CountUp end={90} suffix="%" />
                  </div>
                  <p className="text-gray-600 font-semibold">Reduction in False Positives</p>
                  <p className="text-sm text-gray-500 mt-2">Focus security team on real threats</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    <CountUp end={60} suffix="%" />
                  </div>
                  <p className="text-gray-600 font-semibold">Faster Incident Response</p>
                  <p className="text-sm text-gray-500 mt-2">Minimize operational disruption</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 rounded-lg p-8 border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Healthcare Security Metrics</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-700 mb-2"><strong>Ransomware Prevention:</strong> Detect and stop attacks before encryption spreads to patient care systems</p>
                  <p className="text-gray-700 mb-2"><strong>Compliance Audit Readiness:</strong> Automated documentation for HIPAA, HITECH, and state breach notification requirements</p>
                </div>
                <div>
                  <p className="text-gray-700 mb-2"><strong>Patient Safety:</strong> Ensure medical device integrity and prevent unauthorized clinical system access</p>
                  <p className="text-gray-700 mb-2"><strong>Breach Cost Avoidance:</strong> Average healthcare breach costs $10.93 million—prevention is critical</p>
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

            {/* Compliance Badge */}
            <div className="flex justify-center mb-12">
              <ComplianceBadge type="hipaa" size="large" showLabel={true} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">HIPAA & HITECH Compliance</h3>
                  <p className="text-gray-600 mb-4">
                    Automated monitoring of Security Rule requirements including access controls, audit logs, encryption, and breach notification. Demonstrate compliance during OCR audits with comprehensive security documentation.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ Access control enforcement and monitoring</li>
                    <li>✓ Audit and accountability logging</li>
                    <li>✓ Encryption and transmission security</li>
                    <li>✓ Breach notification workflows</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Additional Standards</h3>
                  <p className="text-gray-600 mb-4">
                    Support for healthcare-specific security frameworks and industry standards including FDA medical device security guidance and NIST Cybersecurity Framework.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ FDA medical device cybersecurity</li>
                    <li>✓ NIST Cybersecurity Framework</li>
                    <li>✓ State breach notification laws</li>
                    <li>✓ Joint Commission security standards</li>
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
              Protect Patient Data with Healthcare-Specific Cybersecurity
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              See how TruContext helps healthcare organizations detect threats, ensure compliance, and protect patient safety
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
