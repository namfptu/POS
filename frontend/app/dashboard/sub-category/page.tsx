"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { PlusCircle, Search, Edit, Trash, FileDown, FileText, ArrowUp, ArrowDown } from "lucide-react";
import { getSubCategories, SubCategory, SubCategoryListResponse, createSubCategory, updateSubCategory, deleteSubCategory, CreateSubCategoryPayload, UpdateSubCategoryPayload } from "@/lib/api/subcategories";
import { SubCategoryForm } from "@/components/subcategory-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Category, getCategories } from "@/lib/api/categories";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SubCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "active" | "inactive">("All");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Omit<SubCategoryListResponse, 'subCategories'>>({
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
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | undefined>(undefined);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [subCategoryToDeleteId, setSubCategoryToDeleteId] = useState<number | null>(null);

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

  const handleFilterCategoryChange = (categoryId: string) => {
    setFilterCategory(categoryId);
    setCurrentPage(1);
  };

  // Fetch subcategories
  const fetchSubCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedStatus = filterStatus === "All" ? undefined : filterStatus;
      const fetchedCategoryId = filterCategory === "All" ? undefined : parseInt(filterCategory, 10);

      const data = await getSubCategories({
        page: currentPage - 1,
        size: pageSize,
        search: searchQuery || undefined,
        status: fetchedStatus,
        sortBy: sortBy,
        sortDir: sortDir,
        categoryId: fetchedCategoryId,
      });
      setSubCategories(data.subCategories);
      setPagination({
        pageNo: data.pageNo,
        pageSize: data.pageSize,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        first: data.first,
        last: data.last,
      });
    } catch (err) {
      console.error("Failed to fetch subcategories:", err);
      setError("Failed to load subcategories. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, filterStatus, filterCategory, sortBy, sortDir]);

  // Fetch categories for the filter dropdown
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const data = await getCategories({}); // Fetch all categories
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories for filter:", error);
      }
    };
    fetchCategoriesData();
  }, []);

  const handleCreateSubCategory = useCallback(async (subCategoryData: CreateSubCategoryPayload) => {
    setIsSubmitting(true);
    try {
      await createSubCategory(subCategoryData);
      alert("Sub Category added successfully!");
      setShowAddForm(false);
      fetchSubCategories();
    } catch (error: any) {
      console.error("Error creating subcategory:", error);
      alert(`Failed to add sub category: ${error.response?.data?.message || error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchSubCategories]);

  useEffect(() => {
    fetchSubCategories();
  }, [fetchSubCategories]);

  const handleEditSubCategory = useCallback((subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setShowEditForm(true);
  }, []);

  const handleUpdateSubCategory = useCallback(async (subCategoryData: UpdateSubCategoryPayload, id?: number) => {
    if (!id) {
      alert("Sub Category ID is missing for update.");
      return;
    }

    const payload: UpdateSubCategoryPayload = {
      name: subCategoryData.name,
      code: subCategoryData.code, // Changed from slug to code
      categoryId: subCategoryData.categoryId,
      status: subCategoryData.status,
      imageUrl: subCategoryData.imageUrl,
      description: subCategoryData.description,
    };

    setIsSubmitting(true);
    try {
      await updateSubCategory(id, payload);
      alert("Sub Category updated successfully!");
      setShowEditForm(false);
      fetchSubCategories();
    } catch (error: any) {
      console.error("Error updating subcategory:", error);
      alert(`Failed to update sub category: ${error.response?.data?.message || error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchSubCategories]);

  const handleDeleteConfirm = useCallback((id: number) => {
    setSubCategoryToDeleteId(id);
    setShowDeleteConfirm(true);
  }, []);

  const handleDeleteSubCategory = useCallback(async () => {
    if (subCategoryToDeleteId === null) return;

    setIsSubmitting(true);
    try {
      await deleteSubCategory(subCategoryToDeleteId);
      alert("Sub Category deleted successfully!");
      fetchSubCategories();
    } catch (error: any) {
      console.error("Error deleting subcategory:", error);
      alert(`Failed to delete sub category: ${error.response?.data?.message || error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
      setSubCategoryToDeleteId(null);
    }
  }, [subCategoryToDeleteId, fetchSubCategories]);

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
        <h2 className="text-lg font-semibold">Sub Categories</h2>
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
            Add Sub Category
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md mr-4">
          <Input
            type="text"
            placeholder="Search sub categories..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full"
          />
        </div>
        <div className="ml-auto w-[180px]">
          <Select value={filterCategory} onValueChange={handleFilterCategoryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[180px] ml-4">
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
              <TableHead>Image</TableHead>
              <TableHead onClick={() => handleSort("name")}>Sub Category {sortBy === "name" && (sortDir === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
              <TableHead onClick={() => handleSort("categoryName")}>Category {sortBy === "categoryName" && (sortDir === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
              <TableHead onClick={() => handleSort("categoryCode")}>Category Code {sortBy === "categoryCode" && (sortDir === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
              <TableHead>Description</TableHead>
              <TableHead onClick={() => handleSort("status")}>Status {sortBy === "status" && (sortDir === "asc" ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Loading sub categories...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : subCategories && subCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No sub categories found.
                </TableCell>
              </TableRow>
            ) : (
              (subCategories || []).map((subCategory) => (
                <TableRow key={subCategory.id}>
                  <TableCell><input type="checkbox" className="h-4 w-4" /></TableCell>
                  <TableCell>
                    <img src={subCategory.imageUrl || "/placeholder-logo.png"} alt={subCategory.name} className="h-8 w-8 object-cover rounded-full" />
                  </TableCell>
                  <TableCell className="font-medium">{subCategory.name}</TableCell>
                  <TableCell>{subCategory.categoryName}</TableCell>
                  <TableCell>{subCategory.code}</TableCell>
                  <TableCell>{subCategory.description}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${subCategory.status === "active" ? "bg-[#3EB780] text-[#FFFFFF]" : "bg-[#EE0000] text-[#FFFFFF]"}`}>
                      {subCategory.status === "active" ? "• Active" : "• Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditSubCategory(subCategory)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteConfirm(subCategory.id)}><Trash className="h-4 w-4" /></Button>
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

      <SubCategoryForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleCreateSubCategory}
        isLoading={isSubmitting}
      />

      <SubCategoryForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        subCategory={selectedSubCategory || undefined}
        onSubmit={handleUpdateSubCategory}
        isLoading={isSubmitting}
      />

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the sub category
              and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSubCategory} disabled={isSubmitting} className="bg-red-500 hover:bg-red-600 text-white">
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
