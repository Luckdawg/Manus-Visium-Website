import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, LucideIcon } from "lucide-react";

export interface Feature {
  icon?: ReactNode | LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
}

interface FeatureGridProps {
  title?: string;
  description?: string;
  features: Feature[];
  columns?: 2 | 3 | 4;
}

/**
 * Reusable feature grid component
 * Displays features in a responsive grid layout
 */
export function FeatureGrid({
  title,
  description,
  features,
  columns = 3
}: FeatureGridProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <section className="py-12 bg-white">
      <div className="container">
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-4xl font-bold text-gray-900 mb-6">{title}</h2>
            )}
            {description && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}
        <div className={`grid ${gridCols[columns]} gap-6`}>
          {features.map((feature, index) => {
            const IconComponent = feature.icon as LucideIcon;
            const iconColor = feature.iconColor || (index % 2 === 0 ? "text-primary" : "text-secondary");
            
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  {feature.icon && (
                    typeof feature.icon === 'function' ? (
                      <IconComponent className={`h-10 w-10 ${iconColor} mb-4`} />
                    ) : (
                      <div className="mb-4">{feature.icon}</div>
                    )
                  )}
                  {!feature.icon && (
                    <CheckCircle2 className={`h-10 w-10 ${iconColor} mb-4`} />
                  )}
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
