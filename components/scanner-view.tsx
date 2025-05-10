"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, FlipHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import ProductForm from "./product-form"

export default function ScannerView() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [language, setLanguage] = useState("english")
  const [ocrProvider, setOcrProvider] = useState("microsoft")
  const [extractedData, setExtractedData] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleCapture = () => {
    // In a real app, this would access the camera
    // For demo purposes, we'll simulate capturing an image
    setIsScanning(true)

    setTimeout(() => {
      // Simulate OCR processing
      setCapturedImage("/placeholder.svg?height=400&width=300")
      setIsScanning(false)

      // Simulate extracted data
      setExtractedData({
        drugName: "Paracetamol",
        concentration: "500mg",
        expiryDate: "05/2025",
        batchNumber: "BN12345",
        price: "15.50",
      })

      toast({
        title: "Image processed",
        description: "Data extracted successfully",
      })
    }, 2000)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedImage(event.target.result as string)
          setIsScanning(true)

          // Simulate OCR processing
          setTimeout(() => {
            setIsScanning(false)
            setExtractedData({
              drugName: "Amoxicillin",
              concentration: "250mg",
              expiryDate: "12/2024",
              batchNumber: "LOT789012",
              price: "22.75",
            })

            toast({
              title: "Image processed",
              description: "Data extracted successfully",
            })
          }, 2000)
        }
      }

      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const lookupDrugCode = async () => {
    if (!extractedData?.drugName) return

    // Simulate API call to lookup drug code
    setIsScanning(true)

    setTimeout(() => {
      setIsScanning(false)
      setExtractedData({
        ...extractedData,
        drugCode: "PH12345",
      })

      toast({
        title: "Drug code retrieved",
        description: `Found code PH12345 for ${extractedData.drugName}`,
      })
    }, 1500)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="arabic">Arabic (العربية)</SelectItem>
                  <SelectItem value="both">Both Languages</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="ocr-provider">OCR Provider</Label>
              <Select value={ocrProvider} onValueChange={setOcrProvider}>
                <SelectTrigger id="ocr-provider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="microsoft">Microsoft OCR</SelectItem>
                  <SelectItem value="google">Google OCR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid place-items-center bg-muted rounded-lg h-[300px] mb-4">
            {capturedImage ? (
              <img
                src={capturedImage || "/placeholder.svg"}
                alt="Captured pharmaceutical label"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-center p-4">
                <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No image captured</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleCapture} disabled={isScanning}>
              <Camera className="mr-2 h-4 w-4" />
              Capture
            </Button>
            <Button variant="outline" onClick={triggerFileInput} disabled={isScanning}>
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
              Upload Image
            </Button>
            {capturedImage && (
              <Button variant="outline" onClick={() => setCapturedImage(null)}>
                <FlipHorizontal className="mr-2 h-4 w-4" />
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {extractedData && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Extracted Data</h3>
            <ProductForm initialData={extractedData} isProcessing={isScanning} onLookupDrugCode={lookupDrugCode} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
