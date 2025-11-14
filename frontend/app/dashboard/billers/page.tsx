"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { PlusCircle, Search, Eye, Edit, Trash, FileDown, FileText } from "lucide-react";
import { getBillers, Biller, BillerListResponse, createBiller, updateBiller, deleteBiller, UpdateBillerPayload } from "@/lib/api/billers";
import { BillerForm } from "@/components/biller-form";
import { BillerDetailModal } from "@/components/biller-detail-modal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function BillersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "active" | "inactive">("All"); // Match backend status
  const [billers, setBillers] = useState<Biller[]>([]);
  const [pagination, setPagination] = useState<Omit<BillerListResponse, 'billers'>>({
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
  const [showAddForm, setShowAddForm] = useState(false); // State to control add biller form visibility
  const [isSubmitting, setIsSubmitting] = useState(false); // State for form submission loading
  const [showDetailModal, setShowDetailModal] = useState(false); // State to control detail modal visibility
  const [selectedBiller, setSelectedBiller] = useState<Biller | null>(null); // State for selected biller details
  const [showEditForm, setShowEditForm] = useState(false); // State to control edit biller form visibility
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State to control delete confirmation dialog
  const [billerToDeleteId, setBillerToDeleteId] = useState<string | null>(null); // State for biller ID to delete

  const fetchBillers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedStatus = filterStatus === "All" ? undefined : filterStatus; // Removed .toUpperCase()

      const data = await getBillers({
        page: currentPage - 1, // Adjust page to be 0-indexed for API
        size: pageSize,
        search: searchQuery || undefined,
        status: fetchedStatus,
      });
      setBillers(data.billers);
      setPagination({
        pageNo: data.pageNo,
        pageSize: data.pageSize,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        first: data.first, // Set first from API response
        last: data.last,
      });
    } catch (err) {
      console.error("Failed to fetch billers:", err);
      setError("Failed to load billers. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, filterStatus]);

  const handleCreateBiller = useCallback(async (billerData: Omit<Biller, 'id' | 'createdAt' | 'code'> & { email: string; companyName: string | null; imageUrl?: string | null; }) => {
    setIsSubmitting(true);
    try {
      await createBiller(billerData);
      alert("Biller added successfully!");
      setShowAddForm(false); // Close the form
      fetchBillers(); 
    } catch (error) {
      console.error("Error creating biller:", error);
      alert("Failed to add biller. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchBillers]); // Add fetchBillers to dependencies

  useEffect(() => {
    fetchBillers();
  }, [fetchBillers]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to first page on size change
  };

  const handleViewBiller = useCallback((biller: Biller) => {
    setSelectedBiller(biller);
    setShowDetailModal(true);
  }, []);

  const handleEditBiller = useCallback((biller: Biller) => {
    setSelectedBiller(biller);
    setShowEditForm(true);
  }, []);

  const handleUpdateBiller = useCallback(async (billerData: Omit<Biller, 'id' | 'createdAt' | 'code'> & { email?: string; companyName?: string | null; imageUrl?: string | null; }, id?: string) => {
    if (!id) {
      alert("Biller ID is missing for update.");
      return;
    }

    // Create a payload that matches UpdateBillerPayload interface, excluding email
    const payload: UpdateBillerPayload = {
      name: billerData.name,
      phone: billerData.phone,
      country: billerData.country,
      companyName: billerData.companyName,
      status: billerData.status,
      imageUrl: billerData.imageUrl
    };

    setIsSubmitting(true);
    try {
      await updateBiller(id, payload);
      alert("Biller updated successfully!");
      setShowEditForm(false); // Close the form
      fetchBillers();
    } catch (error) {
      console.error("Error updating biller:", error);
      alert("Failed to update biller. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchBillers]);

  const handleDeleteConfirm = useCallback((id: string) => {
    setBillerToDeleteId(id);
    setShowDeleteConfirm(true);
  }, []);

  const handleDeleteBiller = useCallback(async () => {
    if (!billerToDeleteId) return;

    setIsSubmitting(true);
    try {
      const response = await deleteBiller(billerToDeleteId);
      alert(response.message || "Biller deleted successfully!");
      fetchBillers();
    } catch (error) {
      console.error("Error deleting biller:", error);
      alert("Failed to delete biller. Please try again.");
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
      setBillerToDeleteId(null);
    }
  }, [billerToDeleteId, fetchBillers]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Billers</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-[#EE2C2C]">
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" size="sm" className="bg-[#00AE72] hover:bg-[#00AE72]/90">
            <FileDown className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button size="sm" className="bg-[#FF9025] hover:bg-[#FF9025]/90" onClick={() => setShowAddForm(true)}> {/* Open add biller form */}
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Biller
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search..."
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
              <TableHead>Code ⇅</TableHead>
              <TableHead>Biller</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  Loading billers...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : billers && billers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  No billers found.
                </TableCell>
              </TableRow>
            ) : (
              (billers || []).map((biller) => (
                <TableRow key={biller.id}>
                  <TableCell><input type="checkbox" className="h-4 w-4" /></TableCell>
                  <TableCell className="font-medium">{biller.code}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <img src={biller.imageUrl || "/placeholder-user.jpg"} alt={biller.name} className="h-8 w-8 rounded-full object-cover" />
                    <span>{biller.name}</span>
                  </TableCell>
                  <TableCell>{biller.companyName}</TableCell>
                  <TableCell>{biller.email}</TableCell>
                  <TableCell>{biller.phone}</TableCell>
                  <TableCell>{biller.country}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${biller.status === "active" ? "bg-[#3EB780] text-[#FFFFFF]" : "bg-red-100 text-red-800"}`}>
                      {biller.status === "active" ? "• Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleViewBiller(biller)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEditBiller(biller)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteConfirm(biller.id)}><Trash className="h-4 w-4" /></Button>
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

      <BillerForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleCreateBiller}
        isLoading={isSubmitting}
      />

      <BillerDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        biller={selectedBiller}
      />

      <BillerForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        biller={selectedBiller || undefined} // Pass selected biller for editing
        onSubmit={handleUpdateBiller}
        isLoading={isSubmitting}
      />

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the biller
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBiller} disabled={isSubmitting} className="bg-red-500 hover:bg-red-600 text-white">
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
