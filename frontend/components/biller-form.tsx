"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Biller } from "@/lib/api/billers"; // Changed from Customer to Biller

interface BillerFormProps {
  isOpen: boolean;
  onClose: () => void;
  biller?: Biller; // Optional biller object for editing
  onSubmit: (biller: Omit<Biller, 'id' | 'createdAt' | 'code'> & { email?: string; companyName?: string | null; imageUrl?: string | null; }, id?: string) => Promise<void>; // Updated for Biller
  isLoading: boolean;
}

export function BillerForm({ isOpen, onClose, biller, onSubmit, isLoading }: BillerFormProps) {
  const [name, setName] = useState(biller?.name || "");
  const [email, setEmail] = useState(biller?.email || ""); // Re-add email state
  const [phone, setPhone] = useState(biller?.phone || "");
  const [country, setCountry] = useState(biller?.country || "");
  const [companyName, setCompanyName] = useState(biller?.companyName || ""); // Added companyName state
  const [status, setStatus] = useState<"active" | "inactive">(biller?.status || "active");
  const [imageUrl, setImageUrl] = useState(biller?.imageUrl || "");

  useEffect(() => {
    if (biller) {
      setName(biller.name);
      setEmail(biller.email); 
      setPhone(biller.phone || "");
      setCountry(biller.country || "");
      setCompanyName(biller.companyName || ""); 
      setStatus(biller.status);
      setImageUrl(biller.imageUrl || "");
    } else {
      
      setName("");
      setEmail(""); 
      setPhone("");
      setCountry("");
      setCompanyName(""); 
      setStatus("active");
      setImageUrl("");
    }
  }, [biller]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const billerData = !biller
      ? { name, email, phone, country, companyName, status, imageUrl }
      : { name, phone, country, companyName, status, imageUrl };
    await onSubmit(billerData, biller?.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{biller ? "Edit Biller" : "Add New Biller"}</DialogTitle>
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
          {!biller && ( // Conditionally render email field only for new billers
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="companyName" className="text-right">
              Company 
            </Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
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
              {isLoading ? (biller ? "Saving..." : "Adding...") : (biller ? "Save Changes" : "Add Biller")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
