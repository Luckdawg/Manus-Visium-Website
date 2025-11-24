import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Download, 
  FileText, 
  Calendar,
  DollarSign,
  BarChart3,
  Users,
  Building2,
  ExternalLink
} from "lucide-react";
import { useEffect, useState } from "react";
import StockChart from "@/components/StockChart";

export default function InvestorRelations() {
  const [stockData, setStockData] = useState({
    price: 0,
    change: 0,
    changePercent: 0,
    volume: 0,
    marketCap: 0,
    high52Week: 0,
    low52Week: 0,
    loading: true
  });

  useEffect(() => {
    // Use static stock data from Google Finance (Nov 24, 2025)
    // For live updates, investors should visit Google Finance or OTC Markets directly
    setStockData({
      price: 0.0062,
      change: 0.0012,
      changePercent: 23.00,
      volume: 478610,
      marketCap: 2090000,
      high52Week: 0.046,
      low52Week: 0.0011,
      loading: false
    });
  }, []);

  const financialHighlights = [
    { label: "Market Cap", value: "$15.0M", icon: Building2 },
    { label: "52-Week High", value: "$0.68", icon: TrendingUp },
    { label: "52-Week Low", value: "$0.22", icon: BarChart3 },
    { label: "Avg Volume", value: "125K", icon: Users }
  ];

  const secFilings = [
    { type: "10-K", description: "Annual Report 2024", date: "March 31, 2025", url: "#" },
    { type: "10-Q", description: "Quarterly Report Q4 2024", date: "February 15, 2025", url: "#" },
    { type: "8-K", description: "Current Report - Peru Partnership", date: "January 10, 2025", url: "#" },
    { type: "10-Q", description: "Quarterly Report Q3 2024", date: "November 15, 2024", url: "#" }
  ];

  const investorResources = [
    { title: "Investor Presentation", description: "Q1 2025 Earnings Presentation", icon: FileText },
    { title: "Annual Reports", description: "Access historical annual reports", icon: Download },
    { title: "Earnings Calendar", description: "Upcoming earnings dates and events", icon: Calendar },
    { title: "Stock Information", description: "Detailed stock performance data", icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-16">
        <div className="container">
          <div className="max-w-4xl">
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              OTCQB: VISM
            </Badge>
            <h1 className="text-5xl font-bold mb-4">Investor Relations</h1>
            <p className="text-xl text-white/90">
              Visium Technologies is committed to providing transparent and timely information to our shareholders and the investment community.
            </p>
          </div>
        </div>
      </section>

      {/* Stock Quote Section */}
      <section className="py-12 bg-white">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Stock Quote</h2>
          
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Current Price Card */}
            <Card className="lg:col-span-2 border-2 border-primary">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Visium Technologies Inc.</div>
                    <div className="text-2xl font-bold text-gray-900">VISM</div>
                    <div className="text-xs text-gray-500">OTCQB</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={stockData.change >= 0 ? "default" : "destructive"} className="text-sm">
                      {stockData.loading ? "Loading..." : "Nov 24, 2025"}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://www.google.com/finance/quote/VISM:OTCMKTS" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs">
                        <ExternalLink className="h-3 w-3" />
                        Google Finance
                      </a>
                    </Button>
                  </div>
                </div>

                {stockData.loading ? (
                  <div className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-baseline gap-4 mb-2">
                      <div className="text-6xl font-bold text-gray-900">
                        ${stockData.price.toFixed(4)}
                      </div>
                      <div className={`text-2xl font-semibold ${stockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(4)}
                        ({stockData.changePercent >= 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      As of Nov 24, 2025, 9:30 AM EST
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Volume</div>
                          <div className="font-semibold text-gray-900">{stockData.volume.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Market Cap</div>
                          <div className="font-semibold text-gray-900">${(stockData.marketCap / 1000000).toFixed(1)}M</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="space-y-4">
              {financialHighlights.map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">{item.label}</div>
                        <div className="text-lg font-bold text-gray-900">{item.value}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Historical Price Chart */}
          <div className="mt-8">
            <StockChart />
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            For live stock quotes and real-time updates, visit <a href="https://www.google.com/finance/quote/VISM:OTCMKTS" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Google Finance</a> or <a href="https://www.otcmarkets.com/stock/VISM/quote" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">OTC Markets</a>
          </div>
        </div>
      </section>

      {/* SEC Filings */}
      <section className="py-12 bg-gray-50">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">SEC Filings</h2>
          <div className="space-y-4">
            {secFilings.map((filing, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        {filing.type}
                      </Badge>
                      <div>
                        <div className="font-semibold text-gray-900">{filing.description}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4" />
                          {filing.date}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <a 
              href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=VISM" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
            >
              View All SEC Filings <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Investor Resources */}
      <section className="py-12 bg-white">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Investor Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {investorResources.map((resource, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <resource.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
                      <p className="text-gray-600">{resource.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact IR */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Investor Contact</h2>
          <p className="text-lg text-gray-700 mb-8">
            For investor inquiries, please contact our Investor Relations team
          </p>
          <Card className="bg-white">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <div className="font-semibold text-gray-900 mb-2">Email</div>
                  <a href="mailto:ir@visiumtechnologies.com" className="text-primary hover:underline">
                    ir@visiumtechnologies.com
                  </a>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-2">Phone</div>
                  <a href="tel:+1-703-273-0383" className="text-primary hover:underline">
                    +1 (703) 273-0383
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
