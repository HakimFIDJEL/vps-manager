"use client";

import { useEffect } from "react";
import { useBreadcrumbContext } from "@/components/providers/breadcrumb/provider";

interface BreadcrumbItem {
  title: string;
  url: string;
}

export function useBreadcrumb(items: BreadcrumbItem[]) {
  const { setBreadcrumbs } = useBreadcrumbContext();

  useEffect(() => {
    setBreadcrumbs(items);
  }, [items, setBreadcrumbs]);
}
