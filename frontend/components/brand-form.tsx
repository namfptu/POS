import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brand } from "@/lib/api/brands";

interface BrandFormProps {
  isOpen: boolean;
  onClose: () => void;
  brand?: Brand; // Optional brand object for editing
  onSubmit: (brand: Omit<Brand, 'id' | 'createdAt' | 'status'> & { name: string; imageUrl: string | null; }, id?: number) => Promise<void>; // Updated for Brand
  isLoading: boolean;
}

export function BrandForm({ isOpen, onClose, brand, onSubmit, isLoading }: BrandFormProps) {
  const [name, setName] = useState(brand?.name || "");
  const [imageUrl, setImageUrl] = useState(brand?.imageUrl || ""); // Added imageUrl state
  const [status, setStatus] = useState<"active" | "inactive">(brand?.status || "active");

  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (brand) {
      setName(brand.name);
      setImageUrl(brand.imageUrl || "");
      setStatus(brand.status);
    } else {
      // Reset form for new brand
      setName("");
      setImageUrl("");
      setStatus("active");
    }
    setNameError(null);
  }, [brand]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setNameError(null);

    let hasError = false;

    if (!name.trim()) {
      setNameError("Brand Name is required.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const dataToSend = {
      name,
      imageUrl: imageUrl || null,
      status,
    };
    
    await onSubmit(dataToSend, brand?.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{brand ? "Edit Brand" : "Add New Brand"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Brand Name
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
            <Label htmlFor="imageUrl" className="text-right">
              Image URL
            </Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={status} onValueChange={(value: "active" | "inactive") => setStatus(value)} disabled={!!brand}>
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
              {isLoading ? (brand ? "Saving..." : "Adding...") : (brand ? "Save Changes" : "Add Brand")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

