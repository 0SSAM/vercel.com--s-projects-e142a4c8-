"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FileSpreadsheet, Download, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ExportView() {
  const [isExporting, setIsExporting] = useState(false)
  const [exportOptions, setExportOptions] = useState({
    includeAllBatches: true,
    separateExpiryColumns: true,
    includePrice: true,
    includeDrugCode: true,
  })
  const { toast } = useToast()

  const handleExport = () => {
    setIsExporting(true)

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false)
      toast({
        title: "Export complete",
        description: "Your data has been exported to Excel successfully",
      })
    }, 2000)
  }

  const handleOptionChange = (option: keyof typeof exportOptions) => {
    setExportOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }))
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
          <CardDescription>Export your pharmaceutical product data to Excel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeAllBatches"
                checked={exportOptions.includeAllBatches}
                onCheckedChange={() => handleOptionChange("includeAllBatches")}
              />
              <Label htmlFor="includeAllBatches">Include all batch numbers</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="separateExpiryColumns"
                checked={exportOptions.separateExpiryColumns}
                onCheckedChange={() => handleOptionChange("separateExpiryColumns")}
              />
              <Label htmlFor="separateExpiryColumns">Use separate columns for different expiry dates</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includePrice"
                checked={exportOptions.includePrice}
                onCheckedChange={() => handleOptionChange("includePrice")}
              />
              <Label htmlFor="includePrice">Include price information</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeDrugCode"
                checked={exportOptions.includeDrugCode}
                onCheckedChange={() => handleOptionChange("includeDrugCode")}
              />
              <Label htmlFor="includeDrugCode">Include drug codes</Label>
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={handleExport} disabled={isExporting} className="w-full">
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export to Excel
                </>
              )}
            </Button>
          </div>

          <div className="rounded-md bg-muted p-4 mt-4">
            <div className="flex">
              <FileSpreadsheet className="h-10 w-10 text-muted-foreground mr-3" />
              <div>
                <h4 className="font-medium">Excel Format Preview</h4>
                <p className="text-sm text-muted-foreground">Your export will include the following columns:</p>
                <ul className="text-xs text-muted-foreground mt-1 list-disc list-inside">
                  <li>Drug Name (اسم المستحضر)</li>
                  {exportOptions.includeDrugCode && <li>Drug Code (كود المستحضر)</li>}
                  <li>Concentration</li>
                  <li>Batch Number(s)</li>
                  <li>Expiry Date(s)</li>
                  {exportOptions.includePrice && <li>Price</li>}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Previous Exports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 border rounded-md">
              <div>
                <p className="font-medium">PharmaScan_Export_20240510.xlsx</p>
                <p className="text-xs text-muted-foreground">May 10, 2024 - 09:15 AM</p>
              </div>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between p-2 border rounded-md">
              <div>
                <p className="font-medium">PharmaScan_Export_20240505.xlsx</p>
                <p className="text-xs text-muted-foreground">May 5, 2024 - 02:30 PM</p>
              </div>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
