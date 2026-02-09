import { Link } from "react-router-dom";
import { Heart, MapPin, BedDouble, Bath, Maximize, GitCompareArrows, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { toggleFavorite } from "@/store/authSlice";
import { addToCompare, removeFromCompare } from "@/store/compareSlice";
import { addNotification } from "@/store/notificationSlice";
import { formatPrice } from "@/lib/utils";
import { mockReviews } from "@/data/mockReviews";
import type { Property } from "@/types";
import { toast } from "sonner";

interface PropertyCardProps {
  property: Property;
}

const configColors: Record<string, string> = {
  "1BHK": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "2BHK": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "3BHK": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "4BHK": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
};

const possessionLabels: Record<string, string> = {
  ready: "Ready to Move",
  "6months": "In 6 Months",
  "1year": "In 1 Year",
  "2years": "In 2 Years",
};

export function PropertyCard({ property }: PropertyCardProps) {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const { compareIds } = useAppSelector((s) => s.compare);

  const isFavorite = user?.favorites.includes(property.id) ?? false;
  const isComparing = compareIds.includes(property.id);

  const reviews = mockReviews.filter((r) => r.propertyId === property.id);
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please log in to save properties");
      return;
    }
    dispatch(toggleFavorite(property.id));
    if (!isFavorite) {
      toast.success("Added to favorites");
      dispatch(addNotification({
        title: "Property Saved",
        message: `${property.name} added to your favorites`,
        type: "property",
      }));
    } else {
      toast("Removed from favorites");
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isComparing) {
      dispatch(removeFromCompare(property.id));
      toast("Removed from comparison");
    } else {
      if (compareIds.length >= 3) {
        toast.error("You can compare up to 3 properties");
        return;
      }
      dispatch(addToCompare(property.id));
      toast.success("Added to comparison");
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.name}
          className="h-full w-full object-conatin transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          width={800}
          height={500}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.isPremium && (
            <Badge variant="gold" className="gap-1">
              <Crown className="h-3 w-3" />
              Premium
            </Badge>
          )}
          <Badge className={configColors[property.config] + " border-0"}>
            {property.config}
          </Badge>
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex gap-1.5">
          <button
            onClick={handleCompare}
            className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all ${
              isComparing
                ? "bg-primary text-white"
                : "bg-white/80 text-gray-700 hover:bg-white"
            }`}
            aria-label={isComparing ? "Remove from compare" : "Add to compare"}
          >
            <GitCompareArrows className="h-4 w-4" />
          </button>
          <button
            onClick={handleFavorite}
            className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all ${
              isFavorite
                ? "bg-red-500 text-white"
                : "bg-white/80 text-gray-700 hover:bg-white"
            }`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-3 left-3">
          <p className="text-xl font-bold text-white drop-shadow-lg">
            {formatPrice(property.price)}
          </p>
        </div>

        {/* Possession */}
        <div className="absolute bottom-3 right-3">
          <Badge variant="secondary" className="text-xs bg-white/90 text-gray-800 border-0">
            {possessionLabels[property.possessionPeriod]}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Title & Rating */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-tight line-clamp-1">
            {property.name}
          </h3>
          {avgRating > 0 && <StarRating rating={avgRating} size="sm" showValue />}
        </div>

        {/* Location */}
        <div className="mt-1.5 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">
            {property.location.locality}, {property.location.city}
          </span>
        </div>

        {/* Specs */}
        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BedDouble className="h-4 w-4" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="h-4 w-4" />
            <span>{property.area} sq.ft</span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-4">
          <Button asChild className="w-full" size="sm">
            <Link to={`/property/${property.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
