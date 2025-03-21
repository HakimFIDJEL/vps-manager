"use client";

import type React from "react";

import { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@workspace/ui/components/table";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  ArrowDownNarrowWide,
  ArrowUpDown,
  ArrowUpNarrowWide,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCcw,
} from "lucide-react";

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  enableHiding?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  actions?: (row: T) => React.ReactNode;
  searchColumn?: string;
  rowSelection?: {
    enable: boolean;
    component: (rows: T[]) => React.ReactNode;
  };
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions,
  searchColumn,
  rowSelection,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>({});
  const [pageSize, setPageSize] = useState(() => Math.min(10, data.length));
  const enableRowSelection = rowSelection?.enable ?? false;

  // Get searchable column
  const searchableColumns = useMemo(
    () => columns.filter((c) => c.searchable),
    [columns]
  );

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm || searchableColumns.length === 0) return data;

    return data.filter((item) =>
      searchableColumns.some((col) => {
        const value = item[col.key];
        if (value == null) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, searchableColumns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue == null) return sortConfig.direction === "asc" ? -1 : 1;
      if (bValue == null) return sortConfig.direction === "asc" ? 1 : -1;

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;

      return 0;
    });
  }, [filteredData, sortConfig]);

  const selectedRowData = sortedData.filter((_, index) => selectedRows[index]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Total pages
  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle sort
  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => {
      if (!prevConfig || prevConfig.key !== key) {
        return { key, direction: "asc" };
      }

      if (prevConfig.direction === "asc") {
        return { key, direction: "desc" };
      }

      return null;
    });
  };

  // Handle pagination
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Toggle row selection
  const toggleRowSelection = (rowIndex: number, value: boolean) => {
    setSelectedRows((prev) => ({
      ...prev,
      [rowIndex]: value,
    }));
  };

  // Toggle all rows selection
  const toggleAllRowsSelection = (value: boolean) => {
    if (value) {
      const newSelected: Record<number, boolean> = {};
      paginatedData.forEach((_, index) => {
        newSelected[index] = true;
      });
      setSelectedRows(newSelected);
    } else {
      setSelectedRows({});
    }
  };

  // Check if all rows are selected
  const isAllRowsSelected =
    paginatedData.length > 0 &&
    paginatedData.every((_, index) => selectedRows[index]);

  // Check if some rows are selected
  const isSomeRowsSelected =
    Object.keys(selectedRows).length > 0 && !isAllRowsSelected;

  // Count selected rows
  const selectedRowsCount = Object.values(selectedRows).filter(Boolean).length;

  return (
    <div className="w-full">
      <div className="flex md:flex-row flex-col gap-2 items-center py-4 justify-end">
        <div className="flex flex-col md:flex-row items-center gap-2 md:w-auto w-full">
          {searchableColumns.length > 0 && (
            <Input
              placeholder={`Filter by ${searchableColumns.map((c) => c.label.toLowerCase()).join(", ")}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:w-auto w-full"
            />
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="text-sm font-normal shadow-sm md:w-auto w-full"
                size={"sm"}
              >
                Rows per page: {pageSize}{" "}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="min-w-max">
              {[5, 10, 25, 50, 100, 500]
                .filter((n) => n <= data.length)
                .map((size) => (
                  <DropdownMenuCheckboxItem
                    key={size}
                    checked={pageSize === size}
                    onCheckedChange={() => {
                      setCurrentPage(1);
                      setPageSize(size);
                    }}
                    className="px-8 justify-center"
                  >
                    {size}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {rowSelection && (
          <div className="flex gap-2 items-center ml-auto md:w-auto w-full">
            {rowSelection.component(selectedRowData)}
            <Button
              size={"sm"}
              variant={"secondary"}
              onClick={() => {
                window.location.reload();
                setRefreshing(true);
              }}
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader2 className="animate-spin" />
              ) : (
                <RefreshCcw />
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              {enableRowSelection && (
                <TableHead className="w-[50px] flex aspect-square items-center justify-center">
                  <Checkbox
                    checked={
                      isAllRowsSelected ||
                      (isSomeRowsSelected && "indeterminate")
                    }
                    onCheckedChange={(value) => toggleAllRowsSelection(!!value)}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={column.key}>
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(column.key)}
                      className="h-8 px-2 py-1 -ml-3 font-medium"
                    >
                      {column.label}
                      {sortConfig?.key === column.key ? (
                        sortConfig.direction === "asc" ? (
                          <ArrowUpNarrowWide className="ml-2 h-4 w-4" />
                        ) : (
                          <ArrowDownNarrowWide className="ml-2 h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </Button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
              {actions && (
                <TableHead className="text-center">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (actions ? 1 : 0) +
                    (enableRowSelection ? 1 : 0)
                  }
                  className="h-24"
                >
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  data-state={selectedRows[rowIndex] && "selected"}
                >
                  {enableRowSelection && (
                    <TableCell className="w-[50px] flex aspect-square items-center justify-center">
                      <Checkbox
                        checked={!!selectedRows[rowIndex]}
                        onCheckedChange={(value) =>
                          toggleRowSelection(rowIndex, !!value)
                        }
                        aria-label="Select row"
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={`${rowIndex}-${column.key}`}>
                      {column.render
                        ? column.render(row[column.key], row)
                        : (row[column.key] ?? "—")}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="text-center">
                      {actions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        {rowSelection && (
          <div className="flex-0 mr-auto text-sm text-muted-foreground">
            {selectedRowsCount} of {sortedData.length} row(s) selected.
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
