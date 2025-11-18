import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VariantAttribute } from "@/lib/api/variant-attributes";

interface VariantAttributeFormProps {
  isOpen: boolean;
  onClose: () => void;
  variantAttribute?: VariantAttribute; // Optional for editing
  onSubmit: (variantAttribute: Omit<VariantAttribute, 'id' | 'createdAt'> & { name: string; values: string[]; imageUrl?: string | null; status: "active" | "inactive"; }, id?: number) => Promise<void>;
  isLoading: boolean;
}

export function VariantAttributeForm({ isOpen, onClose, variantAttribute, onSubmit, isLoading }: VariantAttributeFormProps) {
  const [name, setName] = useState(variantAttribute?.name || "");
  const [values, setValues] = useState<string[]>(variantAttribute?.values || []);
  const [imageUrl, setImageUrl] = useState<string | null>(variantAttribute?.imageUrl || null);
  const [status, setStatus] = useState<"active" | "inactive">(variantAttribute?.status || "active");

  const [nameError, setNameError] = useState<string | null>(null);
  const [valuesError, setValuesError] = useState<string | null>(null);

  useEffect(() => {
    if (variantAttribute) {
      setName(variantAttribute.name);
      setValues(variantAttribute.values);
      setImageUrl(variantAttribute.imageUrl);
      setStatus(variantAttribute.status);
    } else {
      setName("");
      setValues([]);
      setImageUrl(null);
      setStatus("active");
    }
    setNameError(null);
    setValuesError(null);
  }, [variantAttribute]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setNameError(null);
    setValuesError(null);

    let hasError = false;

    if (!name.trim()) {
      setNameError("Variant name is required.");
      hasError = true;
    }

    if (values.length === 0 || values.some(value => !value.trim())) {
      setValuesError("At least one value is required, and values cannot be empty.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const dataToSend = {
      name,
      values,
      imageUrl,
      status,
    };

    await onSubmit(dataToSend, variantAttribute?.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{variantAttribute ? "Edit Variant Attribute" : "Add New Variant Attribute"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(null); }}
              className="col-span-3"
              required
            />
            {nameError && <p className="col-span-4 text-red-500 text-sm -mt-2">{nameError}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="values" className="text-right">
              Values 
            </Label>
            <Input
              id="values"
              value={values.join(', ')}
              onChange={(e) => { setValues(e.target.value.split(',').map(s => s.trim())); setValuesError(null); }}
              className="col-span-3"
              required
            />
            {valuesError && <p className="col-span-4 text-red-500 text-sm -mt-2">{valuesError}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right">
              Image URL
            </Label>
            <Input
              id="imageUrl"
              value={imageUrl || ""}
              onChange={(e) => setImageUrl(e.target.value)}
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white" disabled={isLoading}>
              {isLoading ? (variantAttribute ? "Saving..." : "Adding...") : (variantAttribute ? "Save Changes" : "Add Variant Attribute")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
