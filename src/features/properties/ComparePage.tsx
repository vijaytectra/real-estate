import { Link } from "react-router-dom";
import { ArrowLeft, X, Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { removeFromCompare, clearCompare } from "@/store/compareSlice";
import { mockProperties } from "@/data/mockProperties";
import { mockReviews } from "@/data/mockReviews";
import { formatPrice } from "@/lib/utils";

const possessionLabels: Record<string, string> = {
  ready: "Ready to Move",
  "6months": "In 6 Months",
  "1year": "In 1 Year",
  "2years": "In 2 Years",
};

export default function ComparePage() {
  const dispatch = useAppDispatch();
  const { compareIds } = useAppSelector((s) => s.compare);
  const properties = mockProperties.filter((p) => compareIds.includes(p.id));

  if (properties.length < 2) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="font-display text-2xl font-bold">Compare Properties</h2>
        <p className="text-muted-foreground mt-2">Please select at least 2 properties to compare</p>
        <Button asChild className="mt-4"><Link to="/">Browse Properties</Link></Button>
      </div>
    );
  }

  const allAmenities = [...new Set(properties.flatMap((p) => p.amenities))].sort();
  const prices = properties.map((p) => p.price);
  const minPrice = Math.min(...prices);

  const getAvgRating = (propertyId: string) => {
    const reviews = mockReviews.filter((r) => r.propertyId === propertyId);
    return reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to listings
          </Link>
          <h1 className="font-display text-3xl font-bold">Compare Properties</h1>
        </div>
        <Button variant="ghost" onClick={() => dispatch(clearCompare())}>
          Clear All
        </Button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Property Headers */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `180px repeat(${properties.length}, 1fr)` }}>
            <div />
            {properties.map((prop) => (
              <Card key={prop.id} className="p-4 relative">
                <button
                  onClick={() => dispatch(removeFromCompare(prop.id))}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                  aria-label={`Remove ${prop.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
                <img src={prop.images[0]} alt={prop.name} className="w-full h-32 object-cover rounded-lg mb-3" loading="lazy" />
                <h3 className="font-semibold text-sm flex items-center gap-1">
                  {prop.name}
                  {prop.isPremium && <Crown className="h-3.5 w-3.5 text-accent" />}
                </h3>
                <p className="text-xs text-muted-foreground">{prop.location.city}</p>
                <Button asChild size="sm" className="w-full mt-3">
                  <Link to={`/property/${prop.id}`}>View Details</Link>
                </Button>
              </Card>
            ))}
          </div>

          {/* Comparison Rows */}
          {[
            {
              label: "Price",
              render: (p: typeof properties[0]) => (
                <span className={`font-bold ${p.price === minPrice ? "text-success" : ""}`}>
                  {formatPrice(p.price)}
                  {p.price === minPrice && <Badge variant="success" className="ml-2 text-[10px]">Best</Badge>}
                </span>
              ),
            },
            { label: "Configuration", render: (p: typeof properties[0]) => <Badge>{p.config}</Badge> },
            { label: "Area", render: (p: typeof properties[0]) => `${p.area} sq.ft` },
            { label: "Bedrooms", render: (p: typeof properties[0]) => `${p.bedrooms}` },
            { label: "Bathrooms", render: (p: typeof properties[0]) => `${p.bathrooms}` },
            { label: "Possession", render: (p: typeof properties[0]) => possessionLabels[p.possessionPeriod] },
            {
              label: "Rating",
              render: (p: typeof properties[0]) => {
                const r = getAvgRating(p.id);
                return r > 0 ? <StarRating rating={r} size="sm" showValue /> : <span className="text-muted-foreground text-sm">No reviews</span>;
              },
            },
            {
              label: "Premium",
              render: (p: typeof properties[0]) =>
                p.isPremium ? <Badge variant="gold">Yes</Badge> : <span className="text-muted-foreground text-sm">No</span>,
            },
          ].map((row) => (
            <div
              key={row.label}
              className="grid gap-4 border-b py-3 items-center"
              style={{ gridTemplateColumns: `180px repeat(${properties.length}, 1fr)` }}
            >
              <span className="text-sm font-medium text-muted-foreground">{row.label}</span>
              {properties.map((prop) => (
                <div key={prop.id} className="text-sm">
                  {row.render(prop)}
                </div>
              ))}
            </div>
          ))}

          {/* Amenities Comparison */}
          <div className="mt-4">
            <h3 className="font-semibold text-sm mb-3">Amenities</h3>
            {allAmenities.map((amenity) => (
              <div
                key={amenity}
                className="grid gap-4 border-b py-2 items-center"
                style={{ gridTemplateColumns: `180px repeat(${properties.length}, 1fr)` }}
              >
                <span className="text-xs text-muted-foreground">{amenity}</span>
                {properties.map((prop) => (
                  <div key={prop.id}>
                    {prop.amenities.includes(amenity) ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground/30" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
