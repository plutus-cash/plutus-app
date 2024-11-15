"use client";

import { Input } from "@/components/ui/input";
import { useCallback, useState } from "react";

export function SearchInput() {
  const [query, setQuery] = useState("");

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  return <Input placeholder="Search assets..." className="max-w-sm" value={query} onChange={handleSearch} />;
}
