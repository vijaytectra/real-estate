import { MapPin } from "lucide-react";
import type { Property } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Link } from "react-router-dom";

interface MapPlaceholderProps {
  properties: Property[];
}

export function MapPlaceholder({ properties }: MapPlaceholderProps) {
  return (
    <div className="relative h-[500px] md:h-[600px] rounded-xl overflow-hidden border bg-muted">
      {/* Background map placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Map label */}
        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm border">
          <p className="text-xs font-medium text-muted-foreground">Map View (Mock)</p>
        </div>

        {/* Property pins */}
        {properties.slice(0, 8).map((property, index) => {
          const positions = [
            { top: "15%", left: "20%" },
            { top: "30%", left: "60%" },
            { top: "50%", left: "35%" },
            { top: "20%", left: "75%" },
            { top: "65%", left: "55%" },
            { top: "40%", left: "15%" },
            { top: "70%", left: "80%" },
            { top: "45%", left: "50%" },
          ];
          const pos = positions[index % positions.length];

          return (
            <Link
              key={property.id}
              to={`/property/${property.id}`}
              className="absolute group z-10 transform -translate-x-1/2 -translate-y-full"
              style={{ top: pos.top, left: pos.left }}
            >
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">
                  {property.name} - {formatPrice(property.price)}
                </div>
                <div className="relative">
                  <MapPin
                    className={`h-8 w-8 ${
                      property.isPremium ? "text-accent" : "text-primary"
                    } drop-shadow-lg group-hover:scale-125 transition-transform`}
                    fill="currentColor"
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
