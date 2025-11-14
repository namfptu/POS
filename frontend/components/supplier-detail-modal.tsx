"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Supplier } from "@/lib/api/suppliers"; // Changed from Customer to Supplier

interface SupplierDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
}

export function SupplierDetailModal({ isOpen, onClose, supplier }: SupplierDetailModalProps) {
  if (!supplier) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supplier Details</DialogTitle>
          <DialogDescription>
            View the detailed information of the supplier.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Code:</span>
            <span className="col-span-3 text-sm text-gray-900">{supplier.id}</span> {/* Changed to supplier.id */}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Name:</span>
            <span className="col-span-3 text-sm text-gray-900">{supplier.name}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Email:</span>
            <span className="col-span-3 text-sm text-gray-900">{supplier.email}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Phone:</span>
            <span className="col-span-3 text-sm text-gray-900">{supplier.phone || "N/A"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Country:</span>
            <span className="col-span-3 text-sm text-gray-900">{supplier.country || "N/A"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Status:</span>
            <span className="col-span-3 text-sm text-gray-900 capitalize">{supplier.status}</span>
          </div>
          {supplier.imageUrl && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium text-gray-500">Image URL:</span>
              <img src={supplier.imageUrl} alt="Supplier Image" className="col-span-3 h-16 w-16 object-cover rounded-full" />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Created At:</span>
            <span className="col-span-3 text-sm text-gray-900">{new Date(supplier.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

