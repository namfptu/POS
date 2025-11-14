import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from "@/lib/api/categories";

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category; // Optional category object for editing
  onSubmit: (category: Omit<Category, 'id' | 'createdAt' | 'status'> & { name: string; slug: string; }, id?: number) => Promise<void>; // Updated for Category
  isLoading: boolean;
}

export function CategoryForm({ isOpen, onClose, category, onSubmit, isLoading }: CategoryFormProps) {
  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || ""); // Added slug state
  const [status, setStatus] = useState<"active" | "inactive">(category?.status || "active");

  const [nameError, setNameError] = useState<string | null>(null);
  const [slugError, setSlugError] = useState<string | null>(null); // Added slugError state

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setStatus(category.status);
    } else {
      // Reset form for new category
      setName("");
      setSlug("");
      setStatus("active");
    }
    setNameError(null);
    setSlugError(null);
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setNameError(null);
    setSlugError(null);

    let hasError = false;

    if (!name.trim()) {
      setNameError("Category Name is required.");
      hasError = true;
    }

    if (!slug.trim()) {
      setSlugError("Category Slug is required.");
      hasError = true;
    } else if (slug.includes(" ")) {
      setSlugError("Category Slug cannot contain spaces.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const dataToSend = {
      name,
      slug,
      status,
    };
    
    await onSubmit(dataToSend, category?.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Add New Category"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Category Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {setName(e.target.value); setNameError(null);}} // Clear error on change
              className="col-span-3"
              required
            />
            {nameError && <p className="col-span-4 text-red-500 text-sm -mt-2">{nameError}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="slug" className="text-right">
              Category Slug
            </Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => {setSlug(e.target.value); setSlugError(null);}} // Clear error on change
              className="col-span-3"
              required
            />
            {slugError && <p className="col-span-4 text-red-500 text-sm -mt-2">{slugError}</p>}
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
              {isLoading ? (category ? "Saving..." : "Adding...") : (category ? "Save Changes" : "Add Category")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
