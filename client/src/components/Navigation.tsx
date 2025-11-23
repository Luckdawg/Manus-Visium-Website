import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <img src="/visium_analytics_logo.png" alt="Visium Analytics" className="h-12" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link href="/">
              <Button variant="ghost" className="text-gray-700 hover:text-primary">
                Home
              </Button>
            </Link>

            {/* Platform Dropdown */}
            <div className="relative group">
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-primary"
                onMouseEnter={() => setOpenDropdown("platform")}
              >
                Platform <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
              {openDropdown === "platform" && (
                <div
                  className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2"
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link href="/platform">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Overview</div>
                  </Link>
                  <Link href="/platform/ai-capabilities">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">AI Capabilities</div>
                  </Link>
                  <Link href="/platform/tru-insight">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Tru-InSight™ Video Intelligence</div>
                  </Link>
                  <Link href="/platform/technology">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Technology & Integrations</div>
                  </Link>
                  <Link href="/platform/security">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Security & Compliance</div>
                  </Link>
                  <Link href="/platform/architecture">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Platform Architecture</div>
                  </Link>
                </div>
              )}
            </div>

            {/* Solutions Dropdown */}
            <div className="relative group">
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-primary"
                onMouseEnter={() => setOpenDropdown("solutions")}
              >
                Solutions <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
              {openDropdown === "solutions" && (
                <div
                  className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg py-2"
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link href="/solutions/cybersecurity">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Cybersecurity & Threat Intelligence</div>
                  </Link>
                  <Link href="/solutions/smart-cities">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Smart Cities & Public Safety</div>
                  </Link>
                  <Link href="/solutions/critical-infrastructure">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Critical Infrastructure Protection</div>
                  </Link>
                  <Link href="/solutions/healthcare">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Healthcare Analytics</div>
                  </Link>
                  <Link href="/solutions/financial-services">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Financial Services & Fraud Detection</div>
                  </Link>
                  <Link href="/solutions/supply-chain">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Supply Chain & Logistics</div>
                  </Link>
                  <Link href="/solutions/telecommunications">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Telecommunications Network Operations</div>
                  </Link>
                  <Link href="/solutions/manufacturing">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Manufacturing & Industrial Operations</div>
                  </Link>
                </div>
              )}
            </div>

            {/* Why TruContext Dropdown */}
            <div className="relative group">
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-primary"
                onMouseEnter={() => setOpenDropdown("why")}
              >
                Why TruContext <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
              {openDropdown === "why" && (
                <div
                  className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2"
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link href="/why/advantages">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Platform Advantages</div>
                  </Link>
                  <Link href="/why/success-stories">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Customer Success Stories</div>
                  </Link>
                  <Link href="/why/roi">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">ROI Calculator</div>
                  </Link>
                  <Link href="/why/comparison">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">vs Traditional SIEM</div>
                  </Link>
                  <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase mt-2">Case Studies</div>
                  <Link href="/case-studies/energy-grid">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Energy Grid</div>
                  </Link>
                  <Link href="/case-studies/intelligent-transportation">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Intelligent Transportation</div>
                  </Link>
                  <Link href="/case-studies/public-safety">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Public Safety</div>
                  </Link>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="relative group">
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-primary"
                onMouseEnter={() => setOpenDropdown("resources")}
              >
                Resources <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
              {openDropdown === "resources" && (
                <div
                  className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2"
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link href="/resources/documentation">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Documentation</div>
                  </Link>
                  <Link href="/resources/whitepapers">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Whitepapers & eBooks</div>
                  </Link>
                  <Link href="/resources/videos">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Videos & Webinars</div>
                  </Link>
                  <Link href="/blog">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Blog & Insights</div>
                  </Link>
                  <Link href="/graph-demo">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-t border-gray-100 font-semibold text-primary">🎯 Interactive Graph Demo</div>
                  </Link>
                </div>
              )}
            </div>

            {/* Company Dropdown */}
            <div className="relative group">
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-primary"
                onMouseEnter={() => setOpenDropdown("company")}
              >
                Company <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
              {openDropdown === "company" && (
                <div
                  className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2"
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link href="/company/about">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">About Visium</div>
                  </Link>
                  <Link href="/company/leadership">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Leadership Team</div>
                  </Link>
                  <Link href="/company/careers">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Careers</div>
                  </Link>
                  <Link href="/company/news">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">News & Press</div>
                  </Link>
                  <Link href="/company/investors">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Investor Relations</div>
                  </Link>
                  <Link href="/company/contact">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Contact</div>
                  </Link>
                </div>
              )}
            </div>

            <Link href="/partners">
              <Button variant="ghost" className="text-gray-700 hover:text-primary">
                Partners
              </Button>
            </Link>

            <Link href="/pricing">
              <Button variant="ghost" className="text-gray-700 hover:text-primary">
                Pricing
              </Button>
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link href="/demo">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Schedule a Demo
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <Link href="/">
                <Button variant="ghost" className="w-full justify-start">Home</Button>
              </Link>
              
              <div>
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={() => toggleDropdown("platform-mobile")}
                >
                  Platform <ChevronDown className="h-4 w-4" />
                </Button>
                {openDropdown === "platform-mobile" && (
                  <div className="pl-4 mt-2 space-y-2">
                    <Link href="/platform"><div className="py-2">Overview</div></Link>
                    <Link href="/platform/ai-capabilities"><div className="py-2">AI Capabilities</div></Link>
                    <Link href="/platform/tru-insight"><div className="py-2">Tru-InSight™</div></Link>
                  </div>
                )}
              </div>

              <div>
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={() => toggleDropdown("solutions-mobile")}
                >
                  Solutions <ChevronDown className="h-4 w-4" />
                </Button>
                {openDropdown === "solutions-mobile" && (
                  <div className="pl-4 mt-2 space-y-2">
                    <Link href="/solutions/cybersecurity"><div className="py-2">Cybersecurity</div></Link>
                    <Link href="/solutions/smart-cities"><div className="py-2">Smart Cities</div></Link>
                    <Link href="/solutions/healthcare"><div className="py-2">Healthcare</div></Link>
                  </div>
                )}
              </div>

              <Link href="/demo">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white mt-4">
                  Schedule a Demo
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
