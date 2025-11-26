import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import ChatWidget from "./components/ChatWidget";
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
import Blog from "./pages/Blog";

function Router() {
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
      <Route path={"/blog"} component={Blog} />
      <Route path={"/resources"} component={Blog} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <ChatWidget />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
