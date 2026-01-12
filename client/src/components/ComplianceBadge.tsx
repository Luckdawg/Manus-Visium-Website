import React from 'react';

interface ComplianceBadgeProps {
  type: 'hipaa' | 'pci-dss' | 'fedramp';
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  className?: string;
}

const badgeConfig = {
  hipaa: {
    image: '/badges/hipaa-badge.png',
    label: 'HIPAA Compliant',
    description: 'Healthcare data protection and patient privacy compliance',
    alt: 'HIPAA Compliance Badge'
  },
  'pci-dss': {
    image: '/badges/pci-dss-badge.png',
    label: 'PCI-DSS Certified',
    description: 'Payment card data security and fraud prevention',
    alt: 'PCI-DSS Compliance Badge'
  },
  fedramp: {
    image: '/badges/fedramp-badge.png',
    label: 'FedRAMP Authorized',
    description: 'Government security standards and federal compliance',
    alt: 'FedRAMP Compliance Badge'
  }
};

const sizeMap = {
  small: 'w-20 h-20',
  medium: 'w-32 h-32',
  large: 'w-40 h-40'
};

export default function ComplianceBadge({
  type,
  size = 'medium',
  showLabel = true,
  className = ''
}: ComplianceBadgeProps) {
  const config = badgeConfig[type];
  const sizeClass = sizeMap[size];

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className={`${sizeClass} flex items-center justify-center`}>
        <img
          src={config.image}
          alt={config.alt}
          className="w-full h-full object-contain drop-shadow-lg"
          title={config.description}
        />
      </div>
      {showLabel && (
        <div className="text-center">
          <p className="font-semibold text-gray-800 text-sm">{config.label}</p>
          <p className="text-xs text-gray-600 max-w-xs">{config.description}</p>
        </div>
      )}
    </div>
  );
}
