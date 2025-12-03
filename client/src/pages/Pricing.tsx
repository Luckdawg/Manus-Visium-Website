import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import { DollarSign, TrendingDown, Users, CheckCircle2, Calculator } from "lucide-react";

export default function Pricing() {
  const [nodeCount, setNodeCount] = useState(10000);

  // Tiered pricing logic with volume discounts
  const calculatePricing = useMemo(() => {
    const tiers = [
      { max: 10000, price: 1.00 },      // $1.00 per node for first 10k
      { max: 50000, price: 0.75 },      // $0.75 per node for 10k-50k
      { max: 100000, price: 0.50 },     // $0.50 per node for 50k-100k
      { max: 250000, price: 0.35 },     // $0.35 per node for 100k-250k
      { max: 500000, price: 0.25 },     // $0.25 per node for 250k-500k
      { max: Infinity, price: 0.20 }    // $0.20 per node for 500k+
    ];

    let totalCost = 0;
    let remainingNodes = nodeCount;
    let previousMax = 0;

    for (const tier of tiers) {
      if (remainingNodes <= 0) break;
      
      const nodesInTier = Math.min(remainingNodes, tier.max - previousMax);
      totalCost += nodesInTier * tier.price;
      remainingNodes -= nodesInTier;
      previousMax = tier.max;
    }

    // Apply minimum monthly fee
    const monthlyCost = Math.max(totalCost, 10000);
    const annualCost = monthlyCost * 12;
    const effectivePricePerNode = monthlyCost / nodeCount;

    return {
      monthly: monthlyCost,
      annual: annualCost,
      perNode: effectivePricePerNode,
      savings: (annualCost * 0.15) // 15% discount on annual
    };
  }, [nodeCount]);

  const handleNodeCountChange = (value: string) => {
    const num = parseInt(value.replace(/,/g, '')) || 0;
    setNodeCount(Math.min(Math.max(num, 100), 1000000));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Calculator className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Transparent <span className="text-primary">Pricing</span>
            </h1>
            <p className="text-xl text-gray-600">
              Enterprise-grade cybersecurity intelligence that scales with your organization. Calculate your custom pricing based on your infrastructure size.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Calculator */}
      <section className="py-12 bg-white">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">Calculate Your Pricing</h2>
            <p className="text-xl text-gray-600">
              Adjust the slider or enter your node count to see your custom pricing
            </p>
          </div>

          <Card className="border-2 border-primary/20 mb-12">
            <CardContent className="p-8">
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Number of Nodes in Your Infrastructure
                </label>
                <div className="flex items-center gap-4 mb-6">
                  <Input
                    type="text"
                    value={formatNumber(nodeCount)}
                    onChange={(e) => handleNodeCountChange(e.target.value)}
                    className="text-2xl font-bold text-center"
                  />
                  <span className="text-gray-600 whitespace-nowrap">nodes</span>
                </div>
                <Slider
                  value={[nodeCount]}
                  onValueChange={(value) => setNodeCount(value[0])}
                  min={100}
                  max={1000000}
                  step={100}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>100 nodes</span>
                  <span>1,000,000 nodes</span>
                </div>
              </div>

              <div className="grid md:grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 text-center">
                  <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-sm text-gray-600 mb-1">Effective Price Per Node</div>
                  <div className="text-3xl font-bold text-gray-900">
                    {calculatePricing.perNode < 1 
                      ? `$${calculatePricing.perNode.toFixed(2)}`
                      : formatCurrency(calculatePricing.perNode)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">per month</div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 text-center">
                  <Users className="h-8 w-8 text-secondary mx-auto mb-2" />
                  <div className="text-sm text-gray-600 mb-1">Monthly Cost</div>
                  <div className="text-3xl font-bold text-gray-900">
                    {formatCurrency(calculatePricing.monthly)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">billed monthly</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 text-center">
                  <TrendingDown className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-sm text-gray-600 mb-1">Annual Cost</div>
                  <div className="text-3xl font-bold text-gray-900">
                    {formatCurrency(calculatePricing.annual)}
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    Save {formatCurrency(calculatePricing.savings)} with annual billing
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Volume Discount Tiers Applied:</h3>
                <div className="grid md:grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>First 10,000 nodes: <strong>$1.00/node</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>10,001 - 50,000: <strong>$0.75/node</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>50,001 - 100,000: <strong>$0.50/node</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>100,001 - 250,000: <strong>$0.35/node</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>250,001 - 500,000: <strong>$0.25/node</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>500,001+: <strong>$0.20/node</strong></span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link href="/demo">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Get Custom Quote
                  </Button>
                </Link>
                <p className="text-sm text-gray-500 mt-3">
                  Minimum monthly fee: $10,000 • Enterprise support included
                </p>
              </div>
            </CardContent>
          </Card>

          {/* What's Included */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What's Included</h2>
            <div className="grid md:grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Platform Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Agentic AI-powered threat detection and analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Dual database architecture (graph database + relational database)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Real-time network visualization and graph analytics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>MITRE ATT&CK framework integration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Geospatial mapping and threat visualization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>AI-powered icon generation and asset management</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Support & Services</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>24/7 enterprise support with dedicated account team</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Onboarding and training for your security team</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Custom integrations with existing security tools</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Regular platform updates and feature releases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Flexible deployment options (Cloud, On-Prem, Hybrid)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>SLA guarantees with 99.9% uptime</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ROI Calculator CTA */}
          <Card className="bg-gradient-to-r from-primary to-secondary text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-3xl font-bold mb-4">See Your ROI</h3>
              <p className="text-lg mb-6 opacity-90">
                Calculate how much you can save with TruContext's agentic AI-powered threat detection
              </p>
              <Link href="/why/roi">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  Calculate ROI
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-gray-50">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Pricing FAQs</h2>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">What counts as a "node"?</h3>
                <p className="text-gray-600">
                  A node is any monitored entity in your infrastructure: servers, workstations, network devices, IoT devices, cloud instances, containers, or virtual machines. Each unique asset monitored by TruContext counts as one node.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Why is there a $10,000 minimum monthly fee?</h3>
                <p className="text-gray-600">
                  TruContext is an enterprise-grade platform with advanced agentic AI capabilities, dual database architecture, and 24/7 support. The minimum ensures we can provide the level of service, infrastructure, and support that enterprise customers require.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">How do volume discounts work?</h3>
                <p className="text-gray-600">
                  Our tiered pricing automatically applies volume discounts as your node count increases. For example, if you have 60,000 nodes, the first 10,000 are priced at $1.00/node, the next 40,000 at $0.75/node, and the remaining 10,000 at $0.50/node.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Can I get a custom enterprise agreement?</h3>
                <p className="text-gray-600">
                  Yes! For organizations with over 500,000 nodes or unique requirements, we offer custom enterprise agreements with tailored pricing, dedicated support, and specialized features. Contact our sales team for details.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Schedule a consultation to discuss your specific needs and get a custom quote
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Schedule Consultation
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
  );
}
