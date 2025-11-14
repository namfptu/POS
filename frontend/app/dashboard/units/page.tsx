"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { PlusCircle, Search, Eye, Edit, Trash, FileDown, FileText, ArrowUp, ArrowDown } from "lucide-react";
import { getUnits, Unit, UnitListResponse, createUnit, updateUnit, deleteUnit, CreateUnitPayload, UpdateUnitPayload } from "@/lib/api/units";
import { UnitForm } from "@/components/unit-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function UnitsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "active" | "inactive">("All");
  const [units, setUnits] = useState<Unit[]>([]);
  const [pagination, setPagination] = useState<Omit<UnitListResponse, 'units'>>({
    pageNo: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined); 
  const [sortDir, setSortDir] = useState<"asc" | "desc" | undefined>(undefined); 
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [unitToDeleteId, setUnitToDeleteId] = useState<number | null>(null);

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterStatusChange = (status: "All" | "active" | "inactive") => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const fetchUnits = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedStatus = filterStatus === "All" ? undefined : filterStatus;

      const data = await getUnits({
        page: currentPage - 1,
        size: pageSize,
        search: searchQuery || undefined,
        status: fetchedStatus,
        sortBy: sortBy,
        sortDir: sortDir,
      });
      setUnits(data.units);
      setPagination({
        pageNo: data.pageNo,
        pageSize: data.pageSize,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        first: data.first,
        last: data.last,
      });
    } catch (err) {
      console.error("Failed to fetch units:", err);
      setError("Failed to load units. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, filterStatus, sortBy, sortDir]);

  const handleCreateUnit = useCallback(async (unitData: CreateUnitPayload) => {
    setIsSubmitting(true);
    try {
      const response = await createUnit(unitData);
      alert("Unit added successfully!");
      setShowAddForm(false);
      fetchUnits();
    } catch (error: any) {
      console.error("Error creating unit:", error);
      alert(`Failed to add unit: ${error.response?.data?.message || error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchUnits]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  const handleEditUnit = useCallback((unit: Unit) => {
    setSelectedUnit(unit);
    setShowEditForm(true);
  }, []);

  const handleUpdateUnit = useCallback(async (unitData: UpdateUnitPayload, id?: number) => {
    if (!id) {
      alert("Unit ID is missing for update.");
      return;
    }

    const payload: UpdateUnitPayload = {
      name: unitData.name,
      shortName: unitData.shortName,
      status: unitData.status,
    };

    setIsSubmitting(true);
    try {
      const response = await updateUnit(id, payload);
      alert("Unit updated successfully!");
      setShowEditForm(false);
      fetchUnits();
    } catch (error: any) {
      console.error("Error updating unit:", error);
      alert(`Failed to update unit: ${error.response?.data?.message || error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchUnits]);

  const handleDeleteConfirm = useCallback((id: number) => {
    setUnitToDeleteId(id);
    setShowDeleteConfirm(true);
  }, []);

  const handleDeleteUnit = useCallback(async () => {
    if (unitToDeleteId === null) return;

    setIsSubmitting(true);
    try {
      const response = await deleteUnit(unitToDeleteId);
      alert(response.message || "Unit deleted successfully!");
      fetchUnits();
    } catch (error: any) {
      console.error("Error deleting unit:", error);
      alert(`Failed to delete unit: ${error.response?.data?.message || error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
      setUnitToDeleteId(null);
    }
  }, [unitToDeleteId, fetchUnits]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Units</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-[#EE2C2C]">
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" size="sm" className="bg-[#00AE72] hover:bg-[#00AE72]/90">
            <FileDown className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button size="sm" className="bg-[#FF9025] hover:bg-[#FF9025]/90" onClick={() => setShowAddForm(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Unit
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md mr-4">
          <Input
            type="text"
            placeholder="Search units..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[180px]">
              Status: {filterStatus}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleFilterStatusChange("All")}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterStatusChange("active")}>Active</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterStatusChange("inactive")}>Inactive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F2F2F2]">
              <TableHead className="w-[50px]"><input type="checkbox" className="h-4 w-4" /></TableHead>
              <TableHead onClick={() => handleSort("name")}>Unit {sortBy === "name" && (sortDir === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
              <TableHead>Short Name</TableHead>
              <TableHead onClick={() => handleSort("noOfProducts")}>No of Products {sortBy === "noOfProducts" && (sortDir === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
              <TableHead onClick={() => handleSort("createdDate")}>Created Date {sortBy === "createdDate" && (sortDir === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
              <TableHead onClick={() => handleSort("status")}>Status {sortBy === "status" && (sortDir === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading units...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : units && units.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No units found.
                </TableCell>
              </TableRow>
            ) : (
              (units || []).map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell><input type="checkbox" className="h-4 w-4" /></TableCell>
                  <TableCell className="font-medium">{unit.name}</TableCell>
                  <TableCell>{unit.shortName}</TableCell>
                  <TableCell>{unit.noOfProducts}</TableCell>
                  <TableCell>{new Date(unit.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${unit.status === "active" ? "bg-[#3EB780] text-[#FFFFFF]" : "bg-[#EE0000] text-[#FFFFFF]"}`}>
                      {unit.status === "active" ? "• Active" : "• Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditUnit(unit)} disabled={unit.status === "inactive"}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteConfirm(unit.id)} disabled={unit.status === "inactive"}><Trash className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Row Per Page{' '}
          <select value={pageSize} onChange={handlePageSizeChange} className="rounded-md border p-1">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>{' '}
          Entries
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  if (pagination && !pagination.first) handlePageChange(currentPage - 1);
                }}
                className={pagination && pagination.first ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: pagination?.totalPages || 0 }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink onClick={() => handlePageChange(i + 1)} isActive={currentPage === i + 1}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  if (pagination && !pagination.last) handlePageChange(currentPage + 1);
                }}
                className={pagination && pagination.last ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <UnitForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleCreateUnit}
        isLoading={isSubmitting}
      />

      <UnitForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        unit={selectedUnit || undefined}
        onSubmit={handleUpdateUnit}
        isLoading={isSubmitting}
      />

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the unit
              and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUnit} disabled={isSubmitting} className="bg-red-500 hover:bg-red-600 text-white">
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
