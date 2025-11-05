"use client"

import { Bell, Mail, Settings, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DashboardHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3 flex-1">
        <div className="bg-orange-500 text-white rounded-full p-2 flex items-center justify-center">
          <span className="text-xs font-bold">POS</span>
        </div>
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input type="text" placeholder="Search" className="pl-10 bg-gray-100 border-0 rounded-lg text-sm" />
          </div>
        </div>
        <span className="text-gray-500 text-xs">⌘K</span>
      </div>

      <div className="flex items-center gap-4">
        <select
          defaultValue="freshmart"
          className="text-sm font-medium text-gray-700 bg-transparent border-0 focus:outline-none cursor-pointer"
        >
          <option value="freshmart">Freshmart</option>
        </select>

        <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
          <span>+</span> Add New
        </Button>

        <Button variant="outline" className="gap-2 bg-transparent">
          POS
        </Button>

        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
          <button className="text-gray-600 hover:text-gray-900 relative">
            <span className="text-lg">🌐</span>
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            <Mail className="w-5 h-5" />
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            <Settings className="w-5 h-5" />
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            <User className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            U
          </div>
        </div>
      </div>
    </header>
  )
}
