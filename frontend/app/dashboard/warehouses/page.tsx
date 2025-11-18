"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { PlusCircle, Search, Eye, Edit, Trash, FileDown, FileText, ArrowUp, ArrowDown } from "lucide-react";
import { getWarehouses, Warehouse, WarehouseListResponse, createWarehouse, updateWarehouse, deleteWarehouse, UpdateWarehousePayload } from "@/lib/api/warehouses";
import { WarehouseForm } from "@/components/warehouse-form";
import { WarehouseDetailModal } from "@/components/warehouse-detail-modal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/auth-context"; // Import useAuth

export default function WarehousesPage() {
  const { user } = useAuth(); // Get current user from AuthContext
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "active" | "inactive">("All"); 
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [pagination, setPagination] = useState<Omit<WarehouseListResponse, 'warehouses'>>({
    pageNo: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [warehouseToDeleteId, setWarehouseToDeleteId] = useState<number | null>(null); // Changed to number | null
  const [sortBy, setSortBy] = useState<string | undefined>(undefined); // Added sortBy state
  const [sortDir, setSortDir] = useState<"asc" | "desc" | undefined>(undefined); // Added sortDir state

  const fetchWarehouses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedStatus = filterStatus === "All" ? undefined : filterStatus.toUpperCase() as "ACTIVE" | "INACTIVE" | "DELETED"; // Converted to uppercase for API

      const data = await getWarehouses({
        page: currentPage - 1,
        size: pageSize,
        search: searchQuery || undefined,
        status: fetchedStatus,
        sortBy: sortBy, // Pass sortBy
        sortDir: sortDir, // Pass sortDir
      });
      setWarehouses(data.warehouses);
      setPagination({
        pageNo: data.pageNo,
        pageSize: data.pageSize,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        first: data.first,
        last: data.last,
      });
    } catch (err) {
      console.error("Failed to fetch warehouses:", err);
      setError("Failed to load warehouses. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, filterStatus, sortBy, sortDir]); // Added sortBy and sortDir to dependencies

  const handleCreateWarehouse = useCallback(async (warehouseData: Omit<Warehouse, 'id' | 'code' | 'totalProducts' | 'stock' | 'qty' | 'createdOn' | 'managingUserName'> & { name: string; contactPerson?: string | null; phone?: string | null; userId: number; status: "active" | "inactive" | "deleted"; imageUrl?: string | null; }) => {
    if (!user?.id) {
      alert("User not authenticated. Please log in.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...warehouseData,
        // userId: Number(user.id), // Removed: No longer overwrite userId with current user's ID
      }
      const response = await createWarehouse(payload);
      alert("Warehouse added successfully!");
      setShowAddForm(false);
      fetchWarehouses();
    } catch (error: any) {
      console.error("Error creating warehouse:", error);
      alert(`Failed to add warehouse: ${error.response?.data?.message || error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchWarehouses, user?.id]); // Added user?.id to dependencies

  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleViewWarehouse = useCallback((warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setShowDetailModal(true);
  }, []);

  const handleEditWarehouse = useCallback((warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setShowEditForm(true);
  }, []);

  const handleUpdateWarehouse = useCallback(async (warehouseData: Omit<Warehouse, 'id' | 'code' | 'totalProducts' | 'stock' | 'qty' | 'createdOn' | 'managingUserName'> & { name: string; contactPerson?: string | null; phone?: string | null; userId?: number; status?: "active" | "inactive" | "deleted"; imageUrl?: string | null; }, id?: number) => { // id is number
    if (!id) {
      alert("Warehouse ID is missing for update.");
      return;
    }

    const payload: UpdateWarehousePayload = {
      name: warehouseData.name,
      contactPerson: warehouseData.contactPerson,
      phone: warehouseData.phone,
      userId: warehouseData.userId ? Number(warehouseData.userId) : undefined,
      status: warehouseData.status,
      imageUrl: warehouseData.imageUrl,
    };

    setIsSubmitting(true);
    try {
      const response = await updateWarehouse(id, payload);
      alert("Warehouse updated successfully!");
      setShowEditForm(false);
      fetchWarehouses();
    } catch (error: any) {
      console.error("Error updating warehouse:", error);
      alert(`Failed to update warehouse: ${error.response?.data?.message || error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchWarehouses]); // Removed selectedWarehouse from dependency

  const handleDeleteConfirm = useCallback((id: number) => { // id is number
    setWarehouseToDeleteId(id);
    setShowDeleteConfirm(true);
  }, []);

  const handleDeleteWarehouse = useCallback(async () => {
    if (warehouseToDeleteId === null) return;

    setIsSubmitting(true);
    try {
      const response = await deleteWarehouse(warehouseToDeleteId);
      alert(response.message || "Warehouse deleted successfully!");
      fetchWarehouses();
    } catch (error: any) {
      console.error("Error deleting warehouse:", error);
      alert(`Failed to delete warehouse: ${error.response?.data?.message || error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
      setWarehouseToDeleteId(null);
    }
  }, [warehouseToDeleteId, fetchWarehouses]);

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
        <h2 className="text-lg font-semibold">Warehouses</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-[#EE2C2C]">
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" size="sm" className="bg-[#00AE72] hover:bg-[#00AE72]/90">
            <FileDown className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button size="sm" className="bg-[#FF9025] hover:bg-[#FF9025]/90" onClick={() => setShowAddForm(true)}> {/* Open add warehouse form */}
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Warehouse
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
              <TableHead onClick={() => handleSort("name")}>Warehouse {sortBy === "name" && (sortDir === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
              <TableHead>Contact Person</TableHead> {/* Added back as a separate column */}
              <TableHead>Phone</TableHead>
              <TableHead onClick={() => handleSort("totalProducts")}>Total Products {sortBy === "totalProducts" && (sortDir === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
              <TableHead onClick={() => handleSort("stock")}>Stock {sortBy === "stock" && (sortDir === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
              <TableHead onClick={() => handleSort("qty")}>Qty {sortBy === "qty" && (sortDir === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
              <TableHead onClick={() => handleSort("createdOn")}>Created On {sortBy === "createdOn" && (sortDir === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead> {/* Re-added Actions column */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8"> {/* Adjusted colSpan to 10 */}
                  Loading warehouses...
                </TableCell>                                      
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-red-500"> {/* Adjusted colSpan to 10 */}
                  {error}
                </TableCell>
              </TableRow>
            ) : warehouses && warehouses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8"> {/* Adjusted colSpan to 10 */}
                  No warehouses found.
                </TableCell>
              </TableRow>
            ) : (
              (warehouses || []).map((warehouse) => (
                <TableRow key={warehouse.id}>
                  <TableCell><input type="checkbox" className="h-4 w-4" /></TableCell>
                  <TableCell className="font-medium">{warehouse.name}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <img src={warehouse.imageUrl || "/placeholder-user.jpg"} alt={warehouse.contactPerson || "Contact Person"} className="h-8 w-8 rounded-full object-cover" />
                    <span>{warehouse.contactPerson}</span>
                  </TableCell>
                  <TableCell>{warehouse.phone}</TableCell>
                  <TableCell>{warehouse.totalProducts}</TableCell>
                  <TableCell>{warehouse.stock}</TableCell>
                  <TableCell>{warehouse.qty}</TableCell>
                  <TableCell>{new Date(warehouse.createdOn).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${warehouse.status === "active" ? "bg-[#3EB780] text-[#FFFFFF]" : warehouse.status === "inactive" ? "bg-[#EE0000] text-[#FFFFFF]" : "bg-gray-500 text-white"}`}>
                      {warehouse.status === "active" ? "• Active" : warehouse.status === "inactive" ? "• Inactive" : "• Deleted"}
                    </span>
                  </TableCell>
                  <TableCell className="flex justify-end gap-2"> {/* Re-added Actions buttons */}
                    <Button variant="ghost" size="icon" onClick={() => handleViewWarehouse(warehouse)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEditWarehouse(warehouse)} disabled={warehouse.status === "deleted"}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteConfirm(warehouse.id)} disabled={warehouse.status === "deleted" || warehouse.stock > 0}><Trash className="h-4 w-4" /></Button> {/* Disable delete if stock > 0 */}
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

      <WarehouseForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleCreateWarehouse}
        isLoading={isSubmitting}
        currentUserId={user?.id ? Number(user.id) : 0} // Convert to number
      />

      <WarehouseDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        warehouse={selectedWarehouse}
      />

      <WarehouseForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        warehouse={selectedWarehouse || undefined}
        onSubmit={handleUpdateWarehouse}
        isLoading={isSubmitting}
        currentUserId={user?.id ? Number(user.id) : 0} // Convert to number
      />

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the warehouse
              and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteWarehouse} disabled={isSubmitting} className="bg-red-500 hover:bg-red-600 text-white">
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
