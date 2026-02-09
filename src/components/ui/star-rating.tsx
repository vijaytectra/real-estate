import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRate?: (rating: number) => void;
  showValue?: boolean;
}

const sizeMap = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRate,
  showValue = false,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`Rating: ${rating} out of ${maxRating} stars`}>
      {Array.from({ length: maxRating }, (_, i) => {
        const filled = i < Math.round(rating);
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(i + 1)}
            className={cn(
              "transition-colors",
              interactive && "cursor-pointer hover:scale-110 transform",
              !interactive && "cursor-default"
            )}
            aria-label={`${i + 1} star${i + 1 > 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                sizeMap[size],
                filled ? "fill-accent text-accent" : "fill-none text-muted-foreground/40"
              )}
            />
          </button>
        );
      })}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
