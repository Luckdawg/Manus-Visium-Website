import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, ArrowRight, Handshake, Zap, BarChart3, Mail } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function PartnerLogin() {
  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  const features = [
    {
      icon: <Handshake className="h-8 w-8 text-primary" />,
      title: "Deal Management",
      description: "Track your pipeline from leads to closed deals with real-time visibility"
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "MDF Claims",
      description: "Submit and track marketing development fund claims with instant approval notifications"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "Performance Analytics",
      description: "Monitor your win rates, deal velocity, and commission earnings in real-time"
    },
    {
      icon: <Mail className="h-8 w-8 text-primary" />,
      title: "Resource Library",
      description: "Access sales collateral, product documentation, and training materials"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-6">
          <div className="flex items-center gap-3">
            <Handshake className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Visium Partner Portal</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Features */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Welcome to Your <span className="text-primary">Partner Portal</span>
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Manage your partnership with Visium Technologies. Track deals, submit MDF claims, access resources, and monitor your performance—all in one place.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Login Card */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md shadow-xl">
              <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg">
                <CardTitle className="text-2xl">Partner Login</CardTitle>
                <p className="text-white/90 mt-2">Sign in to access your partner portal</p>
              </CardHeader>
              <CardContent className="pt-8 pb-8">
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      <strong>New to the partner program?</strong> Contact our partner team at <a href="mailto:partners@visiumtech.com" className="text-primary hover:underline">partners@visiumtech.com</a> to get started.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-600 text-center">
                      Click below to sign in with your Visium account
                    </p>
                    <Button
                      onClick={handleLogin}
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg text-white font-bold py-6 text-lg gap-2"
                    >
                      <LogIn className="h-5 w-5" />
                      Sign In to Partner Portal
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="border-t pt-6">
                    <p className="text-xs text-gray-500 text-center">
                      By signing in, you agree to our Partner Program Terms and Conditions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <section className="bg-white py-12 mt-12">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Join Our Partner Program?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Grow your business with Visium's industry-leading cybersecurity platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-4">20%+</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Commission Rates</h3>
                <p className="text-gray-600">
                  Competitive commission structure with higher tiers for top performers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-4">$50K+</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Annual MDF Budget</h3>
                <p className="text-gray-600">
                  Marketing development funds to support your go-to-market initiatives
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-4">24/7</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Partner Support</h3>
                <p className="text-gray-600">
                  Dedicated partner success team to help you grow and succeed
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
