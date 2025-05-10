"use client"

import { useState } from "react"
import { Search, Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// Sample data for demonstration
const SAMPLE_PRODUCTS = [
  {
    id: "1",
    drugName: "Paracetamol",
    drugCode: "PH12345",
    concentration: "500mg",
    expiryDates: ["05/2025", "08/2025"],
    batchNumbers: ["BN12345", "BN67890"],
    price: "15.50",
  },
  {
    id: "2",
    drugName: "Amoxicillin",
    drugCode: "PH23456",
    concentration: "250mg",
    expiryDates: ["12/2024"],
    batchNumbers: ["LOT789012"],
    price: "22.75",
  },
  {
    id: "3",
    drugName: "Ibuprofen",
    drugCode: "PH34567",
    concentration: "400mg",
    expiryDates: ["03/2025", "06/2025", "09/2025"],
    batchNumbers: ["BN24680", "BN13579", "BN97531"],
    price: "18.25",
  },
]

export default function ProductList() {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const filteredProducts = products.filter(
    (product) =>
      product.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.drugCode.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: string) => {
    setProducts(products.filter((product) => product.id !== id))
    toast({
      title: "Product deleted",
      description: "The product has been removed from the database",
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Pharmaceutical Products</CardTitle>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Drug Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Concentration</TableHead>
                  <TableHead>Expiry Dates</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.drugName}</TableCell>
                      <TableCell>{product.drugCode}</TableCell>
                      <TableCell>{product.concentration}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.expiryDates.map((date, index) => (
                            <Badge key={index} variant="outline" className="whitespace-nowrap">
                              {date} ({product.batchNumbers[index]})
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
