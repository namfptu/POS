"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { PlusCircle, Search, Edit, Trash, FileDown, FileText, ArrowUp, ArrowDown } from "lucide-react";
import { getVariantAttributes, VariantAttribute, VariantAttributeListResponse, createVariantAttribute, updateVariantAttribute, deleteVariantAttribute, CreateVariantAttributePayload, UpdateVariantAttributePayload } from "@/lib/api/variant-attributes";
import { VariantAttributeForm } from "@/components/variant-attribute-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function VariantAttributesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "active" | "inactive">("All");
  const [variantAttributes, setVariantAttributes] = useState<VariantAttribute[]>([]);
  const [pagination, setPagination] = useState<Omit<VariantAttributeListResponse, 'variantAttributes'>>({
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
  const [selectedVariantAttribute, setSelectedVariantAttribute] = useState<VariantAttribute | null>(null);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | undefined>(undefined);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [variantAttributeToDeleteId, setVariantAttributeToDeleteId] = useState<number | null>(null);

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

  const fetchVariantAttributes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedStatus = filterStatus === "All" ? undefined : filterStatus;

      const data = await getVariantAttributes({
        page: currentPage - 1,
        size: pageSize,
        search: searchQuery || undefined,
        status: fetchedStatus,
        sortBy: sortBy,
        sortDir: sortDir,
      });
      setVariantAttributes(data.variantAttributes);
      setPagination({
        pageNo: data.pageNo,
        pageSize: data.pageSize,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        first: data.first,
        last: data.last,
      });
    } catch (err) {
      console.error("Failed to fetch variant attributes:", err);
      setError("Failed to load variant attributes. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, filterStatus, sortBy, sortDir]);

  const handleCreateVariantAttribute = useCallback(async (variantAttributeData: CreateVariantAttributePayload) => {
    setIsSubmitting(true);
    try {
      await createVariantAttribute(variantAttributeData);
      alert("Variant Attribute added successfully!");
      setShowAddForm(false);
      fetchVariantAttributes();
    } catch (error: any) {
      console.error("Error creating variant attribute:", error);
      alert(`Failed to add variant attribute: ${error.response?.data?.message || error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchVariantAttributes]);

  useEffect(() => {
    fetchVariantAttributes();
  }, [fetchVariantAttributes]);

  const handleEditVariantAttribute = useCallback((variantAttribute: VariantAttribute) => {
    setSelectedVariantAttribute(variantAttribute);
    setShowEditForm(true);
  }, []);

  const handleUpdateVariantAttribute = useCallback(async (variantAttributeData: UpdateVariantAttributePayload, id?: number) => {
    if (!id) {
      alert("Variant Attribute ID is missing for update.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateVariantAttribute(id, variantAttributeData);
      alert("Variant Attribute updated successfully!");
      setShowEditForm(false);
      fetchVariantAttributes();
    } catch (error: any) {
      console.error("Error updating variant attribute:", error);
      alert(`Failed to update variant attribute: ${error.response?.data?.message || error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchVariantAttributes]);

  const handleDeleteConfirm = useCallback((id: number) => {
    setVariantAttributeToDeleteId(id);
    setShowDeleteConfirm(true);
  }, []);

  const handleDeleteVariantAttribute = useCallback(async () => {
    if (variantAttributeToDeleteId === null) return;

    setIsSubmitting(true);
    try {
      await deleteVariantAttribute(variantAttributeToDeleteId);
      alert("Variant Attribute deleted successfully!");
      fetchVariantAttributes();
    } catch (error: any) {
      console.error("Error deleting variant attribute:", error);
      alert(`Failed to delete variant attribute: ${error.response?.data?.message || error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
      setVariantAttributeToDeleteId(null);
    }
  }, [variantAttributeToDeleteId, fetchVariantAttributes]);

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
        <h2 className="text-lg font-semibold">Variant Attributes</h2>
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
            Add Variant Attribute
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md mr-4">
          <Input
            type="text"
            placeholder="Search variant attributes..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[180px] ml-auto">
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
              <TableHead onClick={() => handleSort("name")}>Variant {sortBy === "name" && (sortDir === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
              <TableHead>Values</TableHead>
              <TableHead onClick={() => handleSort("createdAt")}>Created Date {sortBy === "createdAt" && (sortDir === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
              <TableHead onClick={() => handleSort("status")}>Status {sortBy === "status" && (sortDir === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading variant attributes...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : variantAttributes && variantAttributes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No variant attributes found.
                </TableCell>
              </TableRow>
            ) : (
              (variantAttributes || []).map((variantAttribute) => (
                <TableRow key={variantAttribute.id}>
                  <TableCell><input type="checkbox" className="h-4 w-4" /></TableCell>
                  <TableCell className="font-medium">{variantAttribute.name}</TableCell>
                  <TableCell>{variantAttribute.values.join(', ')}</TableCell>
                  <TableCell>{new Date(variantAttribute.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantAttribute.status === "active" ? "bg-[#3EB780] text-[#FFFFFF]" : "bg-red-100 text-red-800"}`}>
                      {variantAttribute.status === "active" ? "• Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditVariantAttribute(variantAttribute)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteConfirm(variantAttribute.id)}><Trash className="h-4 w-4" /></Button>
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

      <VariantAttributeForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleCreateVariantAttribute}
        isLoading={isSubmitting}
      />

      <VariantAttributeForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        variantAttribute={selectedVariantAttribute || undefined}
        onSubmit={handleUpdateVariantAttribute}
        isLoading={isSubmitting}
      />

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the variant attribute
              and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteVariantAttribute} disabled={isSubmitting} className="bg-red-500 hover:bg-red-600 text-white">
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
