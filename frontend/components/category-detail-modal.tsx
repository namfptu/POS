import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Category } from "@/lib/api/categories";

interface CategoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
}

export function CategoryDetailModal({ isOpen, onClose, category }: CategoryDetailModalProps) {
  if (!category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Category Details</DialogTitle>
          <DialogDescription>
            View the detailed information of the category.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Category Name:</span>
            <span className="col-span-3 text-sm text-gray-900">{category.name}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Category Slug:</span>
            <span className="col-span-3 text-sm text-gray-900">{category.slug}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Status:</span>
            <span className="col-span-3 text-sm text-gray-900 capitalize">{category.status}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Created On:</span>
            <span className="col-span-3 text-sm text-gray-900">{new Date(category.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
