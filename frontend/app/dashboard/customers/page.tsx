"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { PlusCircle, Search, Eye, Edit, Trash, FileDown, FileText } from "lucide-react";
import { getCustomers, Customer, CustomerListResponse, createCustomer, updateCustomer, deleteCustomer, UpdateCustomerPayload } from "@/lib/api/customers";
import { CustomerForm } from "@/components/customer-form";
import { CustomerDetailModal } from "@/components/customer-detail-modal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "active" | "inactive">("All"); // Match backend status
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState<Omit<CustomerListResponse, 'customers'>>({
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
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null); 
  const [showEditForm, setShowEditForm] = useState(false); 
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [customerToDeleteId, setCustomerToDeleteId] = useState<string | null>(null); 

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedStatus = filterStatus === "All" ? undefined : filterStatus; // Removed .toUpperCase()

      const data = await getCustomers({
        page: currentPage - 1, 
        size: pageSize,
        search: searchQuery || undefined,
        status: fetchedStatus,
      });
      setCustomers(data.customers);
      setPagination({
        pageNo: data.pageNo,
        pageSize: data.pageSize,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        first: data.first, // Set first from API response
        last: data.last,
      });
    } catch (err) {
      console.error("Failed to fetch customers:", err);
      setError("Failed to load customers. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, filterStatus]);

  const handleCreateCustomer = useCallback(async (customerData: Omit<Customer, 'id' | 'createdAt' | 'code' | 'email' | 'companyName' | 'role'> & { email?: string; imageUrl?: string | null; }) => {
    setIsSubmitting(true);
    try {
      // Pass customerData directly to createCustomer after ensuring it has the required fields
      await createCustomer(customerData as Omit<Customer, 'id' | 'createdAt'>); // Cast to expected type
      alert("Customer added successfully!");
      setShowAddForm(false); // Close the form
      fetchCustomers(); // Reload customer list
    } catch (error) {
      console.error("Error creating customer:", error);
      alert("Failed to add customer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchCustomers]); // Add fetchCustomers to dependencies

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to first page on size change
  };

  const handleViewCustomer = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
  }, []);

  const handleEditCustomer = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setShowEditForm(true);
  }, []);

  const handleUpdateCustomer = useCallback(async (customerData: Omit<Customer, 'id' | 'createdAt' | 'code' | 'email' | 'companyName' | 'role'> & { email?: string; imageUrl?: string | null; }, id?: string) => {
    if (!id) {
      alert("Customer ID is missing for update.");
      return;
    }

    // Create a payload that matches UpdateCustomerPayload interface, excluding companyName and role
    const payload: UpdateCustomerPayload = {
      name: customerData.name,
      phone: customerData.phone,
      country: customerData.country,
      status: customerData.status,
      imageUrl: customerData.imageUrl
    };

    setIsSubmitting(true);
    try {
      await updateCustomer(id, payload);
      alert("Customer updated successfully!");
      setShowEditForm(false); // Close the form
      fetchCustomers();
    } catch (error) {
      console.error("Error updating customer:", error);
      alert("Failed to update customer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchCustomers]);

  const handleDeleteConfirm = useCallback((id: string) => {
    setCustomerToDeleteId(id);
    setShowDeleteConfirm(true);
  }, []);

  const handleDeleteCustomer = useCallback(async () => {
    if (!customerToDeleteId) return;

    setIsSubmitting(true);
    try {
      const response = await deleteCustomer(customerToDeleteId);
      alert(response.message || "Customer deleted successfully!");
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Failed to delete customer. Please try again.");
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false); // Close the dialog
      setCustomerToDeleteId(null);
    }
  }, [customerToDeleteId, fetchCustomers]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Customers</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-[#EE2C2C]">
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" size="sm" className="bg-[#00AE72] hover:bg-[#00AE72]/90">
            <FileDown className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button size="sm" className="bg-[#FF9025] hover:bg-[#FF9025]/90" onClick={() => setShowAddForm(true)}> {/* Open add customer form */}
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Customer
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
              <TableHead>Code ⇅</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Country</TableHead>
              {/* <TableHead>Company Name</TableHead> */}
              {/* <TableHead>Role</TableHead> */}
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Loading customers...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : customers && customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              (customers || []).map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell><input type="checkbox" className="h-4 w-4" /></TableCell>
                  <TableCell className="font-medium">{customer.code}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <img src={customer.imageUrl || "/placeholder-user.jpg"} alt={customer.name} className="h-8 w-8 rounded-full object-cover" />
                    <span>{customer.name}</span>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.country}</TableCell>
                  {/* <TableCell>{customer.companyName}</TableCell> */}
                  {/* <TableCell className="capitalize">{customer.role}</TableCell> */}
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${customer.status === "active" ? "bg-[#3EB780] text-[#FFFFFF]" : "bg-[#EE0000] text-[#FFFFFF]"}`}>
                      {customer.status === "active" ? "• Active" : "• Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleViewCustomer(customer)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEditCustomer(customer)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteConfirm(customer.id)}><Trash className="h-4 w-4" /></Button>
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

      <CustomerForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleCreateCustomer}
        isLoading={isSubmitting}
      />

      <CustomerDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        customer={selectedCustomer}
      />

      <CustomerForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        customer={selectedCustomer || undefined} // Pass selected customer for editing
        onSubmit={handleUpdateCustomer}
        isLoading={isSubmitting}
      />

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the customer
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCustomer} disabled={isSubmitting} className="bg-red-500 hover:bg-red-600 text-white">
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
