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
              <img src="/visium_analytics_logo.png" alt="Visium Analytics" className="h-10 sm:h-12 object-contain" />
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

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
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col space-y-1">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-base py-3">Home</Button>
              </Link>
              
              <div>
                <Button
                  variant="ghost"
                  className="w-full justify-between text-base py-3"
                  onClick={() => toggleDropdown("platform-mobile")}
                >
                  Platform <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === "platform-mobile" ? "rotate-180" : ""}`} />
                </Button>
                {openDropdown === "platform-mobile" && (
                  <div className="pl-4 mt-1 space-y-1 bg-gray-50 rounded-lg py-2">
                    <Link href="/platform" onClick={() => setMobileMenuOpen(false)}><div className="py-2 px-3 hover:bg-white rounded">Overview</div></Link>
                    <Link href="/platform/ai-capabilities" onClick={() => setMobileMenuOpen(false)}><div className="py-2 px-3 hover:bg-white rounded">AI Capabilities</div></Link>
                    <Link href="/platform/tru-insight" onClick={() => setMobileMenuOpen(false)}><div className="py-2 px-3 hover:bg-white rounded">Tru-InSight™</div></Link>
                    <Link href="/platform/architecture" onClick={() => setMobileMenuOpen(false)}><div className="py-2 px-3 hover:bg-white rounded">Architecture</div></Link>
                  </div>
                )}
              </div>

              <div>
                <Button
                  variant="ghost"
                  className="w-full justify-between text-base py-3"
                  onClick={() => toggleDropdown("solutions-mobile")}
                >
                  Solutions <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === "solutions-mobile" ? "rotate-180" : ""}`} />
                </Button>
                {openDropdown === "solutions-mobile" && (
                  <div className="pl-4 mt-1 space-y-1 bg-gray-50 rounded-lg py-2">
                    <Link href="/solutions/cybersecurity" onClick={() => setMobileMenuOpen(false)}><div className="py-2 px-3 hover:bg-white rounded">Cybersecurity</div></Link>
                    <Link href="/solutions/smart-cities" onClick={() => setMobileMenuOpen(false)}><div className="py-2 px-3 hover:bg-white rounded">Smart Cities</div></Link>
                    <Link href="/solutions/critical-infrastructure" onClick={() => setMobileMenuOpen(false)}><div className="py-2 px-3 hover:bg-white rounded">Critical Infrastructure</div></Link>
                    <Link href="/solutions/healthcare" onClick={() => setMobileMenuOpen(false)}><div className="py-2 px-3 hover:bg-white rounded">Healthcare</div></Link>
                    <Link href="/solutions/financial-services" onClick={() => setMobileMenuOpen(false)}><div className="py-2 px-3 hover:bg-white rounded">Financial Services</div></Link>
                  </div>
                )}
              </div>

              <div>
                <Button
                  variant="ghost"
                  className="w-full justify-between text-base py-3"
                  onClick={() => toggleDropdown("why-mobile")}
                >
                  Why TruContext <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === "why-mobile" ? "rotate-180" : ""}`} />
                </Button>
                {openDropdown === "why-mobile" && (
                  <div className="pl-4 mt-1 space-y-1 bg-gray-50 rounded-lg py-2">
                    <Link href="/why/advantages" onClick={() => setMobileMenuOpen(false)}><div className="py-2 px-3 hover:bg-white rounded">Platform Advantages</div></Link>
                    <Link href="/why/roi" onClick={() => setMobileMenuOpen(false)}><div className="py-2 px-3 hover:bg-white rounded">ROI Calculator</div></Link>
                    <Link href="/comparison" onClick={() => setMobileMenuOpen(false)}><div className="py-2 px-3 hover:bg-white rounded">Competitive Comparison</div></Link>
                  </div>
                )}
              </div>

              <div>
                <Button
                  variant="ghost"
                  className="w-full justify-between text-base py-3"
                  onClick={() => toggleDropdown("resources-mobile")}
                >
                  Resources <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === "resources-mobile" ? "rotate-180" : ""}`} />
                </Button>
                {openDropdown === "resources-mobile" && (
                  <div className="pl-4 mt-1 space-y-1 bg-gray-50 rounded-lg py-2">
                    <Link href="/resources/videos" onClick={() => setMobileMenuOpen(false)}><div className="py-2 px-3 hover:bg-white rounded">Videos & Webinars</div></Link>
                    <Link href="/blog" onClick={() => setMobileMenuOpen(false)}><div className="py-2 px-3 hover:bg-white rounded">Blog & Insights</div></Link>
                    <Link href="/graph-demo" onClick={() => setMobileMenuOpen(false)}><div className="py-2 px-3 hover:bg-white rounded">Interactive Demo</div></Link>
                  </div>
                )}
              </div>

              <div>
                <Button
                  variant="ghost"
                  className="w-full justify-between text-base py-3"
                  onClick={() => toggleDropdown("company-mobile")}
                >
                  Company <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === "company-mobile" ? "rotate-180" : ""}`} />
                </Button>
                {openDropdown === "company-mobile" && (
                  <div className="pl-4 mt-1 space-y-1 bg-gray-50 rounded-lg py-2">
                    <Link href="/company/about" onClick={() => setMobileMenuOpen(false)}><div className="py-2 px-3 hover:bg-white rounded">About Visium</div></Link>
                    <Link href="/company/leadership" onClick={() => setMobileMenuOpen(false)}><div className="py-2 px-3 hover:bg-white rounded">Leadership Team</div></Link>
                    <Link href="/company/news" onClick={() => setMobileMenuOpen(false)}><div className="py-2 px-3 hover:bg-white rounded">News & Press</div></Link>
                    <Link href="/company/investors" onClick={() => setMobileMenuOpen(false)}><div className="py-2 px-3 hover:bg-white rounded">Investor Relations</div></Link>
                    <Link href="/company/contact" onClick={() => setMobileMenuOpen(false)}><div className="py-2 px-3 hover:bg-white rounded">Contact</div></Link>
                  </div>
                )}
              </div>

              <Link href="/partners" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-base py-3">Partners</Button>
              </Link>

              <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-base py-3">Pricing</Button>
              </Link>

              <Link href="/demo" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white mt-4 py-3 text-base">
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
