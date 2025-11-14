import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubCategory } from "@/lib/api/subcategories";
import { Category, getCategories } from "@/lib/api/categories"; // Import Category and getCategories

interface SubCategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  subCategory?: SubCategory; // Optional subCategory object for editing
  onSubmit: (subCategory: Omit<SubCategory, 'id' | 'createdAt' | 'categoryName'> & { name: string; code: string; categoryId: number; status: "active" | "inactive"; imageUrl?: string | null; description?: string | null; }, id?: number) => Promise<void>;
  isLoading: boolean;
}

export function SubCategoryForm({ isOpen, onClose, subCategory, onSubmit, isLoading }: SubCategoryFormProps) {
  const [name, setName] = useState(subCategory?.name || "");
  const [code, setCode] = useState(subCategory?.code || ""); // Re-added code state for subcategory code
  const [categoryId, setCategoryId] = useState<string>(subCategory?.categoryId.toString() || ""); // categoryId as string for Select
  const [status, setStatus] = useState<"active" | "inactive">(subCategory?.status || "active");
  const [categories, setCategories] = useState<Category[]>([]); // State for categories
  const [imageUrl, setImageUrl] = useState<string | null>(subCategory?.imageUrl || null);
  const [description, setDescription] = useState<string | null>(subCategory?.description || null);

  const [nameError, setNameError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null); // Re-added codeError state
  const [categoryError, setCategoryError] = useState<string | null>(null);

  useEffect(() => {
    if (subCategory) {
      setName(subCategory.name);
      setCode(subCategory.code);
      setCategoryId(subCategory.categoryId.toString());
      setStatus(subCategory.status);
      setImageUrl(subCategory.imageUrl);
      setDescription(subCategory.description);
    } else {
      // Reset form for new subcategory
      setName("");
      setCode("");
      setCategoryId("");
      setStatus("active");
      setImageUrl(null);
      setDescription(null);
    }
    setNameError(null);
    setCodeError(null);
    setCategoryError(null);
  }, [subCategory]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const data = await getCategories({}); // Fetch all categories
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategoriesData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setNameError(null);
    setCodeError(null);
    setCategoryError(null);

    let hasError = false;

    if (!name.trim()) {
      setNameError("Sub Category Name is required.");
      hasError = true;
    }

    if (!code.trim()) { // Validation for subcategory code
      setCodeError("Category Code is required.");
      hasError = true;
    }

    if (!categoryId) {
      setCategoryError("Category is required.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const dataToSend = {
      name,
      code,
      categoryId: parseInt(categoryId, 10),
      status,
      imageUrl,
      description,
    };
    
    await onSubmit(dataToSend, subCategory?.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{subCategory ? "Edit Sub Category" : "Add New Sub Category"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Sub Category Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {setName(e.target.value); setNameError(null);}}
              className="col-span-3"
              required
            />
            {nameError && <p className="col-span-4 text-red-500 text-sm -mt-2">{nameError}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              Category Code
            </Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => {setCode(e.target.value); setCodeError(null);}}
              className="col-span-3"
              required
            />
            {codeError && <p className="col-span-4 text-red-500 text-sm -mt-2">{codeError}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="categoryId" className="text-right">
              Category
            </Label>
            <Select value={categoryId} onValueChange={(value) => {setCategoryId(value); setCategoryError(null);}}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {categoryError && <p className="col-span-4 text-red-500 text-sm -mt-2">{categoryError}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right">
              Image URL
            </Label>
            <Input
              id="imageUrl"
              value={imageUrl || ""}
              onChange={(e) => setImageUrl(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description || ""}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={status} onValueChange={(value: "active" | "inactive") => setStatus(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white" disabled={isLoading}>
              {isLoading ? (subCategory ? "Saving..." : "Adding...") : (subCategory ? "Save Changes" : "Add Sub Category")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
