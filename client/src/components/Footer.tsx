import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <img src="/visium_analytics_logo.png" alt="Visium Analytics" className="h-10 sm:h-12 mb-4 object-contain" />
            <p className="text-sm mb-4">
              AI-powered intelligence platform for cybersecurity and operational intelligence across multiple industries.
            </p>
            <div className="flex space-x-4">
              {/* Social media icons could go here */}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/platform"><span className="hover:text-white cursor-pointer">Overview</span></Link></li>
              <li><Link href="/platform/ai-capabilities"><span className="hover:text-white cursor-pointer">AI Capabilities</span></Link></li>
              <li><Link href="/platform/tru-insight"><span className="hover:text-white cursor-pointer">Tru-InSight™</span></Link></li>
              <li><Link href="/platform/architecture"><span className="hover:text-white cursor-pointer">Platform Architecture</span></Link></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-white font-semibold mb-4">Solutions</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/solutions/cybersecurity"><span className="hover:text-white cursor-pointer">Cybersecurity</span></Link></li>
              <li><Link href="/solutions/smart-cities"><span className="hover:text-white cursor-pointer">Smart Cities</span></Link></li>
              <li><Link href="/solutions/critical-infrastructure"><span className="hover:text-white cursor-pointer">Critical Infrastructure</span></Link></li>
              <li><Link href="/solutions/healthcare"><span className="hover:text-white cursor-pointer">Healthcare</span></Link></li>
              <li><Link href="/solutions/financial-services"><span className="hover:text-white cursor-pointer">Financial Services</span></Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/company/about"><span className="hover:text-white cursor-pointer">About Us</span></Link></li>
              <li><Link href="/company/leadership"><span className="hover:text-white cursor-pointer">Leadership</span></Link></li>
              <li><Link href="/company/careers"><span className="hover:text-white cursor-pointer">Careers</span></Link></li>
              <li><Link href="/company/news"><span className="hover:text-white cursor-pointer">News</span></Link></li>
              <li><Link href="/company/investors"><span className="hover:text-white cursor-pointer">Investor Relations</span></Link></li>
              <li><Link href="/company/contact"><span className="hover:text-white cursor-pointer">Contact</span></Link></li>
              <li><Link href="/partners"><span className="hover:text-white cursor-pointer">Partners</span></Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} Visium Technologies. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/legal/privacy"><span className="hover:text-white cursor-pointer">Privacy Policy</span></Link>
            <Link href="/legal/terms"><span className="hover:text-white cursor-pointer">Terms of Service</span></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
