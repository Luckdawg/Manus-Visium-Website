import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";

export default function Telecommunications() {
  return (
    <div className="min-h-screen">
      <section className="gradient-hero py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Telecommunications Network <span className="text-primary">Operations</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Network topology visualization and predictive failure analysis
            </p>
            <Link href="/demo">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Schedule a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Comprehensive Solution</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              TruContext provides the intelligence and insights needed to optimize operations, enhance security, and ensure compliance in telecommunications network operations.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <CheckCircle2 className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Real-Time Monitoring</h3>
                <p className="text-gray-600">Continuous visibility across all systems and operations</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <CheckCircle2 className="h-10 w-10 text-secondary mb-4" />
                <h3 className="text-xl font-bold mb-3">Predictive Analytics</h3>
                <p className="text-gray-600">AI-powered forecasting and anomaly detection</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <CheckCircle2 className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Unified Intelligence</h3>
                <p className="text-gray-600">Single platform for all data sources and insights</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            See how TruContext can transform your operations
          </p>
          <Link href="/demo">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
              Schedule a Demo
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
