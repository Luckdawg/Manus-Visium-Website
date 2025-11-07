import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Handshake, Users, TrendingUp } from "lucide-react";

export default function Partners() {
  return (
    <div className="min-h-screen">
      <section className="gradient-hero py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Partner <span className="text-primary">Program</span>
            </h1>
            <p className="text-xl text-gray-600">
              Join our ecosystem and deliver TruContext intelligence to your customers
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Partner with Visium</h2>
            <p className="text-xl text-gray-600">
              Our partner program provides comprehensive support, competitive margins, and access to cutting-edge AI-powered intelligence technology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Handshake className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Technology Partners</h3>
                <p className="text-gray-600">
                  Integrate TruContext with your platform or resell to your customers
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Users className="h-16 w-16 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Channel Partners</h3>
                <p className="text-gray-600">
                  Deliver TruContext solutions with dedicated support and training
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <TrendingUp className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Strategic Alliances</h3>
                <p className="text-gray-600">
                  Co-develop solutions and go-to-market strategies together
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Become a Partner</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Let's discuss how we can work together to deliver intelligence solutions
          </p>
          <Link href="/company/contact">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
              Contact Partner Team
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
