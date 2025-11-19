import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useTour } from "./Tour";

interface TourButtonProps {
  tourId: string;
  label?: string;
}

export default function TourButton({ tourId, label = "Start Tour" }: TourButtonProps) {
  const { restartTour } = useTour(tourId);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={restartTour}
      className="fixed bottom-6 right-6 z-50 shadow-lg"
    >
      <HelpCircle className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
}
