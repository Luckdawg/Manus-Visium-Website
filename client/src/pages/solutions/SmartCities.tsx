import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import CountUp from "@/components/CountUp";
import { Building2, Video, AlertTriangle, TrendingUp, Users, CheckCircle2 } from "lucide-react";

export default function SmartCities() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              <span className="text-primary">Smart City Security Analytics</span> & Public Safety Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Intelligent city security system connecting video intelligence, IoT sensors, 911 systems, and traffic data. Smart city threat detection platform providing real-time situational awareness and predictive analytics for urban operations and public safety.
            </p>
            <Link href="/demo">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Request a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">The Challenge</h2>
            <p className="text-xl text-gray-600">
              Municipal systems operate in silos—police, fire, traffic management, and emergency services each have their own data sources with no unified view. Cities need an intelligent security analytics platform that integrates disparate data sources into a single smart city security analytics solution for real-time threat detection and predictive public safety operations.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-12 gradient-purple-blue">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Smart City Security Analytics Solution</h2>
            <p className="text-xl text-gray-600">
              TruContext is an intelligent city security system that connects video intelligence, IoT sensors, 911 systems, and traffic data to provide real-time situational awareness and predictive analytics. Our smart city threat detection platform enables faster emergency response, traffic optimization, and incident prevention through advanced security analytics.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <Building2 className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Unified Intelligence Platform
                </h3>
                <p className="text-gray-700">
                  Break down data silos by integrating video feeds, IoT sensors, 911 dispatch systems, traffic cameras, and environmental monitors into a single unified view. Enable cross-department collaboration and faster decision-making.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <Video className="h-12 w-12 text-secondary mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Tru-InSight™ for Public Safety
                </h3>
                <p className="text-gray-700">
                  Apply AI-powered video intelligence for public safety threat identification, crowd monitoring during large-scale events, and automatic incident detection. Transform passive cameras into proactive security networks.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Traffic Optimization
                </h3>
                <p className="text-gray-700">
                  Use predictive analytics to optimize traffic flow, reduce congestion, and improve emergency vehicle routing. Analyze patterns to identify bottlenecks and automatically adjust signal timing.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <AlertTriangle className="h-12 w-12 text-secondary mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Incident Prevention
                </h3>
                <p className="text-gray-700">
                  Detect potential incidents before they escalate with predictive analytics. Identify suspicious behavior patterns, unusual gatherings, or environmental hazards in real-time to enable proactive intervention.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Key Applications</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Emergency Response Coordination</h4>
                  <p className="text-gray-600">Unified view for police, fire, and EMS with real-time incident mapping</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Large Event Security</h4>
                  <p className="text-gray-600">Crowd monitoring and threat detection for concerts, sports, and festivals</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Smart Traffic Management</h4>
                  <p className="text-gray-600">AI-powered traffic signal optimization and congestion prediction</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Environmental Monitoring</h4>
                  <p className="text-gray-600">Air quality, noise levels, and weather data integration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-white">
        <div className="container">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Key Benefits</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Users className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Enhanced Public Safety</h3>
                <p className="text-gray-600">
                  Faster emergency response and proactive threat detection improve citizen safety
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <TrendingUp className="h-16 w-16 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Operational Efficiency</h3>
                <p className="text-gray-600">
                  Unified platform reduces duplication and improves resource allocation
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Building2 className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Infrastructure</h3>
                <p className="text-gray-600">
                  Data-driven decisions for urban planning and infrastructure investment
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Build Your Smart City Platform</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            See how TruContext can unify your municipal systems for enhanced public safety
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Schedule a Demo
              </Button>
            </Link>
            <Link href="/platform/tru-insight">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Explore Tru-InSight™
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
