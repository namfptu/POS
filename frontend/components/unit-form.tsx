import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Unit } from "@/lib/api/units";

interface UnitFormProps {
  isOpen: boolean;
  onClose: () => void;
  unit?: Unit; // Optional unit object for editing
  onSubmit: (unit: Omit<Unit, 'id' | 'noOfProducts' | 'createdDate' | 'status'> & { name: string; shortName: string; }, id?: number) => Promise<void>; // Updated for Unit
  isLoading: boolean;
}

export function UnitForm({ isOpen, onClose, unit, onSubmit, isLoading }: UnitFormProps) {
  const [name, setName] = useState(unit?.name || "");
  const [shortName, setShortName] = useState(unit?.shortName || ""); // Added shortName state
  const [status, setStatus] = useState<"active" | "inactive">(unit?.status || "active");

  const [nameError, setNameError] = useState<string | null>(null);
  const [shortNameError, setShortNameError] = useState<string | null>(null); // Added shortNameError state

  useEffect(() => {
    if (unit) {
      setName(unit.name);
      setShortName(unit.shortName);
      setStatus(unit.status);
    } else {
      // Reset form for new unit
      setName("");
      setShortName("");
      setStatus("active");
    }
    setNameError(null);
    setShortNameError(null);
  }, [unit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setNameError(null);
    setShortNameError(null);

    let hasError = false;

    if (!name.trim()) {
      setNameError("Unit Name is required.");
      hasError = true;
    }

    if (!shortName.trim()) {
      setShortNameError("Short Name is required.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const dataToSend = {
      name,
      shortName,
      status,
    };
    
    await onSubmit(dataToSend, unit?.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{unit ? "Edit Unit" : "Add New Unit"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Unit Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {setName(e.target.value); setNameError(null);}} // Clear error on change
              className="col-span-3"
              required
            />
            {nameError && <p className="col-span-4 text-red-500 text-sm -mt-2">{nameError}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shortName" className="text-right">
              Short Name
            </Label>
            <Input
              id="shortName"
              value={shortName}
              onChange={(e) => {setShortName(e.target.value); setShortNameError(null);}} // Clear error on change
              className="col-span-3"
              required
            />
            {shortNameError && <p className="col-span-4 text-red-500 text-sm -mt-2">{shortNameError}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={status} onValueChange={(value: "active" | "inactive") => setStatus(value)} disabled={!!unit}>
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
              {isLoading ? (unit ? "Saving..." : "Adding...") : (unit ? "Save Changes" : "Add Unit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
