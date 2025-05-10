import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ScannerView from "@/components/scanner-view"
import ProductList from "@/components/product-list"
import ExportView from "@/components/export-view"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">PharmaScan</h1>
        <p className="text-muted-foreground">Pharmaceutical Product Scanner</p>
      </header>

      <Tabs defaultValue="scan" className="flex-1">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scan">Scan</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>
        <TabsContent value="scan" className="flex-1">
          <ScannerView />
        </TabsContent>
        <TabsContent value="products" className="flex-1">
          <ProductList />
        </TabsContent>
        <TabsContent value="export" className="flex-1">
          <ExportView />
        </TabsContent>
      </Tabs>
    </main>
  )
}
