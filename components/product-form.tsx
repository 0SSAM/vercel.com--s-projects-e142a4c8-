"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Save, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProductFormProps {
  initialData: {
    drugName?: string
    drugCode?: string
    concentration?: string
    expiryDate?: string
    batchNumber?: string
    price?: string
  }
  isProcessing: boolean
  onLookupDrugCode: () => void
}

export default function ProductForm({ initialData, isProcessing, onLookupDrugCode }: ProductFormProps) {
  const [formData, setFormData] = useState(initialData)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // In a real app, this would save to a database
    toast({
      title: "Product saved",
      description: "The product data has been saved successfully",
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="drugName">Drug Name (اسم المستحضر)</Label>
          <Input
            id="drugName"
            name="drugName"
            value={formData.drugName || ""}
            onChange={handleChange}
            placeholder="Enter drug name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="drugCode">Drug Code (كود المستحضر)</Label>
          <div className="flex gap-2">
            <Input
              id="drugCode"
              name="drugCode"
              value={formData.drugCode || ""}
              onChange={handleChange}
              placeholder="Drug code"
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={onLookupDrugCode}
              disabled={isProcessing || !formData.drugName}
            >
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Code will be looked up from the database based on drug name</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="concentration">Concentration</Label>
          <Input
            id="concentration"
            name="concentration"
            value={formData.concentration || ""}
            onChange={handleChange}
            placeholder="e.g., 500mg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate || ""}
            onChange={handleChange}
            placeholder="MM/YYYY"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="batchNumber">Batch/Lot Number</Label>
          <Input
            id="batchNumber"
            name="batchNumber"
            value={formData.batchNumber || ""}
            onChange={handleChange}
            placeholder="e.g., BN12345"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            value={formData.price || ""}
            onChange={handleChange}
            placeholder="Enter price"
          />
        </div>
      </div>

      <Button onClick={handleSave} className="w-full">
        <Save className="mr-2 h-4 w-4" />
        Save Product
      </Button>
    </div>
  )
}
