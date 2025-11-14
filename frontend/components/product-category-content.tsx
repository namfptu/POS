"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, GridIcon, Package, Headphones, Zap, Watch, Laptop, Home } from "lucide-react"
import { useState } from "react"

interface Category {
  id: string
  name: string
  icon: React.ReactNode
  count: number
}

interface Product {
  id: string
  name: string
  category: string
  image: string
  price: number
  quantity: number
}

const categories: Category[] = [
  { id: "1", name: "All Categories", icon: <GridIcon className="w-6 h-6" />, count: 54 },
  { id: "2", name: "Headphones", icon: <Headphones className="w-6 h-6" />, count: 4 },
  { id: "3", name: "Headphones", icon: <Headphones className="w-6 h-6" />, count: 4 },
  { id: "4", name: "Shoes", icon: <Package className="w-6 h-6" />, count: 14 },
  { id: "5", name: "Mobiles", icon: <Zap className="w-6 h-6" />, count: 7 },
  { id: "6", name: "Watches", icon: <Watch className="w-6 h-6" />, count: 9 },
  { id: "7", name: "Laptops", icon: <Laptop className="w-6 h-6" />, count: 18 },
  { id: "8", name: "Home Needs", icon: <Home className="w-6 h-6" />, count: 12 },
]

const products: Product[] = [
  {
    id: "1",
    name: "iPhone 14 64GB",
    category: "Mobiles",
    image: "/modern-smartphone.png",
    price: 51800,
    quantity: 30,
  },
  {
    id: "2",
    name: "MacBook Pro",
    category: "Computer",
    image: "/modern-laptop-workspace.png",
    price: 1000,
    quantity: 140,
  },
  {
    id: "3",
    name: "Rolex Tribute V3",
    category: "Watches",
    image: "/wrist-watch-close-up.png",
    price: 56800,
    quantity: 220,
  },
  { id: "4", name: "Red Nike Angelo", category: "Shoes", image: "/assorted-shoes.png", price: 0, quantity: 220 },
  {
    id: "5",
    name: "Airpod 2",
    category: "Headphones",
    image: "/wireless-earbuds.png",
    price: 59478,
    quantity: 47,
  },
  { id: "6", name: "Blue White OGR", category: "Shoes", image: "/assorted-shoes.png", price: 987, quantity: 30 },
  {
    id: "7",
    name: "IdeaPad Slim 5 Gen 7",
    category: "Computer",
    image: "/modern-laptop-workspace.png",
    price: 1454,
    quantity: 74,
  },
  { id: "8", name: "SWAGME", category: "Headphones", image: "/diverse-people-listening-headphones.png", price: 56587, quantity: 14 },
  {
    id: "9",
    name: "Red Nike Angelo",
    category: "Shoes",
    image: "/assorted-shoes.png",
    price: 1467,
    quantity: 220,
  },
  {
    id: "10",
    name: "Tablet 1.02 Inch",
    category: "Computer",
    image: "/modern-tablet-display.png",
    price: 54744,
    quantity: 47,
  },
  {
    id: "11",
    name: "Fossil Pair Of 3 in 1",
    category: "Watches",
    image: "/wrist-watch-close-up.png",
    price: 789,
    quantity: 40,
  },
  {
    id: "12",
    name: "Green Nike Fe",
    category: "Shoes",
    image: "/assorted-shoes.png",
    price: 1454,
    quantity: 78,
  },
]

export function ProductCategoryContent() {
  const [selectedCategory, setSelectedCategory] = useState("1")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        {/* Action Buttons */}
        <div className="flex gap-2 mb-6">
          <Button className="bg-green-500 hover:bg-green-600 text-white gap-2">View Orders</Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white gap-2">Reset</Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white gap-2">Transaction</Button>
        </div>

        {/* Categories Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all flex-shrink-0 ${
                  selectedCategory === category.id
                    ? "bg-orange-50 border-2 border-orange-500"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <div className={`${selectedCategory === category.id ? "text-orange-500" : "text-gray-700"}`}>
                  {category.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">{category.name}</span>
                <span className="text-xs text-gray-500">{category.count} items</span>
              </button>
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Products</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search Product"
                className="pl-10 bg-white border border-gray-300 rounded-lg text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="w-full h-24 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-medium">{product.category}</p>
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2">{product.name}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div>
                      {product.price > 0 && <p className="text-sm font-bold text-gray-900">${product.price}</p>}
                      <p className="text-xs text-gray-500">{product.quantity} Pcs</p>
                    </div>
                    {product.price > 0 && (
                      <span className="text-xs font-semibold text-green-600">${product.price * product.quantity}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
