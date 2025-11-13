"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Warehouse } from "@/lib/api";

interface WarehouseFormProps {
  isOpen: boolean;
  onClose: () => void;
  warehouse?: Warehouse; // Optional warehouse object for editing
  onSubmit: (warehouse: Omit<Warehouse, 'id' | 'code' | 'totalProducts' | 'stock' | 'qty' | 'createdOn' | 'status' | 'managingUserName' | 'imageUrl'> & { name: string; contactPerson?: string | null; phone?: string | null; userId: number; }, id?: number) => Promise<void>; // Updated for Warehouse, id is number now, userId is number
  isLoading: boolean;
  currentUserId: number; // Added currentUserId prop
}

export function WarehouseForm({ isOpen, onClose, warehouse, onSubmit, isLoading, currentUserId }: WarehouseFormProps) {
  const [name, setName] = useState(warehouse?.name || "");
  const [phone, setPhone] = useState(warehouse?.phone || "");
  const [contactPerson, setContactPerson] = useState(warehouse?.contactPerson || "");
  const [status, setStatus] = useState<"active" | "inactive" | "deleted">(warehouse?.status || "active"); // Status can be passed for create/update, but backend rules will handle 'deleted'
  const [imageUrl, setImageUrl] = useState(warehouse?.imageUrl || "");
  const [userId, setUserId] = useState<number | string>(warehouse?.userId || currentUserId); // Added userId state

  const [nameError, setNameError] = useState<string | null>(null); // Added nameError state
  const [userIdError, setUserIdError] = useState<string | null>(null); // Added userIdError state

  useEffect(() => {
    if (warehouse) {
      setName(warehouse.name);
      setPhone(warehouse.phone || "");
      setContactPerson(warehouse.contactPerson || "");
      setStatus(warehouse.status);
      setImageUrl(warehouse.imageUrl || "");
      setUserId(warehouse.userId); // Set userId from warehouse data
    } else {
      // Reset form for new warehouse
      setName("");
      setPhone("");
      setContactPerson("");
      setStatus("active");
      setImageUrl("");
      setUserId(currentUserId); // Set default userId for new warehouse
    }
    setNameError(null); // Clear errors on modal open/warehouse change
    setUserIdError(null); // Clear errors on modal open/warehouse change
  }, [warehouse, currentUserId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setNameError(null);
    setUserIdError(null);

    let hasError = false;

    if (!name.trim()) {
      setNameError("Warehouse Name is required.");
      hasError = true;
    }

    const parsedUserId = Number(userId);
    if (isNaN(parsedUserId) || parsedUserId <= 0) {
      setUserIdError("User ID must be a valid number greater than 0.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const dataToSend = {
      name,
      contactPerson: contactPerson || null,
      phone: phone || null,
      imageUrl: imageUrl || null,
      userId: parsedUserId, // Ensure userId is a number
    };
    
    await onSubmit(dataToSend, warehouse?.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{warehouse ? "Edit Warehouse" : "Add New Warehouse"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Warehouse Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {setName(e.target.value); setNameError(null);}} // Clear error on change
              className="col-span-3"
              required
            />
            {nameError && <p className="col-span-4 text-red-500 text-sm -mt-2">{nameError}</p>} {/* Display error */}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contactPerson" className="text-right">
              Contact Person
            </Label>
            <Input
              id="contactPerson"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              className="col-span-3"
            />
          </div>
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
            <Label htmlFor="userId" className="text-right">
              User ID
            </Label>
            <Input
              id="userId"
              type="number" // Changed type to number
              value={userId}
              onChange={(e) => {setUserId(e.target.value); setUserIdError(null);}} // Clear error on change
              className="col-span-3"
              required
            />
            {userIdError && <p className="col-span-4 text-red-500 text-sm -mt-2">{userIdError}</p>} {/* Display error */}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={status} onValueChange={(value: "active" | "inactive" | "deleted") => setStatus(value)} disabled={!!warehouse}> {/* Include "deleted" in onValueChange type */}
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                {warehouse && <SelectItem value="deleted">Deleted</SelectItem>} {/* Only allow deleting existing warehouse */}
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
              {isLoading ? (warehouse ? "Saving..." : "Adding...") : (warehouse ? "Save Changes" : "Add Warehouse")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
