"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Warehouse } from "@/lib/api"; // Changed from Customer to Warehouse

interface WarehouseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouse: Warehouse | null;
}

export function WarehouseDetailModal({ isOpen, onClose, warehouse }: WarehouseDetailModalProps) { // Changed component name and prop
  if (!warehouse) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Warehouse Details</DialogTitle> {/* Changed title */}
          <DialogDescription>
            View the detailed information of the warehouse.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Code:</span>
            <span className="col-span-3 text-sm text-gray-900">{warehouse.code}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Warehouse Name:</span> {/* Changed label */}
            <span className="col-span-3 text-sm text-gray-900">{warehouse.name}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Contact Person:</span> {/* Changed label */}
            <span className="col-span-3 text-sm text-gray-900">{warehouse.contactPerson || "N/A"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Phone:</span> {/* Changed label */}
            <span className="col-span-3 text-sm text-gray-900">{warehouse.phone || "N/A"}</span>
          </div>
          {/* Removed Email field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Total Products:</span> {/* Changed label */}
            <span className="col-span-3 text-sm text-gray-900">{warehouse.totalProducts}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Stock:</span> {/* Changed label */}
            <span className="col-span-3 text-sm text-gray-900">{warehouse.stock}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Quantity:</span> {/* Changed label */}
            <span className="col-span-3 text-sm text-gray-900">{warehouse.qty}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Status:</span> {/* Changed label */}
            <span className="col-span-3 text-sm text-gray-900 capitalize">{warehouse.status}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">User ID:</span> {/* Added User ID field */}
            <span className="col-span-3 text-sm text-gray-900">{warehouse.userId}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Manager Name:</span> {/* Added Manager Name field */}
            <span className="col-span-3 text-sm text-gray-900">{warehouse.managingUserName}</span>
          </div>
          {warehouse.imageUrl && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium text-gray-500">Image URL:</span>
              <img src={warehouse.imageUrl} alt="Warehouse Image" className="col-span-3 h-16 w-16 object-cover rounded-full" />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Created On:</span> {/* Changed label */}
            <span className="col-span-3 text-sm text-gray-900">{new Date(warehouse.createdOn).toLocaleString()}</span> {/* Changed to createdOn */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
