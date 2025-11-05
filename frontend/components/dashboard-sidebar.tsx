"use client"

import type React from "react"

import {
  Menu,
  ClipboardIcon as DashboardIcon,
  Users,
  Package,
  Plus,
  Clock,
  Layers,
  Tag,
  Zap,
  Barcode,
  QrCode,
  Box,
  RefreshCw,
  Truck,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardSidebarProps {
  open: boolean
  onToggle: () => void
}

export function DashboardSidebar({ open, onToggle }: DashboardSidebarProps) {
  return (
    <aside
      className={`${open ? "w-64" : "w-20"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col overflow-y-auto`}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-gray-200">
        <div className={`flex items-center gap-2 ${!open && "hidden"}`}>
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="font-bold text-gray-900">DreamsPOS</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0 hover:bg-gray-100">
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {/* Main Section */}
        {open && <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Main</div>}

        <div className="space-y-1">
          <NavItem icon={<DashboardIcon className="w-5 h-5" />} label="Dashboard" active open={open} />
          <NavItem icon={<Users className="w-5 h-5" />} label="Super Admin" open={open} />
        </div>

        {/* Inventory Section */}
        {open && (
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6">Inventory</div>
        )}

        <div className="space-y-1">
          <NavItem icon={<Package className="w-5 h-5" />} label="Products" open={open} />
          <NavItem icon={<Plus className="w-5 h-5" />} label="Create Product" open={open} />
          <NavItem icon={<Clock className="w-5 h-5" />} label="Expired Products" open={open} />
          <NavItem icon={<Zap className="w-5 h-5" />} label="Low Stocks" open={open} />
          <NavItem icon={<Layers className="w-5 h-5" />} label="Category" open={open} />
          <NavItem icon={<Tag className="w-5 h-5" />} label="Sub Category" open={open} />
          <NavItem icon={<Package className="w-5 h-5" />} label="Brands" open={open} />
          <NavItem icon={<Zap className="w-5 h-5" />} label="Units" open={open} />
          <NavItem icon={<Layers className="w-5 h-5" />} label="Variant Attributes" open={open} />
          <NavItem icon={<Package className="w-5 h-5" />} label="Warranties" open={open} />
          <NavItem icon={<Barcode className="w-5 h-5" />} label="Print Barcode" open={open} />
          <NavItem icon={<QrCode className="w-5 h-5" />} label="Print QR Code" open={open} />
        </div>

        {/* Stock Section */}
        {open && (
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6">Stock</div>
        )}

        <div className="space-y-1">
          <NavItem icon={<Box className="w-5 h-5" />} label="Manage Stock" open={open} />
          <NavItem icon={<RefreshCw className="w-5 h-5" />} label="Stock Adjustment" open={open} />
          <NavItem icon={<Truck className="w-5 h-5" />} label="Stock Transfer" open={open} />
        </div>

        {/* Sales Section (placeholder for expansion) */}
        {open && (
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6">Sales</div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {open && <p className="text-xs text-gray-500 text-center">2014-2025 © DreamsPOS. All Rights Reserved</p>}
      </div>
    </aside>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  open: boolean
}

function NavItem({ icon, label, active, open }: NavItemProps) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
        active ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-100"
      }`}
      title={!open ? label : undefined}
    >
      <span className="flex-shrink-0">{icon}</span>
      {open && <span className="text-sm font-medium">{label}</span>}
      {open && <span className="text-gray-400 ml-auto text-xs">›</span>}
    </button>
  )
}
