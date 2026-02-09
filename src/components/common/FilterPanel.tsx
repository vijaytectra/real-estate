import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { setFilters, resetFilters, fetchProperties } from "@/store/propertySlice";
import { useDebounce } from "@/hooks/useDebounce";
import { cities } from "@/data/mockProperties";
import { useEffect, useState } from "react";

export function FilterPanel() {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((s) => s.properties);
  const [search, setSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(search, 300);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(setFilters({ search: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    dispatch(fetchProperties(filters));
  }, [filters, dispatch]);

  const hasActiveFilters =
    filters.city || filters.config || filters.possessionPeriod || filters.search;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by city, locality, or property name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 text-base"
            aria-label="Search properties"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          size="lg"
          onClick={() => setShowFilters(!showFilters)}
          className="shrink-0 h-12"
          aria-expanded={showFilters}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">Filters</span>
        </Button>
      </div>

      {/* Filter Row */}
      {showFilters && (
        <div className="flex flex-wrap items-end gap-3 rounded-xl bg-secondary/80 dark:bg-secondary/50 p-4 border border-border/50 animate-in slide-in-from-top-2 duration-200">
          {/* City */}
          <div className="w-full sm:w-auto sm:min-w-[160px]">
            <Select
              value={filters.city || "all"}
              onValueChange={(v) => dispatch(setFilters({ city: v === "all" ? "" : v }))}
            >
              <SelectTrigger aria-label="Filter by city">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Config */}
          <div className="w-full sm:w-auto sm:min-w-[160px]">
            <Select
              value={filters.config || "all"}
              onValueChange={(v) =>
                dispatch(setFilters({ config: v === "all" ? "" : (v as typeof filters.config) }))
              }
            >
              <SelectTrigger aria-label="Filter by configuration">
                <SelectValue placeholder="Configuration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Configs</SelectItem>
                <SelectItem value="1BHK">1 BHK</SelectItem>
                <SelectItem value="2BHK">2 BHK</SelectItem>
                <SelectItem value="3BHK">3 BHK</SelectItem>
                <SelectItem value="4BHK">4 BHK</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Budget */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              type="number"
              placeholder="Min Budget"
              className="w-full sm:w-32"
              value={filters.budgetMin || ""}
              onChange={(e) => dispatch(setFilters({ budgetMin: Number(e.target.value) || 0 }))}
              aria-label="Minimum budget"
            />
            <span className="text-muted-foreground text-sm">to</span>
            <Input
              type="number"
              placeholder="Max Budget"
              className="w-full sm:w-32"
              value={filters.budgetMax === 200000000 ? "" : filters.budgetMax}
              onChange={(e) =>
                dispatch(setFilters({ budgetMax: Number(e.target.value) || 200000000 }))
              }
              aria-label="Maximum budget"
            />
          </div>

          {/* Possession */}
          <div className="w-full sm:w-auto sm:min-w-[160px]">
            <Select
              value={filters.possessionPeriod || "all"}
              onValueChange={(v) =>
                dispatch(
                  setFilters({
                    possessionPeriod: v === "all" ? "" : (v as typeof filters.possessionPeriod),
                  })
                )
              }
            >
              <SelectTrigger aria-label="Filter by possession period">
                <SelectValue placeholder="Possession" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Periods</SelectItem>
                <SelectItem value="ready">Ready to Move</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
                <SelectItem value="2years">2 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                dispatch(resetFilters());
                setSearch("");
              }}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
