"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import SearchFilters from "@/components/search/SearchFilters";

interface SearchFiltersWrapperProps {
  initialQuery: string;
  initialLocation: string;
  initialCategory: string;
}

export default function SearchFiltersWrapper({ initialQuery, initialLocation, initialCategory }: SearchFiltersWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState(initialCategory);

  // Sync with URL when it changes (e.g. browser back button)
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
    setLocation(searchParams.get("location") || "");
    setCategory(searchParams.get("category") || "");
  }, [searchParams]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (filters: { query?: string; location?: string; category?: string }) => {
    if (filters.query !== undefined) {
      setQuery(filters.query);
      // Debounce this in a real app
      router.push(pathname + "?" + createQueryString("q", filters.query));
    }
    if (filters.location !== undefined) {
      setLocation(filters.location);
      router.push(pathname + "?" + createQueryString("location", filters.location));
    }
    if (filters.category !== undefined) {
      setCategory(filters.category);
      router.push(pathname + "?" + createQueryString("category", filters.category));
    }
  };

  return (
    <SearchFilters 
      query={query} 
      location={location} 
      category={category} 
      onFilterChange={handleFilterChange} 
    />
  );
}
