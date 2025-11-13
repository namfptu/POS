"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Supplier } from "@/lib/api"; // Changed from Customer to Supplier

interface SupplierFormProps {
  isOpen: boolean;
  onClose: () => void;
  supplier?: Supplier; // Optional supplier object for editing
  onSubmit: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'code' | 'email' | 'companyName' | 'role'> & { email?: string; imageUrl?: string | null; }, id?: string) => Promise<void>; // Updated for Supplier
  isLoading: boolean;
}

export function SupplierForm({ isOpen, onClose, supplier, onSubmit, isLoading }: SupplierFormProps) {
  const [name, setName] = useState(supplier?.name || "");
  const [email, setEmail] = useState(supplier?.email || ""); // Re-add email state
  const [phone, setPhone] = useState(supplier?.phone || "");
  const [country, setCountry] = useState(supplier?.country || "");
  // Remove companyName and role state
  const [status, setStatus] = useState<"active" | "inactive">(supplier?.status || "active");
  const [imageUrl, setImageUrl] = useState(supplier?.imageUrl || "");

  useEffect(() => {
    if (supplier) {
      setName(supplier.name);
      setEmail(supplier.email); // Set email from supplier data
      setPhone(supplier.phone || "");
      setCountry(supplier.country || "");
      // Remove companyName and role from supplier data
      setStatus(supplier.status);
      setImageUrl(supplier.imageUrl || "");
    } else {
      // Reset form for new supplier
      setName("");
      setEmail(""); // Reset email for new supplier
      setPhone("");
      setCountry("");
      // Remove companyName and role from reset
      setStatus("active");
      setImageUrl("");
    }
  }, [supplier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Only include email if adding a new supplier
    const supplierData = !supplier
      ? { name, email, phone, country, status, imageUrl }
      : { name, phone, country, status, imageUrl };
    await onSubmit(supplierData, supplier?.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{supplier ? "Edit Supplier" : "Add New Supplier"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          {!supplier && ( // Conditionally render email field only for new suppliers
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="country" className="text-right">
              Country
            </Label>
            <Input
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="col-span-3"
            />
          </div>
          {/* Remove companyName and role fields */}
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white" disabled={isLoading}>
              {isLoading ? (supplier ? "Saving..." : "Adding...") : (supplier ? "Save Changes" : "Add Supplier")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

