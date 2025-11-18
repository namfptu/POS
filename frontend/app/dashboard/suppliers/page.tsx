"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { PlusCircle, Search, Eye, Edit, Trash, FileDown, FileText } from "lucide-react";
import { getSuppliers, Supplier, SupplierListResponse, createSupplier, updateSupplier, deleteSupplier, UpdateSupplierPayload } from "@/lib/api/suppliers";
import { SupplierForm } from "@/components/supplier-form";
import { SupplierDetailModal } from "@/components/supplier-detail-modal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "active" | "inactive">("All"); // Match backend status
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [pagination, setPagination] = useState<Omit<SupplierListResponse, 'suppliers'>>({
    pageNo: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    first: true, // Added first property to initial state
    last: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false); // State to control add supplier form visibility
  const [isSubmitting, setIsSubmitting] = useState(false); // State for form submission loading
  const [showDetailModal, setShowDetailModal] = useState(false); // State to control detail modal visibility
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null); // State for selected supplier details
  const [showEditForm, setShowEditForm] = useState(false); // State to control edit supplier form visibility
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State to control delete confirmation dialog
  const [supplierToDeleteId, setSupplierToDeleteId] = useState<string | null>(null); // State for supplier ID to delete

  const fetchSuppliers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedStatus = filterStatus === "All" ? undefined : filterStatus; // Reverted to lowercase as per backend

      const data = await getSuppliers({
        page: currentPage - 1, 
        size: pageSize,
        search: searchQuery || undefined,
        status: fetchedStatus,
      });
      setSuppliers(data.suppliers);
      setPagination({
        pageNo: data.pageNo,
        pageSize: data.pageSize,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        first: data.first, // Set first from API response
        last: data.last,
      });
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
      setError("Failed to load suppliers. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, filterStatus]);

  const handleCreateSupplier = useCallback(async (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'code' | 'email' | 'companyName' | 'role'> & { email?: string; imageUrl?: string | null; }) => {
    setIsSubmitting(true);
    try {
      // Pass supplierData directly to createSupplier after ensuring it has the required fields
      await createSupplier(supplierData as Omit<Supplier, 'id' | 'createdAt'>); // Cast to expected type
      alert("Supplier added successfully!");
      setShowAddForm(false); // Close the form
      fetchSuppliers(); // Reload supplier list
    } catch (error) {
      console.error("Error creating supplier:", error);
      alert("Failed to add supplier. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchSuppliers]); // Add fetchSuppliers to dependencies

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to first page on size change
  };

  const handleViewSupplier = useCallback((supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowDetailModal(true);
  }, []);

  const handleEditSupplier = useCallback((supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowEditForm(true);
  }, []);

  const handleUpdateSupplier = useCallback(async (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'code' | 'email' | 'companyName' | 'role'> & { email?: string; imageUrl?: string | null; }, id?: string) => {
    if (!id) {
      alert("Supplier ID is missing for update.");
      return;
    }

    // Create a payload that matches UpdateSupplierPayload interface, excluding companyName and role
    const payload: UpdateSupplierPayload = {
      name: supplierData.name,
      phone: supplierData.phone,
      country: supplierData.country,
      status: supplierData.status,
      imageUrl: supplierData.imageUrl
    };

    setIsSubmitting(true);
    try {
      await updateSupplier(id, payload);
      alert("Supplier updated successfully!");
      setShowEditForm(false); // Close the form
      fetchSuppliers();
    } catch (error) {
      console.error("Error updating supplier:", error);
      alert("Failed to update supplier. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchSuppliers]);

  const handleDeleteConfirm = useCallback((id: string) => {
    setSupplierToDeleteId(id);
    setShowDeleteConfirm(true);
  }, []);

  const handleDeleteSupplier = useCallback(async () => {
    if (!supplierToDeleteId) return;

    setIsSubmitting(true);
    try {
      const response = await deleteSupplier(supplierToDeleteId);
      alert(response.message || "Supplier deleted successfully!");
      fetchSuppliers();
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert("Failed to delete supplier. Please try again.");
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false); // Close the dialog
      setSupplierToDeleteId(null);
    }
  }, [supplierToDeleteId, fetchSuppliers]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Suppliers</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-[#EE2C2C]">
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" size="sm" className="bg-[#00AE72] hover:bg-[#00AE72]/90">
            <FileDown className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button size="sm" className="bg-[#FF9025] hover:bg-[#FF9025]/90" onClick={() => setShowAddForm(true)}> {/* Open add supplier form */}
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Status: {filterStatus}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilterStatus("All")}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("active")}>Active</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("inactive")}>Inactive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F2F2F2]">
              <TableHead className="w-[50px]"><input type="checkbox" className="h-4 w-4" /></TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Loading suppliers...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : suppliers && suppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No suppliers found.
                </TableCell>
              </TableRow>
            ) : (
              (suppliers || []).map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell><input type="checkbox" className="h-4 w-4" /></TableCell>
                  <TableCell className="font-medium">{supplier.code}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <img src={supplier.imageUrl || "/placeholder-user.jpg"} alt={supplier.name} className="h-8 w-8 rounded-full object-cover" />
                    <span>{supplier.name}</span>
                  </TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>{supplier.country}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${supplier.status === "active" ? "bg-[#3EB780] text-[#FFFFFF]" : "bg-[#EE0000] text-[#FFFFFF]"}`}>
                      {supplier.status === "active" ? "• Active" : "• Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleViewSupplier(supplier)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEditSupplier(supplier)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteConfirm(supplier.id)}><Trash className="h-4 w-4" /></Button>
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

      <SupplierForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleCreateSupplier}
        isLoading={isSubmitting}
      />

      <SupplierDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        supplier={selectedSupplier}
      />

      <SupplierForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        supplier={selectedSupplier || undefined} // Pass selected supplier for editing
        onSubmit={handleUpdateSupplier}
        isLoading={isSubmitting}
      />

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the supplier
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSupplier} disabled={isSubmitting} className="bg-red-500 hover:bg-red-600 text-white">
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
