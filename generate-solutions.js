// Script to generate remaining solution pages
const fs = require('fs');
const path = require('path');

const solutions = [
  {
    filename: 'CriticalInfrastructure',
    title: 'Critical Infrastructure Protection',
    subtitle: 'Protect power grids, SCADA, and water systems from cyber and physical threats',
    challenge: 'Critical infrastructure faces sophisticated threats from both cyber attackers and physical intruders. IT/OT convergence creates new attack surfaces, and traditional security tools lack visibility across both domains. Compliance requirements like NERC CIP and TSA directives add complexity.',
    solutionIntro: 'TruContext provides converged IT/OT security monitoring and visualization, industrial control system (ICS) protection, and detection of insider threats by correlating physical access data with cyber activity logs.',
    icon: 'Zap',
    capabilities: [
      { title: 'Converged IT/OT Monitoring', desc: 'Unified visibility across information technology and operational technology systems with real-time threat correlation', icon: 'Network' },
      { title: 'ICS/SCADA Protection', desc: 'Specialized monitoring for industrial control systems and SCADA networks with anomaly detection', icon: 'Shield' },
      { title: 'Physical-Cyber Correlation', desc: 'Correlate physical access logs with cyber activity to detect insider threats and coordinated attacks', icon: 'Eye' },
      { title: 'Compliance Monitoring', desc: 'Automated compliance reporting for NERC CIP, TSA directives, and other regulatory requirements', icon: 'CheckCircle2' }
    ],
    applications: [
      { title: 'Power Grid Security', desc: 'Protect electrical generation and distribution systems' },
      { title: 'Water & Utilities', desc: 'Secure water treatment and distribution infrastructure' },
      { title: 'Oil & Gas', desc: 'Pipeline monitoring and refinery security' },
      { title: 'Transportation', desc: 'Rail, airport, and port facility protection' }
    ]
  },
  {
    filename: 'Healthcare',
    title: 'Healthcare Analytics',
    subtitle: 'Optimize patient safety, operational efficiency, and regulatory compliance',
    challenge: 'Healthcare organizations struggle with patient flow optimization, medication errors, and maintaining HIPAA compliance while managing complex facility security. Siloed systems prevent holistic views of operations and security.',
    solutionIntro: 'TruContext enables real-time patient flow optimization, medication error prevention through pattern analysis, HIPAA compliance monitoring, and facility security powered by Tru-InSight™.',
    icon: 'Heart',
    capabilities: [
      { title: 'Patient Flow Optimization', desc: 'Real-time tracking and predictive analytics to reduce wait times and improve bed utilization', icon: 'Activity' },
      { title: 'Medication Error Prevention', desc: 'Pattern analysis to identify potential medication errors before they reach patients', icon: 'AlertTriangle' },
      { title: 'HIPAA Compliance', desc: 'Continuous monitoring of data access and automated compliance reporting', icon: 'Lock' },
      { title: 'Facility Security', desc: 'Video intelligence for patient safety, visitor management, and restricted area access control', icon: 'Video' }
    ],
    applications: [
      { title: 'Emergency Department', desc: 'Optimize patient triage and reduce wait times' },
      { title: 'Pharmacy Security', desc: 'Controlled substance monitoring and theft prevention' },
      { title: 'Staff Safety', desc: 'Workplace violence detection and prevention' },
      { title: 'Asset Tracking', desc: 'Real-time location of medical equipment and supplies' }
    ]
  },
  {
    filename: 'FinancialServices',
    title: 'Financial Services & Fraud Detection',
    subtitle: 'Detect sophisticated fraud rings and ensure regulatory compliance',
    challenge: 'Financial institutions face increasingly sophisticated fraud schemes, account takeovers, and insider threats. Traditional rule-based systems generate excessive false positives while missing complex fraud patterns. AML and KYC compliance requirements demand comprehensive monitoring.',
    solutionIntro: 'TruContext provides transaction relationship mapping, behavioral analysis to identify account takeover and insider threats, real-time anomaly detection for unusual payment patterns, and regulatory compliance monitoring for AML and KYC.',
    icon: 'DollarSign',
    capabilities: [
      { title: 'Transaction Relationship Mapping', desc: 'Visualize complex transaction networks to identify fraud rings and money laundering schemes', icon: 'Network' },
      { title: 'Behavioral Analysis', desc: 'Detect account takeover attempts and insider threats through anomalous behavior patterns', icon: 'TrendingUp' },
      { title: 'Real-Time Anomaly Detection', desc: 'Identify unusual payment patterns, velocity checks, and suspicious transaction sequences', icon: 'AlertTriangle' },
      { title: 'AML/KYC Compliance', desc: 'Automated monitoring and reporting for anti-money laundering and know-your-customer requirements', icon: 'CheckCircle2' }
    ],
    applications: [
      { title: 'Fraud Ring Detection', desc: 'Identify organized fraud networks across accounts' },
      { title: 'Account Takeover', desc: 'Detect unauthorized access and credential theft' },
      { title: 'Insider Threat', desc: 'Monitor employee access to sensitive data' },
      { title: 'Transaction Monitoring', desc: 'Real-time analysis of payment patterns' }
    ]
  },
  {
    filename: 'SupplyChain',
    title: 'Supply Chain & Logistics',
    subtitle: 'End-to-end visibility and predictive intelligence for supply chain operations',
    challenge: 'Supply chains are increasingly complex with limited visibility across partners, carriers, and facilities. Bottlenecks go undetected, theft and shrinkage impact margins, and reactive maintenance causes costly downtime.',
    solutionIntro: 'TruContext guarantees end-to-end supply chain visibility, bottleneck identification, predictive maintenance for transportation and warehouse equipment, and video intelligence for theft and shrinkage detection.',
    icon: 'Package',
    capabilities: [
      { title: 'End-to-End Visibility', desc: 'Track shipments, inventory, and assets across the entire supply chain with real-time updates', icon: 'Eye' },
      { title: 'Bottleneck Identification', desc: 'Automatically detect and predict supply chain bottlenecks before they impact operations', icon: 'AlertTriangle' },
      { title: 'Predictive Maintenance', desc: 'AI-powered maintenance scheduling for trucks, forklifts, and warehouse equipment', icon: 'Wrench' },
      { title: 'Theft & Shrinkage Detection', desc: 'Video intelligence and pattern analysis to identify theft and reduce inventory shrinkage', icon: 'Video' }
    ],
    applications: [
      { title: 'Warehouse Operations', desc: 'Optimize picking, packing, and shipping workflows' },
      { title: 'Fleet Management', desc: 'Vehicle tracking and driver behavior monitoring' },
      { title: 'Vendor Risk', desc: 'Assess and monitor supplier reliability' },
      { title: 'Inventory Optimization', desc: 'Demand forecasting and stock level optimization' }
    ]
  },
  {
    filename: 'Telecommunications',
    title: 'Telecommunications Network Operations',
    subtitle: 'Network topology visualization and predictive failure analysis',
    challenge: 'Telecommunications operators manage massive, complex networks with thousands of interdependencies. Network outages cascade unpredictably, DDoS attacks are difficult to detect early, and infrastructure optimization requires understanding complex relationships.',
    solutionIntro: 'TruContext provides network topology visualization, dependency mapping, predictive failure analysis, DDoS attack detection and mitigation, and infrastructure optimization.',
    icon: 'Radio',
    capabilities: [
      { title: 'Network Topology Visualization', desc: 'Interactive visualization of network infrastructure with real-time status and dependency mapping', icon: 'Network' },
      { title: 'Predictive Failure Analysis', desc: 'AI-powered prediction of equipment failures and network outages before they occur', icon: 'TrendingUp' },
      { title: 'DDoS Detection & Mitigation', desc: 'Real-time detection of distributed denial-of-service attacks with automated response', icon: 'Shield' },
      { title: 'Infrastructure Optimization', desc: 'Identify underutilized resources and optimize network capacity planning', icon: 'Zap' }
    ],
    applications: [
      { title: 'Network Operations Center', desc: 'Unified NOC dashboard with real-time alerts' },
      { title: 'Capacity Planning', desc: 'Predictive analytics for infrastructure investment' },
      { title: 'Service Assurance', desc: 'SLA monitoring and customer impact analysis' },
      { title: 'Security Operations', desc: 'Integrated network security monitoring' }
    ]
  },
  {
    filename: 'Manufacturing',
    title: 'Manufacturing & Industrial Operations',
    subtitle: 'Predictive maintenance and quality control for optimized production',
    challenge: 'Manufacturers face unplanned downtime, quality control issues, and safety incidents that impact productivity and profitability. Traditional monitoring systems are reactive, and siloed data prevents holistic optimization.',
    solutionIntro: 'TruContext enables predictive maintenance to reduce unplanned downtime, quality control via anomaly detection in production data, and safety monitoring supported by video intelligence and IoT sensors.',
    icon: 'Factory',
    capabilities: [
      { title: 'Predictive Maintenance', desc: 'AI-powered prediction of equipment failures to schedule maintenance and prevent unplanned downtime', icon: 'Wrench' },
      { title: 'Quality Control', desc: 'Anomaly detection in production data to identify quality issues before defects reach customers', icon: 'CheckCircle2' },
      { title: 'Safety Monitoring', desc: 'Video intelligence and IoT sensors to detect safety violations and prevent workplace accidents', icon: 'AlertTriangle' },
      { title: 'Production Optimization', desc: 'Analyze production data to identify bottlenecks and optimize throughput', icon: 'TrendingUp' }
    ],
    applications: [
      { title: 'Equipment Health', desc: 'Monitor machine performance and predict failures' },
      { title: 'Production Line', desc: 'Real-time quality monitoring and defect detection' },
      { title: 'Worker Safety', desc: 'PPE compliance and hazard detection' },
      { title: 'Energy Management', desc: 'Optimize energy consumption and reduce costs' }
    ]
  }
];

console.log('Solution pages to generate:', solutions.length);
console.log('Run this with Node.js to generate the files');
