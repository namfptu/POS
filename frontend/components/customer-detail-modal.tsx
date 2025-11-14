"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Customer } from "@/lib/api/customers";

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export function CustomerDetailModal({ isOpen, onClose, customer }: CustomerDetailModalProps) {
  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
          <DialogDescription>
            View the detailed information of the customer.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Code:</span>
            <span className="col-span-3 text-sm text-gray-900">{customer.code}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Name:</span>
            <span className="col-span-3 text-sm text-gray-900">{customer.name}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Email:</span>
            <span className="col-span-3 text-sm text-gray-900">{customer.email}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Phone:</span>
            <span className="col-span-3 text-sm text-gray-900">{customer.phone || "N/A"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Country:</span>
            <span className="col-span-3 text-sm text-gray-900">{customer.country || "N/A"}</span>
          </div>
          {/* Remove Company Name and Role fields */}
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Status:</span>
            <span className="col-span-3 text-sm text-gray-900 capitalize">{customer.status}</span>
          </div>
          {customer.imageUrl && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium text-gray-500">Image URL:</span>
              <img src={customer.imageUrl} alt="Customer Image" className="col-span-3 h-16 w-16 object-cover rounded-full" />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Created At:</span>
            <span className="col-span-3 text-sm text-gray-900">{new Date(customer.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

