import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { trackPageView } from "@/lib/analytics";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import ChatWidget from "./components/ChatWidget";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Platform from "./pages/Platform";
import AICapabilities from "./pages/AICapabilities";
import TruInsight from "./pages/TruInsight";
import Cybersecurity from "./pages/solutions/Cybersecurity";
import SmartCities from "./pages/solutions/SmartCities";
import CriticalInfrastructure from "./pages/solutions/CriticalInfrastructure";
import Healthcare from "./pages/solutions/Healthcare";
import FinancialServices from "./pages/solutions/FinancialServices";
import SupplyChain from "./pages/solutions/SupplyChain";
import Telecommunications from "./pages/solutions/Telecommunications";
import Manufacturing from "./pages/solutions/Manufacturing";
import Demo from "./pages/Demo";
import About from "./pages/company/About";
import Leadership from "./pages/company/Leadership";
import News from "./pages/company/News";
import InvestorRelations from "./pages/company/InvestorRelations";
import AdminLeadsDashboard from "./pages/AdminLeadsDashboard";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import Careers from "./pages/company/Careers";
import GraphDemo from "./pages/GraphDemo";
import Contact from "./pages/company/Contact";
import Partners from "./pages/Partners";
import Pricing from "./pages/Pricing";
import ROICalculator from "./pages/ROICalculator";
import PlatformAdvantages from "./pages/why/PlatformAdvantages";
import EnergyGrid from "./pages/case-studies/EnergyGrid";
import IntelligentTransportation from "./pages/case-studies/IntelligentTransportation";
import PublicSafety from "./pages/case-studies/PublicSafety";
import Architecture from "./pages/Architecture";
import Comparison from "./pages/why/Comparison";
import ComparisonSIEM from "./pages/why/ComparisonSIEM";
import HealthcareCybersecurity from "./pages/solutions/HealthcareCybersecurity";
import FinancialServicesCybersecurity from "./pages/solutions/FinancialServicesCybersecurity";
import TelecomCybersecurity from "./pages/solutions/TelecomCybersecurity";
import GovernmentFederal from "./pages/solutions/GovernmentFederal";
import Blog from "./pages/Blog";
import Videos from "./pages/resources/Videos";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminSecurity from "./pages/admin/Security";
import AdminLogin from "./pages/admin/Login";
import PartnerDashboard from "./pages/partner/Dashboard";
import PartnerDeals from "./pages/partner/Deals";
import PartnerResources from "./pages/partner/Resources";
import PartnerMDF from "./pages/partner/MDF";
import PartnerAnalytics from "./pages/partner/Analytics";

function Router() {
  const [location] = useLocation();

  // Track page views on route changes (respects cookie consent)
  useEffect(() => {
    trackPageView();
  }, [location]);

  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/platform"} component={Platform} />
      <Route path={"/platform/ai-capabilities"} component={AICapabilities} />
      <Route path={"/platform/tru-insight"} component={TruInsight} />
      <Route path={"/solutions/cybersecurity"} component={Cybersecurity} />
      <Route path={"/solutions/smart-cities"} component={SmartCities} />
      <Route path={"/solutions/critical-infrastructure"} component={CriticalInfrastructure} />
      <Route path={"/solutions/healthcare"} component={Healthcare} />
      <Route path={"/solutions/financial-services"} component={FinancialServices} />
      <Route path={"/solutions/supply-chain"} component={SupplyChain} />
      <Route path={"/solutions/telecommunications"} component={Telecommunications} />
      <Route path={"/solutions/manufacturing"} component={Manufacturing} />
      <Route path={"/demo"} component={Demo} />
      <Route path={"/company/about"} component={About} />
      <Route path={"/company/leadership"} component={Leadership} />
       <Route path="/company/news" component={News} />
      <Route path="/company/investors" component={InvestorRelations} />
      <Route path="/admin/leads" component={AdminLeadsDashboard} />
      <Route path="/legal/privacy" component={PrivacyPolicy} />
      <Route path="/legal/terms" component={TermsOfService} />
      <Route path="/company/investor-relations" component={InvestorRelations} />
      <Route path="/company/careers" component={Careers} />
      <Route path="/graph-demo" component={GraphDemo} />
      <Route path={"/company/contact"} component={Contact} />
      <Route path={"/partners"} component={Partners} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path="/why/roi" component={ROICalculator} />
      <Route path="/why/advantages" component={PlatformAdvantages} />
      <Route path="/case-studies/energy-grid" component={EnergyGrid} />
      <Route path="/case-studies/intelligent-transportation" component={IntelligentTransportation} />
      <Route path="/case-studies/public-safety" component={PublicSafety} />
      <Route path="/platform/architecture" component={Architecture} />
      <Route path="/why/comparison" component={Comparison} />
      <Route path="/why/comparison-siem" component={ComparisonSIEM} />
      <Route path="/solutions/healthcare-cybersecurity" component={HealthcareCybersecurity} />
      <Route path="/solutions/financial-services-cybersecurity" component={FinancialServicesCybersecurity} />
      <Route path="/solutions/telecom-cybersecurity" component={TelecomCybersecurity} />
      <Route path="/solutions/government-federal" component={GovernmentFederal} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/resources"} component={Blog} />
      <Route path={"/resources/videos"} component={Videos} />
      <Route path={"/admin/login"} component={AdminLogin} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/users"} component={AdminUsers} />
      <Route path={"/admin/security"} component={AdminSecurity} />
      <Route path={"/partners/dashboard"} component={PartnerDashboard} />
      <Route path={"/partners/deals"} component={PartnerDeals} />
      <Route path={"/partners/resources"} component={PartnerResources} />
      <Route path={"/partners/mdf"} component={PartnerMDF} />
      <Route path={"/partners/analytics"} component={PartnerAnalytics} />
      <Route path={"/404"} component={NotFound} />  {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <ScrollToTop />
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <ChatWidget />
          <CookieConsent />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
