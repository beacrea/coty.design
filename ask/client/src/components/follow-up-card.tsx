import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export interface FollowUpOption {
  label: string;
  query: string;
}

interface FollowUpCardProps {
  title?: string;
  options: FollowUpOption[];
  onSelect: (query: string) => void;
}

export function FollowUpCard({ title, options, onSelect }: FollowUpCardProps) {
  if (options.length === 0) return null;
  
  return (
    <Card className="mt-3 p-3 bg-muted/50 border-muted" data-testid="card-follow-up">
      <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
        <Sparkles className="w-3.5 h-3.5" />
        <span>{title || "Explore further"}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="rounded-full text-xs"
            onClick={() => onSelect(option.query)}
            data-testid={`button-followup-${index}`}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </Card>
  );
}
