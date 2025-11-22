import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Video, Eye, AlertTriangle, Users, Activity, Building2, Heart, ShoppingCart, GraduationCap, Hospital } from "lucide-react";

export default function TruInsight() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Launched September 2025
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Transform Passive Cameras Into <span className="text-primary">Proactive Intelligence Networks</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Tru-InSight™ extends TruContext's AI capabilities into physical security and video surveillance, converting existing camera infrastructure into intelligent, predictive systems
            </p>
            <Link href="/demo">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Request a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Overview</h2>
            <p className="text-xl text-gray-600">
              Tru-InSight™ positions itself as the extension of TruContext's AI capabilities into physical security and video surveillance, converting existing camera infrastructure into intelligent, predictive systems without necessitating costly hardware replacement.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                No Hardware Replacement Required
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Leverage your existing video surveillance infrastructure with AI-powered intelligence. Tru-InSight™ integrates seamlessly with any Video Management System (VMS) via webhook, RTSP, or API, transforming passive cameras into active threat detection and behavioral analysis systems.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Video className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Universal Compatibility</h4>
                    <p className="text-gray-600">Works with any existing VMS and camera infrastructure</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Eye className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">AI-Powered Analysis</h4>
                    <p className="text-gray-600">Real-time behavioral analysis and anomaly detection</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <AlertTriangle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Proactive Alerts</h4>
                    <p className="text-gray-600">Predictive threat detection before incidents occur</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <Video className="h-32 w-32 text-primary mx-auto mb-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Key Capabilities */}
      <section className="py-12 gradient-purple-blue">
        <div className="container">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Key Capabilities</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <AlertTriangle className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Predictive Threat Detection
                </h3>
                <p className="text-gray-700">
                  Identify suspicious behaviors such as loitering, unauthorized access attempts, or unusual movement patterns before they escalate into security incidents. The AI learns normal patterns and flags deviations that indicate potential threats.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <Users className="h-12 w-12 text-secondary mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Advanced Behavioral Analysis
                </h3>
                <p className="text-gray-700">
                  Track movement patterns, understand crowd dynamics, and analyze behavioral trends across multiple camera feeds. Detect anomalies in foot traffic, identify bottlenecks, and optimize space utilization based on real-time insights.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <Activity className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Real-Time Anomaly Detection
                </h3>
                <p className="text-gray-700">
                  Alert on deviations from normal patterns such as vehicles circling parking lots, equipment malfunctions, or unexpected gatherings. The system processes video streams in real-time to identify anomalies as they occur.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <Eye className="h-12 w-12 text-secondary mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Unified Intelligence Whiteboard
                </h3>
                <p className="text-gray-700">
                  Map video events to operational data and network diagrams for collaborative incident response. Teams can visualize connections between physical security events and cyber or operational incidents on a single unified platform.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* IREX.AI Integration */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary">
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                    Strategic Integration
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Enhanced with IREX.AI Technology
                  </h2>
                  <p className="text-xl text-gray-700 mb-8">
                    Tru-InSight™ integrates with IREX.AI's Searchveillance™ technology for facial recognition and license plate detection capabilities, establishing the platform's role in advanced physical security applications.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 text-left">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Eye className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Facial Recognition</h4>
                        <p className="text-gray-600">Advanced biometric identification and tracking</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Activity className="h-4 w-4 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">License Plate Detection</h4>
                        <p className="text-gray-600">Automatic vehicle identification and tracking</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Industry Applications */}
      <section className="py-12 gradient-purple-blue">
        <div className="container">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Industry Applications</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <Building2 className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Smart Cities & Public Safety
                </h3>
                <p className="text-gray-600">
                  Real-time threat identification, large-scale event security management, and traffic optimization for urban environments
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <Activity className="h-12 w-12 text-secondary mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Critical Infrastructure
                </h3>
                <p className="text-gray-600">
                  Perimeter security, unauthorized access detection, and physical-cyber threat correlation for power grids and utilities
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <ShoppingCart className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Retail & Logistics
                </h3>
                <p className="text-gray-600">
                  Theft and shrinkage detection, customer behavior analysis, and warehouse security monitoring
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <GraduationCap className="h-12 w-12 text-secondary mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Corporate Campuses & Education
                </h3>
                <p className="text-gray-600">
                  Campus security, visitor management, and emergency response coordination for large facilities
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <Hospital className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Healthcare Facilities
                </h3>
                <p className="text-gray-600">
                  Patient safety monitoring, restricted area access control, and staff security in medical environments
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <Building2 className="h-12 w-12 text-secondary mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Enterprise Security
                </h3>
                <p className="text-gray-600">
                  Building access control, parking lot security, and integration with cyber security operations
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Transform Your Video Surveillance</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            See how Tru-InSight™ can turn your existing cameras into an intelligent security network
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Schedule a Demo
              </Button>
            </Link>
            <Link href="/platform/ai-capabilities">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Explore AI Capabilities
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
