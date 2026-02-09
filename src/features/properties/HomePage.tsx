import { useEffect } from "react";
import { Building2, LayoutGrid, Map, TrendingUp, Shield, Clock } from "lucide-react";
import { PropertyCard } from "@/components/common/PropertyCard";
import { FilterPanel } from "@/components/common/FilterPanel";
import { MapPlaceholder } from "@/components/common/MapPlaceholder";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { setViewMode, fetchProperties } from "@/store/propertySlice";
import type { ViewMode } from "@/types";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "Verified Listings",
    description: "Every property is verified by our expert team",
  },
  {
    icon: TrendingUp,
    title: "Best Prices",
    description: "Competitive pricing with transparent deals",
  },
  {
    icon: Clock,
    title: "Quick Possession",
    description: "Ready-to-move and under-construction options",
  },
];

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { properties, loading, viewMode, filters } = useAppSelector((s) => s.properties);

  const approvedProperties = properties.filter((p) => p.status === "approved");

  useEffect(() => {
    dispatch(fetchProperties(filters));
  }, [dispatch]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/80 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Building2 className="h-8 w-8 text-accent" />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Find Your{" "}
              <span className="text-accent">Dream Property</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Discover premium properties across India. From luxury apartments to spacious
              villas, find the perfect home that matches your lifestyle.
            </p>
          </motion.div>

          {/* Search in Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 sm:mt-12 max-w-4xl mx-auto"
          >
            <div className="bg-background rounded-2xl p-4 sm:p-6 shadow-2xl">
              <FilterPanel />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Listings */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12" aria-label="Property Listings">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Featured Properties
            </h2>
            <p className="text-muted-foreground mt-1">
              {approvedProperties.length} properties found
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1" role="radiogroup" aria-label="View mode">
            {(["grid", "map"] as ViewMode[]).map((mode) => {
              const Icon = mode === "grid" ? LayoutGrid : Map;
              return (
                <Button
                  key={mode}
                  variant={viewMode === mode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => dispatch(setViewMode(mode))}
                  className="gap-1.5"
                  role="radio"
                  aria-checked={viewMode === mode}
                  aria-label={`${mode} view`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline capitalize">{mode}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[16/10] w-full rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : viewMode === "map" ? (
          <MapPlaceholder properties={approvedProperties} />
        ) : (
          <>
            {approvedProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Building2 className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-semibold">No properties found</h3>
                <p className="text-muted-foreground mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {approvedProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
