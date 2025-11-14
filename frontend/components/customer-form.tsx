"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Customer } from "@/lib/api/customers";

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer; // Optional customer object for editing
  onSubmit: (customer: Omit<Customer, 'id' | 'createdAt' | 'code' | 'email' | 'companyName' | 'role'> & { email?: string; imageUrl?: string | null; }, id?: string) => Promise<void>;
  isLoading: boolean;
}

export function CustomerForm({ isOpen, onClose, customer, onSubmit, isLoading }: CustomerFormProps) {
  const [name, setName] = useState(customer?.name || "");
  const [email, setEmail] = useState(customer?.email || ""); // Re-add email state
  const [phone, setPhone] = useState(customer?.phone || "");
  const [country, setCountry] = useState(customer?.country || "");
  // Remove companyName and role state
  const [status, setStatus] = useState<"active" | "inactive">(customer?.status || "active");
  const [imageUrl, setImageUrl] = useState(customer?.imageUrl || "");

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setEmail(customer.email); // Set email from customer data
      setPhone(customer.phone || "");
      setCountry(customer.country || "");
      // Remove companyName and role from customer data
      setStatus(customer.status);
      setImageUrl(customer.imageUrl || "");
    } else {
      // Reset form for new customer
      setName("");
      setEmail(""); // Reset email for new customer
      setPhone("");
      setCountry("");
      // Remove companyName and role from reset
      setStatus("active");
      setImageUrl("");
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Only include email if adding a new customer
    const customerData = !customer
      ? { name, email, phone, country, status, imageUrl }
      : { name, phone, country, status, imageUrl };
    await onSubmit(customerData, customer?.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{customer ? "Edit Customer" : "Add New Customer"}</DialogTitle>
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
          {!customer && ( // Conditionally render email field only for new customers
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
              {isLoading ? (customer ? "Saving..." : "Adding...") : (customer ? "Save Changes" : "Add Customer")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
