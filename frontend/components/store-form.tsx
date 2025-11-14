import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Store } from "@/lib/api/stores";

interface StoreFormProps {
  isOpen: boolean;
  onClose: () => void;
  store?: Store; // Optional store object for editing
  onSubmit: (store: Omit<Store, 'id' | 'code' | 'userName' | 'warehouseName' | 'totalProducts' | 'totalStock' | 'status' | 'createdAt' | 'updatedAt'> & { name: string; email: string; phone?: string | null; address: string; city: string; country: string; warehouseId: number; userId: number; }, id?: number) => Promise<void>; // Updated for Store
  isLoading: boolean;
}

export function StoreForm({ isOpen, onClose, store, onSubmit, isLoading }: StoreFormProps) {
  const [name, setName] = useState(store?.name || "");
  const [userName, setUserName] = useState(store?.userName || "");
  const [email, setEmail] = useState(store?.email || "");
  const [phone, setPhone] = useState(store?.phone || "");
  const [address, setAddress] = useState(store?.address || ""); // Added address state
  const [city, setCity] = useState(store?.city || ""); // Added city state
  const [country, setCountry] = useState(store?.country || ""); // Added country state
  const [warehouseId, setWarehouseId] = useState<number | string>(store?.warehouseId || ""); // Added warehouseId state
  const [userId, setUserId] = useState<number | string>(store?.userId || ""); // Added userId state
  const [status, setStatus] = useState<"active" | "inactive">(store?.status || "active");

  const [nameError, setNameError] = useState<string | null>(null);
  const [userNameError, setUserNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null); // Added addressError state
  const [cityError, setCityError] = useState<string | null>(null); // Added cityError state
  const [countryError, setCountryError] = useState<string | null>(null); // Added countryError state
  const [warehouseIdError, setWarehouseIdError] = useState<string | null>(null); // Added warehouseIdError state
  const [userIdError, setUserIdError] = useState<string | null>(null); // Added userIdError state

  useEffect(() => {
    if (store) {
      setName(store.name);
      setUserName(store.userName);
      setEmail(store.email);
      setPhone(store.phone || "");
      setAddress(store.address);
      setCity(store.city);
      setCountry(store.country);
      setWarehouseId(store.warehouseId);
      setUserId(store.userId);
      setStatus(store.status);
    } else {
      // Reset form for new store
      setName("");
      setUserName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setCity("");
      setCountry("");
      setWarehouseId("");
      setUserId("");
      setStatus("active");
    }
    setNameError(null);
    setUserNameError(null);
    setEmailError(null);
    setAddressError(null);
    setCityError(null);
    setCountryError(null);
    setWarehouseIdError(null);
    setUserIdError(null);
  }, [store]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setNameError(null);
    setUserNameError(null);
    setEmailError(null);
    setAddressError(null);
    setCityError(null);
    setCountryError(null);
    setWarehouseIdError(null);
    setUserIdError(null);

    let hasError = false;

    if (!name.trim()) {
      setNameError("Store Name is required.");
      hasError = true;
    }

    if (!userName.trim()) {
      setUserNameError("User Name is required.");
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError("Email is required.");
      hasError = true;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError("Invalid email format.");
      hasError = true;
    }

    if (!address.trim()) {
      setAddressError("Address is required.");
      hasError = true;
    }

    if (!city.trim()) {
      setCityError("City is required.");
      hasError = true;
    }

    if (!country.trim()) {
      setCountryError("Country is required.");
      hasError = true;
    }

    const parsedWarehouseId = Number(warehouseId);
    if (isNaN(parsedWarehouseId) || parsedWarehouseId <= 0) {
      setWarehouseIdError("Warehouse ID must be a valid number greater than 0.");
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
      userName,
      email,
      phone: phone || null,
      address,
      city,
      country,
      warehouseId: parsedWarehouseId,
      userId: parsedUserId,
    };
    
    await onSubmit(dataToSend, store?.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{store ? "Edit Store" : "Add New Store"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Store Name
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
            <Label htmlFor="userName" className="text-right">
              User Name
            </Label>
            <Input
              id="userName"
              value={userName}
              onChange={(e) => {setUserName(e.target.value); setUserNameError(null);}} // Clear error on change
              className="col-span-3"
              required
            />
            {userNameError && <p className="col-span-4 text-red-500 text-sm -mt-2">{userNameError}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {setEmail(e.target.value); setEmailError(null);}} // Clear error on change
              className="col-span-3"
              required
            />
            {emailError && <p className="col-span-4 text-red-500 text-sm -mt-2">{emailError}</p>}
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
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => {setAddress(e.target.value); setAddressError(null);}} // Clear error on change
              className="col-span-3"
              required
            />
            {addressError && <p className="col-span-4 text-red-500 text-sm -mt-2">{addressError}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="city" className="text-right">
              City
            </Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => {setCity(e.target.value); setCityError(null);}} // Clear error on change
              className="col-span-3"
              required
            />
            {cityError && <p className="col-span-4 text-red-500 text-sm -mt-2">{cityError}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="country" className="text-right">
              Country
            </Label>
            <Input
              id="country"
              value={country}
              onChange={(e) => {setCountry(e.target.value); setCountryError(null);}} // Clear error on change
              className="col-span-3"
              required
            />
            {countryError && <p className="col-span-4 text-red-500 text-sm -mt-2">{countryError}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="warehouseId" className="text-right">
              Warehouse ID
            </Label>
            <Input
              id="warehouseId"
              type="number"
              value={warehouseId}
              onChange={(e) => {setWarehouseId(e.target.value); setWarehouseIdError(null);}} // Clear error on change
              className="col-span-3"
              required
            />
            {warehouseIdError && <p className="col-span-4 text-red-500 text-sm -mt-2">{warehouseIdError}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="userId" className="text-right">
              User ID
            </Label>
            <Input
              id="userId"
              type="number"
              value={userId}
              onChange={(e) => {setUserId(e.target.value); setUserIdError(null);}} // Clear error on change
              className="col-span-3"
              required
            />
            {userIdError && <p className="col-span-4 text-red-500 text-sm -mt-2">{userIdError}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={status} onValueChange={(value: "active" | "inactive") => setStatus(value)} disabled={!!store}>
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
              {isLoading ? (store ? "Saving..." : "Adding...") : (store ? "Save Changes" : "Add Store")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
