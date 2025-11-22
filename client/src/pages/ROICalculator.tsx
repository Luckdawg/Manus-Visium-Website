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
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
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
          <div className="grid lg:grid-cols-2 gap-6 mb-12">
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
                  <div className="text-5xl font-bold mb-2">
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Calculation Methodology</h2>
          <Card>
            <CardContent className="p-8">
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Investigation Cost Savings:</strong> Based on 90% reduction in false positives and 60% faster incident response times, reducing the total number of incidents requiring investigation and the time spent per incident.
                </p>
                <p>
                  <strong>Breach Prevention Value:</strong> TruContext's agentic AI and real-time threat detection prevents an estimated 40% of breaches through early detection and automated response capabilities.
                </p>
                <p>
                  <strong>MTTD Improvement Value:</strong> 75% reduction in Mean Time to Detect translates to approximately 15% reduction in breach costs, as faster detection significantly limits attacker dwell time and damage.
                </p>
                <p className="text-sm text-gray-600 italic">
                  * These projections are based on documented customer results and industry research. Actual results may vary based on your specific environment, security maturity, and implementation approach.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
