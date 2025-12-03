import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Shield, Users, TrendingUp } from "lucide-react";
import FollowUs from "@/components/FollowUs";

export default function About() {
  return (
    <div className="min-h-screen">
      <section className="gradient-hero py-8">
        <div className="container">
          {/* Visium Technologies Logo - Upper Left */}
          <div className="mb-6">
            <img 
              src="/visium-technologies-logo-new.png" 
              alt="Visium Technologies" 
              className="h-12 sm:h-14 md:h-16 object-contain"
            />
          </div>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              About <span className="text-primary">Visium Technologies</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Transforming data into actionable intelligence for enterprises worldwide
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Subsidiary Relationship */}
            <div className="bg-blue-50 border-l-4 border-primary p-6 mb-8 rounded-r-lg">
              <p className="text-lg font-semibold text-gray-900 mb-2">
                Visium Analytics is a subsidiary of Visium Technologies
              </p>
              <p className="text-gray-700">
                Together, we deliver cutting-edge intelligence solutions that combine advanced analytics with enterprise-grade security and scalability.
              </p>
            </div>

            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-6">
              Visium Technologies is dedicated to empowering organizations with AI-powered intelligence platforms that transform complex data into actionable insights. Our TruContext platform brings defense-grade capabilities to enterprise cybersecurity, smart cities, and critical infrastructure protection.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Built on technology enhanced from MITRE Corporation's CyGraph platform, TruContext represents the evolution of military-grade intelligence for commercial applications. We believe that every organization deserves access to the most advanced threat detection and operational intelligence capabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <Card className="text-center">
              <CardContent className="p-8">
                <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Military Heritage</h3>
                <p className="text-gray-600">
                  Enhanced from technology developed for US Army Cyber Command
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <Users className="h-16 w-16 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Customer Focused</h3>
                <p className="text-gray-600">
                  Dedicated to delivering measurable ROI and exceptional support
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <TrendingUp className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Innovation Driven</h3>
                <p className="text-gray-600">
                  Continuously advancing AI and graph database technology
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Follow Us Section */}
      <FollowUs />

      <section className="py-8 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Team</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            We're always looking for talented individuals to join our mission
          </p>
          <Link href="/company/careers">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
              View Open Positions
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
