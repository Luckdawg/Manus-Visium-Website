import { useEffect } from 'react';

interface StructuredDataProps {
  type: 'organization' | 'product' | 'article' | 'breadcrumb';
  data: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    
    let structuredData: any = {};
    
    switch (type) {
      case 'organization':
        structuredData = {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Visium Technologies, Inc.",
          "alternateName": "Visium Analytics",
          "url": "https://www.visiumtechnologies.com",
          "logo": "https://www.visiumtechnologies.com/logo.svg",
          "description": "Leading agentic AI-powered cybersecurity analytics platform for real-time cyber threat detection and security operations",
          "foundingDate": "2013",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "US"
          },
          "sameAs": [
            "https://www.linkedin.com/company/visium-technologies",
            "https://www.otcmarkets.com/stock/VISM/overview"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Sales",
            "email": "info@visiumtechnologies.com"
          }
        };
        break;
        
      case 'product':
        structuredData = {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "TruContext",
          "applicationCategory": "SecurityApplication",
          "description": "Agentic AI-powered cybersecurity analytics platform with graph-based threat detection, MITRE ATT&CK mapping, and real-time security operations analytics",
          "operatingSystem": "Cloud-based",
          "offers": {
            "@type": "Offer",
            "price": "Contact for pricing",
            "priceCurrency": "USD"
          },
          "provider": {
            "@type": "Organization",
            "name": "Visium Technologies, Inc."
          },
          "featureList": [
            "Real-time cyber threat detection",
            "Graph-based security analytics",
            "MITRE ATT&CK threat mapping",
            "AI-driven threat hunting",
            "Security operations analytics",
            "Big data security analytics",
            "Machine learning threat detection"
          ]
        };
        break;
        
      case 'article':
        structuredData = {
          "@context": "https://schema.org",
          "@type": "Article",
          ...data
        };
        break;
        
      case 'breadcrumb':
        structuredData = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data
        };
        break;
    }
    
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, [type, data]);
  
  return null;
}

// Helper function to generate breadcrumb data
export function generateBreadcrumbs(path: string) {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.visiumtechnologies.com/"
    }
  ];
  
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    breadcrumbs.push({
      "@type": "ListItem",
      "position": index + 2,
      "name": segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      "item": `https://www.visiumtechnologies.com${currentPath}`
    });
  });
  
  return breadcrumbs;
}
