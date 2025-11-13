"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { PlusCircle, Search, Eye, Edit, Trash, FileDown, FileText } from "lucide-react";
import { getStores, Store, StoreListResponse, createStore, updateStore, deleteStore, CreateStorePayload, UpdateStorePayload } from "@/lib/api";
import { StoreForm } from "@/components/store-form";
import { StoreDetailModal } from "@/components/store-detail-modal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function StoresPage() {
  // const { user } = useAuth(); // Removed: No longer need user context for Stores page
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "active" | "inactive">("All"); // Removed "deleted" status for Stores
  const [stores, setStores] = useState<Store[]>([]);
  const [pagination, setPagination] = useState<Omit<StoreListResponse, 'stores'>>({
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
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  // Removed sortBy and sortDir states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [storeToDeleteId, setStoreToDeleteId] = useState<number | null>(null);

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search query changes
  };

  const handleFilterStatusChange = (status: "All" | "active" | "inactive") => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to first page when filter status changes
  };

  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedStatus = filterStatus === "All" ? undefined : filterStatus.toUpperCase() as "ACTIVE" | "INACTIVE"; // Removed "DELETED" status for Stores

      const data = await getStores({
        page: currentPage - 1,
        size: pageSize,
        search: searchQuery || undefined,
        status: fetchedStatus,
        // Removed sortBy and sortDir
      });
      setStores(data.stores);
      setPagination({
        pageNo: data.pageNo,
        pageSize: data.pageSize,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        first: data.first,
        last: data.last,
      });
    } catch (err) {
      console.error("Failed to fetch stores:", err);
      setError("Failed to load stores. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, filterStatus]); // Removed sortBy and sortDir from dependencies

  const handleCreateStore = useCallback(async (storeData: CreateStorePayload) => { // Updated payload for Store
    // Removed user authentication check as userId is not directly managed here

    setIsSubmitting(true);
    try {
      const payload = {
        ...storeData,
      }
      const response = await createStore(payload);
      alert("Store added successfully!");
      setShowAddForm(false);
      fetchStores();
    } catch (error: any) {
      console.error("Error creating store:", error);
      alert(`Failed to add store: ${error.response?.data?.message || error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchStores]); // Removed user?.id from dependencies

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleViewStore = useCallback((store: Store) => {
    setSelectedStore(store);
    setShowDetailModal(true);
  }, []);

  const handleEditStore = useCallback((store: Store) => {
    setSelectedStore(store);
    setShowEditForm(true);
  }, []);

  const handleUpdateStore = useCallback(async (storeData: UpdateStorePayload, id?: number) => { // Updated payload for Store, id is number
    if (!id) {
      alert("Store ID is missing for update.");
      return;
    }

    const payload: UpdateStorePayload = {
      name: storeData.name,
      userName: storeData.userName,
      email: storeData.email,
      phone: storeData.phone,
      address: storeData.address,
      city: storeData.city,
      country: storeData.country,
      warehouseId: storeData.warehouseId,
      userId: storeData.userId,
      status: storeData.status,
    };

    setIsSubmitting(true);
    try {
      const response = await updateStore(id, payload);
      alert("Store updated successfully!");
      setShowEditForm(false);
      fetchStores();
    } catch (error: any) {
      console.error("Error updating store:", error);
      alert(`Failed to update store: ${error.response?.data?.message || error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchStores]); // Removed user?.id from dependencies

  const handleDeleteConfirm = useCallback((id: number) => {
    setStoreToDeleteId(id);
    setShowDeleteConfirm(true);
  }, []);

  const handleDeleteStore = useCallback(async () => {
    if (storeToDeleteId === null) return;

    setIsSubmitting(true);
    try {
      const response = await deleteStore(storeToDeleteId);
      alert(response.message || "Store deleted successfully!");
      fetchStores();
    } catch (error: any) {
      console.error("Error deleting store:", error);
      alert(`Failed to delete store: ${error.response?.data?.message || error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
      setStoreToDeleteId(null);
    }
  }, [storeToDeleteId, fetchStores]);

  // Removed handleSort function

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Stores</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-[#EE2C2C]">
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" size="sm" className="bg-[#00AE72] hover:bg-[#00AE72]/90">
            <FileDown className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button size="sm" className="bg-[#FF9025] hover:bg-[#FF9025]/90" onClick={() => setShowAddForm(true)}> {/* Open add store form */}
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Store
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md mr-4">
          <Input
            type="text"
            placeholder="Search stores..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[180px]">
              Filter by Status
              <span className="ml-2">{filterStatus === "All" ? "All" : filterStatus === "active" ? "Active" : "Inactive"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilterStatus("All")}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("active")}>Active</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("inactive")}>Inactive</DropdownMenuItem>
            {/* Removed "deleted" status for Stores */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F2F2F2]">
              <TableHead className="w-[50px]"><input type="checkbox" className="h-4 w-4" /></TableHead>
              <TableHead>Store</TableHead> {/* Renamed from Warehouse */}
              <TableHead>User Name</TableHead> {/* New column */}
              <TableHead>Email</TableHead> {/* New column */}
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8"> {/* Adjusted colSpan to 7 */}
                  Loading stores...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : stores && stores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8"> {/* Adjusted colSpan to 7 */}
                  No stores found.
                </TableCell>
              </TableRow>
            ) : (
              (stores || []).map((store) => (
                <TableRow key={store.id}>
                  <TableCell><input type="checkbox" className="h-4 w-4" /></TableCell>
                  <TableCell className="font-medium">{store.name}</TableCell>
                  <TableCell>{store.userName}</TableCell> {/* Display User Name */}
                  <TableCell>{store.email}</TableCell> {/* Display Email */}
                  <TableCell>{store.phone}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${store.status === "active" ? "bg-[#3EB780] text-[#FFFFFF]" : "bg-[#EE0000] text-[#FFFFFF]"}`}>
                      {store.status === "active" ? "• Active" : "• Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleViewStore(store)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEditStore(store)} disabled={store.status === "inactive"}><Edit className="h-4 w-4" /></Button> {/* Disable edit if inactive */}
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteConfirm(store.id)} disabled={store.status === "inactive"}><Trash className="h-4 w-4" /></Button> {/* Disable delete if inactive */}
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

      <StoreForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleCreateStore}
        isLoading={isSubmitting}
        // Removed currentUserId
      />

      <StoreDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        store={selectedStore}
      />

      <StoreForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        store={selectedStore || undefined}
        onSubmit={handleUpdateStore}
        isLoading={isSubmitting}
        // Removed currentUserId
      />

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the store
              and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStore} disabled={isSubmitting} className="bg-red-500 hover:bg-red-600 text-white">
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
