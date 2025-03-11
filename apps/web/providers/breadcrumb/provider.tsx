"use client";

import React, { createContext, useState, useContext } from "react";

interface BreadcrumbItem {
  title: string;
  url: string;
}

interface BreadcrumbContextType {
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (items: BreadcrumbItem[]) => void;
}

// Création du contexte
const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

// Provider
export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

// Hook pour utiliser le contexte
export function useBreadcrumbContext() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumbContext must be used within a BreadcrumbProvider");
  }
  return context;
}
