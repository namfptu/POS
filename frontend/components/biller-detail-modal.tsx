"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Biller } from "@/lib/api/billers"; // Changed from Customer to Biller

interface BillerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  biller: Biller | null;
}

export function BillerDetailModal({ isOpen, onClose, biller }: BillerDetailModalProps) {
  if (!biller) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Biller Details</DialogTitle>
          <DialogDescription>
            View the detailed information of the biller.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Code:</span>
            <span className="col-span-3 text-sm text-gray-900">{biller.code}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Name:</span>
            <span className="col-span-3 text-sm text-gray-900">{biller.name}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Email:</span>
            <span className="col-span-3 text-sm text-gray-900">{biller.email}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Phone:</span>
            <span className="col-span-3 text-sm text-gray-900">{biller.phone || "N/A"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Country:</span>
            <span className="col-span-3 text-sm text-gray-900">{biller.country || "N/A"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Company Name:</span>
            <span className="col-span-3 text-sm text-gray-900">{biller.companyName || "N/A"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Status:</span>
            <span className="col-span-3 text-sm text-gray-900 capitalize">{biller.status}</span>
          </div>
          {biller.imageUrl && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium text-gray-500">Image URL:</span>
              <img src={biller.imageUrl} alt="Biller Image" className="col-span-3 h-16 w-16 object-cover rounded-full" />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Created At:</span>
            <span className="col-span-3 text-sm text-gray-900">{new Date(biller.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
