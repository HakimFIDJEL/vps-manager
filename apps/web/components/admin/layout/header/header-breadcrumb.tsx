"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

interface BreadcrumbProps {
  items: { title: string; url: string }[];
}

// Breadcrumb Setter
export function BreadcrumbSetter({ items }: BreadcrumbProps) {
  useBreadcrumb(items);
  return null;
}

// Breadcrumb Component
export function HeaderBreadcrumb({ items }: BreadcrumbProps) {
  return (
    <Breadcrumb className="hidden sm:block">
      <BreadcrumbList>
        {items?.map((item, index) =>
          index === items.length - 1 ? (
            <BreadcrumbItem key={index}>
              <BreadcrumbPage>{item.title}</BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <div key={index} className="flex items-center gap-2.5">
              <BreadcrumbItem>
                <BreadcrumbLink href={item.url}>{item.title}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </div>
          )
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
