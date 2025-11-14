import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Store } from "@/lib/api/stores";

interface StoreDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: Store | null;
}

export function StoreDetailModal({ isOpen, onClose, store }: StoreDetailModalProps) {
  if (!store) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Store Details</DialogTitle>
          <DialogDescription>
            View the detailed information of the store.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Store Name:</span>
            <span className="col-span-3 text-sm text-gray-900">{store.name}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Code:</span>
            <span className="col-span-3 text-sm text-gray-900">{store.code || "N/A"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">User Name:</span>
            <span className="col-span-3 text-sm text-gray-900">{store.userName || "N/A"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Email:</span>
            <span className="col-span-3 text-sm text-gray-900">{store.email || "N/A"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Phone:</span>
            <span className="col-span-3 text-sm text-gray-900">{store.phone || "N/A"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Address:</span>
            <span className="col-span-3 text-sm text-gray-900">{store.address || "N/A"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">City:</span>
            <span className="col-span-3 text-sm text-gray-900">{store.city || "N/A"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Country:</span>
            <span className="col-span-3 text-sm text-gray-900">{store.country || "N/A"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Warehouse ID:</span>
            <span className="col-span-3 text-sm text-gray-900">{store.warehouseId || "N/A"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Warehouse Name:</span>
            <span className="col-span-3 text-sm text-gray-900">{store.warehouseName || "N/A"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">User ID:</span>
            <span className="col-span-3 text-sm text-gray-900">{store.userId || "N/A"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Total Products:</span>
            <span className="col-span-3 text-sm text-gray-900">{store.totalProducts || 0}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Total Stock:</span>
            <span className="col-span-3 text-sm text-gray-900">{store.totalStock || 0}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Status:</span>
            <span className="col-span-3 text-sm text-gray-900 capitalize">{store.status}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Created At:</span>
            <span className="col-span-3 text-sm text-gray-900">{new Date(store.createdAt).toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Updated At:</span>
            <span className="col-span-3 text-sm text-gray-900">{new Date(store.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
