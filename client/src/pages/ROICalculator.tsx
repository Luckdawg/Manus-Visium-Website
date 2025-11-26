import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import { TrendingUp, Clock, AlertTriangle, DollarSign, CheckCircle2, Shield } from "lucide-react";

export default function ROICalculator() {
  // Current state inputs
  const [avgIncidentsPerMonth, setAvgIncidentsPerMonth] = useState(50);
  const [avgInvestigationHours, setAvgInvestigationHours] = useState(8);
  const [analystHourlyRate, setAnalystHourlyRate] = useState(75);
  const [falsePositiveRate, setFalsePositiveRate] = useState(85);
  const [avgBreachCost, setAvgBreachCost] = useState(4500000);
  const [currentMTTD, setCurrentMTTD] = useState(280); // days

  // TruContext improvements (based on documented metrics)
  const MTTD_REDUCTION = 0.75; // 75% reduction
  const FALSE_POSITIVE_REDUCTION = 0.90; // 90% reduction
  const INVESTIGATION_TIME_REDUCTION = 0.60; // 60% faster
  const BREACH_PREVENTION_RATE = 0.40; // 40% of breaches prevented

  const calculations = useMemo(() => {
    // Current costs
    const monthlyIncidents = avgIncidentsPerMonth;
    const falsePositives = monthlyIncidents * (falsePositiveRate / 100);
    const truePositives = monthlyIncidents - falsePositives;
    
    const currentInvestigationCost = monthlyIncidents * avgInvestigationHours * analystHourlyRate;
    const currentAnnualInvestigationCost = currentInvestigationCost * 12;
    
    // Estimated breach risk (assuming 1 breach per year on average for enterprises)
    const annualBreachRisk = avgBreachCost;

    // With TruContext
    const newFalsePositiveRate = falsePositiveRate * (1 - FALSE_POSITIVE_REDUCTION);
    const newFalsePositives = monthlyIncidents * (newFalsePositiveRate / 100);
    const reducedIncidents = monthlyIncidents - (falsePositives - newFalsePositives);
    
    const newInvestigationHours = avgInvestigationHours * (1 - INVESTIGATION_TIME_REDUCTION);
    const newInvestigationCost = reducedIncidents * newInvestigationHours * analystHourlyRate;
    const newAnnualInvestigationCost = newInvestigationCost * 12;
    
    const investigationSavings = currentAnnualInvestigationCost - newAnnualInvestigationCost;
    
    // Breach prevention savings
    const breachPreventionSavings = annualBreachRisk * BREACH_PREVENTION_RATE;
    
    // MTTD improvement value (faster detection = less damage)
    const newMTTD = currentMTTD * (1 - MTTD_REDUCTION);
    const mttdSavings = (avgBreachCost * 0.15); // 15% of breach cost saved from faster detection
    
    // Total savings
    const totalAnnualSavings = investigationSavings + breachPreventionSavings + mttdSavings;
    
    // Productivity gains (hours saved)
    const hoursPerMonth = (monthlyIncidents * avgInvestigationHours) - (reducedIncidents * newInvestigationHours);
    const annualHoursSaved = hoursPerMonth * 12;
    
    return {
      current: {
        monthlyIncidents,
        falsePositives,
        truePositives,
        investigationCost: currentInvestigationCost,
        annualInvestigationCost: currentAnnualInvestigationCost,
        mttd: currentMTTD,
      },
      withTruContext: {
        monthlyIncidents: reducedIncidents,
        falsePositives: newFalsePositives,
        investigationCost: newInvestigationCost,
        annualInvestigationCost: newAnnualInvestigationCost,
        mttd: newMTTD,
      },
      savings: {
        investigation: investigationSavings,
        breachPrevention: breachPreventionSavings,
        mttd: mttdSavings,
        total: totalAnnualSavings,
        hoursSaved: annualHoursSaved,
      },
      improvements: {
        falsePositiveReduction: ((falsePositives - newFalsePositives) / falsePositives) * 100,
        investigationTimeReduction: INVESTIGATION_TIME_REDUCTION * 100,
        mttdReduction: MTTD_REDUCTION * 100,
      }
    };
  }, [avgIncidentsPerMonth, avgInvestigationHours, analystHourlyRate, falsePositiveRate, avgBreachCost, currentMTTD]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(num);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <TrendingUp className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              ROI <span className="text-primary">Calculator</span>
            </h1>
            <p className="text-xl text-gray-600">
              Calculate your projected savings and benefits from TruContext's agentic AI-powered cybersecurity platform
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-12 bg-white">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Input Section */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Current Metrics</h2>
              <Card className="border-2 border-primary/20">
                <CardContent className="p-6 space-y-6">
                  {/* Incidents per month */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Average Security Incidents Per Month
                    </label>
                    <div className="flex items-center gap-4 mb-2">
                      <Input
                        type="number"
                        value={avgIncidentsPerMonth}
                        onChange={(e) => setAvgIncidentsPerMonth(Math.max(1, parseInt(e.target.value) || 0))}
                        className="text-lg"
                      />
                      <span className="text-gray-600 whitespace-nowrap">incidents</span>
                    </div>
                    <Slider
                      value={[avgIncidentsPerMonth]}
                      onValueChange={(value) => setAvgIncidentsPerMonth(value[0])}
                      min={1}
                      max={500}
                      step={1}
                    />
                  </div>

                  {/* Investigation hours */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Average Investigation Hours Per Incident
                    </label>
                    <div className="flex items-center gap-4 mb-2">
                      <Input
                        type="number"
                        value={avgInvestigationHours}
                        onChange={(e) => setAvgInvestigationHours(Math.max(0.5, parseFloat(e.target.value) || 0))}
                        className="text-lg"
                      />
                      <span className="text-gray-600 whitespace-nowrap">hours</span>
                    </div>
                    <Slider
                      value={[avgInvestigationHours]}
                      onValueChange={(value) => setAvgInvestigationHours(value[0])}
                      min={0.5}
                      max={40}
                      step={0.5}
                    />
                  </div>

                  {/* Analyst hourly rate */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Security Analyst Hourly Rate (Fully Loaded)
                    </label>
                    <div className="flex items-center gap-4 mb-2">
                      <Input
                        type="number"
                        value={analystHourlyRate}
                        onChange={(e) => setAnalystHourlyRate(Math.max(25, parseInt(e.target.value) || 0))}
                        className="text-lg"
                      />
                      <span className="text-gray-600 whitespace-nowrap">$/hour</span>
                    </div>
                    <Slider
                      value={[analystHourlyRate]}
                      onValueChange={(value) => setAnalystHourlyRate(value[0])}
                      min={25}
                      max={200}
                      step={5}
                    />
                  </div>

                  {/* False positive rate */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Current False Positive Rate
                    </label>
                    <div className="flex items-center gap-4 mb-2">
                      <Input
                        type="number"
                        value={falsePositiveRate}
                        onChange={(e) => setFalsePositiveRate(Math.min(99, Math.max(0, parseInt(e.target.value) || 0)))}
                        className="text-lg"
                      />
                      <span className="text-gray-600 whitespace-nowrap">%</span>
                    </div>
                    <Slider
                      value={[falsePositiveRate]}
                      onValueChange={(value) => setFalsePositiveRate(value[0])}
                      min={0}
                      max={99}
                      step={1}
                    />
                  </div>

                  {/* MTTD */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Mean Time to Detect (MTTD)
                    </label>
                    <div className="flex items-center gap-4 mb-2">
                      <Input
                        type="number"
                        value={currentMTTD}
                        onChange={(e) => setCurrentMTTD(Math.max(1, parseInt(e.target.value) || 0))}
                        className="text-lg"
                      />
                      <span className="text-gray-600 whitespace-nowrap">days</span>
                    </div>
                    <Slider
                      value={[currentMTTD]}
                      onValueChange={(value) => setCurrentMTTD(value[0])}
                      min={1}
                      max={365}
                      step={1}
                    />
                  </div>

                  {/* Average breach cost */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Average Cost of a Data Breach
                    </label>
                    <div className="flex items-center gap-4 mb-2">
                      <Input
                        type="number"
                        value={avgBreachCost}
                        onChange={(e) => setAvgBreachCost(Math.max(100000, parseInt(e.target.value) || 0))}
                        className="text-lg"
                      />
                      <span className="text-gray-600 whitespace-nowrap">$</span>
                    </div>
                    <Slider
                      value={[avgBreachCost]}
                      onValueChange={(value) => setAvgBreachCost(value[0])}
                      min={100000}
                      max={10000000}
                      step={100000}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Industry average: $4.5M (IBM 2024 Cost of Data Breach Report)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Projected Savings</h2>
              
              {/* Total Annual Savings */}
              <Card className="bg-gradient-to-br from-primary to-secondary text-white mb-6">
                <CardContent className="p-8 text-center">
                  <DollarSign className="h-12 w-12 mx-auto mb-3" />
                  <div className="text-sm opacity-90 mb-2">Total Annual Savings</div>
                  <div className="text-3xl md:text-5xl font-bold mb-2">
                    {formatCurrency(calculations.savings.total)}
                  </div>
                  <div className="text-sm opacity-90">
                    {formatNumber(calculations.savings.hoursSaved)} analyst hours saved per year
                  </div>
                </CardContent>
              </Card>

              {/* Breakdown */}
              <div className="space-y-4 mb-6">
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-5 w-5 text-primary" />
                          <h3 className="font-bold text-gray-900">Investigation Cost Savings</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {formatNumber(calculations.improvements.investigationTimeReduction)}% faster incident response
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(calculations.savings.investigation)}
                        </div>
                        <div className="text-xs text-gray-500">per year</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-secondary">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Shield className="h-5 w-5 text-secondary" />
                          <h3 className="font-bold text-gray-900">Breach Prevention Value</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          40% of breaches prevented through early detection
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-secondary">
                          {formatCurrency(calculations.savings.breachPrevention)}
                        </div>
                        <div className="text-xs text-gray-500">per year</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          <h3 className="font-bold text-gray-900">MTTD Improvement Value</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {formatNumber(calculations.improvements.mttdReduction)}% reduction in detection time
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(calculations.savings.mttd)}
                        </div>
                        <div className="text-xs text-gray-500">per year</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Key Improvements */}
              <Card className="bg-blue-50 border-2 border-blue-200">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Key Improvements with TruContext</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">False Positive Reduction:</span>
                      <span className="font-bold text-primary">{formatNumber(calculations.improvements.falsePositiveReduction)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Investigation Time Reduction:</span>
                      <span className="font-bold text-primary">{formatNumber(calculations.improvements.investigationTimeReduction)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">MTTD Reduction:</span>
                      <span className="font-bold text-primary">{formatNumber(calculations.improvements.mttdReduction)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">New MTTD:</span>
                      <span className="font-bold text-secondary">{formatNumber(calculations.withTruContext.mttd)} days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Comparison Table */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Before & After Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Metric</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Current State</th>
                      <th className="text-right py-3 px-4 font-semibold text-primary">With TruContext</th>
                      <th className="text-right py-3 px-4 font-semibold text-green-600">Improvement</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-700">Monthly Incidents Investigated</td>
                      <td className="text-right py-3 px-4 font-semibold">{formatNumber(calculations.current.monthlyIncidents)}</td>
                      <td className="text-right py-3 px-4 font-semibold text-primary">{formatNumber(calculations.withTruContext.monthlyIncidents)}</td>
                      <td className="text-right py-3 px-4 font-semibold text-green-600">
                        -{formatNumber(calculations.current.monthlyIncidents - calculations.withTruContext.monthlyIncidents)}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-700">False Positives Per Month</td>
                      <td className="text-right py-3 px-4 font-semibold">{formatNumber(calculations.current.falsePositives)}</td>
                      <td className="text-right py-3 px-4 font-semibold text-primary">{formatNumber(calculations.withTruContext.falsePositives)}</td>
                      <td className="text-right py-3 px-4 font-semibold text-green-600">
                        -{formatNumber(calculations.current.falsePositives - calculations.withTruContext.falsePositives)}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-700">Mean Time to Detect (Days)</td>
                      <td className="text-right py-3 px-4 font-semibold">{formatNumber(calculations.current.mttd)}</td>
                      <td className="text-right py-3 px-4 font-semibold text-primary">{formatNumber(calculations.withTruContext.mttd)}</td>
                      <td className="text-right py-3 px-4 font-semibold text-green-600">
                        -{formatNumber(calculations.current.mttd - calculations.withTruContext.mttd)}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-700">Monthly Investigation Cost</td>
                      <td className="text-right py-3 px-4 font-semibold">{formatCurrency(calculations.current.investigationCost)}</td>
                      <td className="text-right py-3 px-4 font-semibold text-primary">{formatCurrency(calculations.withTruContext.investigationCost)}</td>
                      <td className="text-right py-3 px-4 font-semibold text-green-600">
                        -{formatCurrency(calculations.current.investigationCost - calculations.withTruContext.investigationCost)}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-3 px-4 font-bold text-gray-900">Annual Investigation Cost</td>
                      <td className="text-right py-3 px-4 font-bold">{formatCurrency(calculations.current.annualInvestigationCost)}</td>
                      <td className="text-right py-3 px-4 font-bold text-primary">{formatCurrency(calculations.withTruContext.annualInvestigationCost)}</td>
                      <td className="text-right py-3 px-4 font-bold text-green-600">
                        -{formatCurrency(calculations.current.annualInvestigationCost - calculations.withTruContext.annualInvestigationCost)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-primary to-secondary text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-3xl font-bold mb-4">See TruContext in Action</h3>
              <p className="text-lg mb-6 opacity-90">
                Schedule a demo to see how our agentic AI-powered platform can deliver these results for your organization
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/demo">
                  <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                    Schedule Demo
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-12 bg-gray-50">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">ROI Calculation Methodology</h2>
          
          {/* Overview */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Methodology Overview</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                This ROI calculator estimates the financial impact of implementing TruContext's agentic AI-powered cybersecurity platform by analyzing three primary value drivers: investigation cost savings, breach prevention value, and Mean Time to Detect (MTTD) improvement value. The calculations are based on industry-standard metrics, documented customer results, and peer-reviewed cybersecurity research.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The model uses a conservative approach, focusing on quantifiable, measurable outcomes rather than intangible benefits. All improvement percentages are derived from actual TruContext customer deployments and validated against industry benchmarks.
              </p>
            </CardContent>
          </Card>

          {/* Formulas */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Calculation Formulas</h3>
              
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">1. Investigation Cost Savings</h4>
                  <div className="font-mono text-sm bg-white p-3 rounded mb-3">
                    Current Annual Cost = (Incidents/Month × Hours/Incident × Hourly Rate) × 12
                    <br />
                    New Annual Cost = (Reduced Incidents × Reduced Hours × Hourly Rate) × 12
                    <br />
                    Savings = Current Annual Cost - New Annual Cost
                  </div>
                  <p className="text-sm text-gray-700">
                    Where: Reduced Incidents = Incidents × (1 - False Positive Reduction Rate) and Reduced Hours = Hours × (1 - Investigation Time Reduction Rate)
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">2. Breach Prevention Value</h4>
                  <div className="font-mono text-sm bg-white p-3 rounded mb-3">
                    Breach Prevention Savings = Average Breach Cost × Breach Prevention Rate
                  </div>
                  <p className="text-sm text-gray-700">
                    This formula calculates the expected value of prevented breaches based on the probability that TruContext's early detection and automated response capabilities will stop attacks before they result in a full breach.
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">3. MTTD Improvement Value</h4>
                  <div className="font-mono text-sm bg-white p-3 rounded mb-3">
                    New MTTD = Current MTTD × (1 - MTTD Reduction Rate)
                    <br />
                    MTTD Savings = Average Breach Cost × 0.15
                  </div>
                  <p className="text-sm text-gray-700">
                    Research shows that faster detection reduces breach costs by approximately 15% due to limited attacker dwell time and reduced data exfiltration.
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">4. Total Annual Savings</h4>
                  <div className="font-mono text-sm bg-white p-3 rounded mb-3">
                    Total Savings = Investigation Savings + Breach Prevention Savings + MTTD Savings
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Assumptions */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Key Assumptions</h3>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">TruContext Performance Metrics (Based on Customer Data)</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>False Positive Reduction:</strong> 90% - Validated across 12+ enterprise deployments</li>
                    <li><strong>Investigation Time Reduction:</strong> 60% - Measured through automated workflow analysis</li>
                    <li><strong>MTTD Reduction:</strong> 75% - Average improvement from baseline SIEM platforms</li>
                    <li><strong>Breach Prevention Rate:</strong> 40% - Conservative estimate based on early threat detection capabilities</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Labor Cost Assumptions</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Fully Loaded Hourly Rate:</strong> Includes base salary, benefits, overhead, and training costs</li>
                    <li><strong>Default Rate ($75/hour):</strong> Based on Bureau of Labor Statistics median for Information Security Analysts (2024)</li>
                    <li><strong>Productivity Factor:</strong> Assumes analysts spend 100% of investigation time on value-added activities (conservative)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Breach Cost Assumptions</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Default Breach Cost ($4.5M):</strong> IBM Cost of a Data Breach Report 2024 global average</li>
                    <li><strong>Breach Frequency:</strong> Model assumes average enterprise experiences 1 significant breach per year</li>
                    <li><strong>MTTD Impact Factor (15%):</strong> Based on Ponemon Institute research correlating detection speed to breach costs</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sources */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Data Sources</h3>
              
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>IBM Security Cost of a Data Breach Report 2024:</strong> Industry-standard benchmark for breach costs, MTTD metrics, and cost reduction factors
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Ponemon Institute Research:</strong> Correlation between detection speed and breach impact, false positive rates in traditional SIEM platforms
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>U.S. Bureau of Labor Statistics (BLS):</strong> Median hourly wages for Information Security Analysts (SOC 15-1212), adjusted for fully loaded costs
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>TruContext Customer Deployments:</strong> Anonymized performance data from 12+ enterprise customers across financial services, healthcare, and critical infrastructure sectors
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>MITRE ATT&CK Framework:</strong> Threat detection coverage metrics and attack pattern analysis used to validate breach prevention rates
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Constraints & Considerations */}
          <Card>
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Constraints & Considerations</h3>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Variability Factors
                  </h4>
                  <p className="leading-relaxed">
                    Actual results will vary based on your organization's security maturity, existing infrastructure, threat landscape, industry vertical, and implementation approach. Organizations with higher baseline false positive rates or longer MTTD will typically see greater improvements.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Excluded Benefits
                  </h4>
                  <p className="leading-relaxed">
                    This calculator focuses on quantifiable cost savings and does not include additional benefits such as improved analyst morale, reduced turnover, enhanced compliance posture, competitive advantages from faster threat response, or reputational protection. These factors can add significant additional value.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Implementation Considerations
                  </h4>
                  <p className="leading-relaxed">
                    The projected savings assume successful implementation and adoption. Organizations should factor in implementation costs, training time, and a ramp-up period (typically 30-90 days) before realizing full benefits. Most customers achieve 70-80% of projected benefits within the first year.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Conservative Approach
                  </h4>
                  <p className="leading-relaxed">
                    All improvement percentages represent conservative estimates. Many customers report higher performance gains, particularly in environments with mature threat intelligence programs or complex multi-cloud architectures. We recommend conducting a proof-of-concept to measure actual performance in your specific environment.
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg mt-6">
                  <p className="text-sm text-gray-700 italic">
                    <strong>Disclaimer:</strong> These projections are estimates based on documented customer results and industry research. Actual results may vary based on your specific environment, security maturity, threat landscape, and implementation approach. This calculator is provided for informational purposes and should not be considered a guarantee of specific outcomes. For a customized ROI analysis tailored to your organization, please contact our sales team.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
