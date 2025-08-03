"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Printer, Download, Eye } from "lucide-react"

interface ReceiptItem {
  quantity: number
  description: string
  unit_price: number
  total: number
}

interface ReceiptData {
  project_number: string
  customer_name: string
  customer_phone?: string
  customer_email?: string
  site_address: string
  date: string
  items: ReceiptItem[]
  labor_cost: number
  manual_cost: number
  total_cost: number
}

interface ReceiptTemplateProps {
  receiptData: ReceiptData
  companyLogo?: string
}

export function ReceiptTemplate({ receiptData, companyLogo }: ReceiptTemplateProps) {
  const [showPreview, setShowPreview] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Generate PDF download logic here
    console.log('Downloading receipt as PDF...')
  }

  return (
    <>
      <div className="flex gap-2">
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="hover:bg-blue-600 hover:text-white">
              <Eye className="mr-1 h-3 w-3" />
              Preview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Receipt Preview</DialogTitle>
              <DialogDescription>
                Receipt for Project {receiptData.project_number}
              </DialogDescription>
            </DialogHeader>
            <ReceiptContent receiptData={receiptData} companyLogo={companyLogo} />
            <div className="flex gap-2 mt-4">
              <Button onClick={handlePrint} className="flex-1">
                <Printer className="mr-2 h-4 w-4" />
                Print Receipt
              </Button>
              <Button onClick={handleDownload} variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button variant="outline" size="sm" onClick={handlePrint} className="hover:bg-green-600 hover:text-white">
          <Printer className="mr-1 h-3 w-3" />
          Print
        </Button>
      </div>
    </>
  )
}

function ReceiptContent({ receiptData, companyLogo }: ReceiptTemplateProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto bg-white print:shadow-none">
      <CardContent className="p-8 print:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              OVERHEAD ALUMINUM WORKSHOP
            </h1>
            <div className="text-gray-600 space-y-1">
              <p className="font-semibold">Mobile: 077 902889 / 031 902889 / 074 902889</p>
              <p>5c Hill Cot Road</p>
            </div>
          </div>
          
          <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            {companyLogo ? (
              <img 
                src={companyLogo} 
                alt="Company Logo" 
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <div className="text-center text-xs text-gray-500">
                <p>Company</p>
                <p>Logo</p>
              </div>
            )}
          </div>
        </div>

        {/* Invoice Title and Details */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">INVOICE</h2>
        </div>

        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <div className="border-b border-gray-300 pb-2 mb-4">
              <p className="text-sm text-gray-600">Bill To:</p>
              <p className="font-semibold text-gray-900">{receiptData.customer_name}</p>
              {receiptData.customer_phone && (
                <p className="text-sm text-gray-600">{receiptData.customer_phone}</p>
              )}
              {receiptData.customer_email && (
                <p className="text-sm text-gray-600">{receiptData.customer_email}</p>
              )}
              <p className="text-sm text-gray-600">{receiptData.site_address}</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600">Date: {receiptData.date}</p>
            <p className="text-sm text-gray-600">Invoice #: {receiptData.project_number}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                  Quantity
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                  Description
                </th>
                <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                  Unit Price
                </th>
                <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {receiptData.items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    {item.description}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right">
                    {item.unit_price.toLocaleString('en-SL', {
                      style: 'currency',
                      currency: 'SLE',
                      minimumFractionDigits: 2
                    })}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-semibold">
                    {item.total.toLocaleString('en-SL', {
                      style: 'currency',
                      currency: 'SLE',
                      minimumFractionDigits: 2
                    })}
                  </td>
                </tr>
              ))}
              
              {/* Labor Cost Row */}
              {receiptData.labor_cost > 0 && (
                <tr className="bg-blue-50">
                  <td className="border border-gray-300 px-4 py-3 text-center">1</td>
                  <td className="border border-gray-300 px-4 py-3 font-semibold">Labor Cost</td>
                  <td className="border border-gray-300 px-4 py-3 text-right">
                    {receiptData.labor_cost.toLocaleString('en-SL', {
                      style: 'currency',
                      currency: 'SLE',
                      minimumFractionDigits: 2
                    })}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-semibold">
                    {receiptData.labor_cost.toLocaleString('en-SL', {
                      style: 'currency',
                      currency: 'SLE',
                      minimumFractionDigits: 2
                    })}
                  </td>
                </tr>
              )}
              
              {/* Manual Cost Row */}
              {receiptData.manual_cost > 0 && (
                <tr className="bg-yellow-50">
                  <td className="border border-gray-300 px-4 py-3 text-center">1</td>
                  <td className="border border-gray-300 px-4 py-3 font-semibold">Additional Costs</td>
                  <td className="border border-gray-300 px-4 py-3 text-right">
                    {receiptData.manual_cost.toLocaleString('en-SL', {
                      style: 'currency',
                      currency: 'SLE',
                      minimumFractionDigits: 2
                    })}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-semibold">
                    {receiptData.manual_cost.toLocaleString('en-SL', {
                      style: 'currency',
                      currency: 'SLE',
                      minimumFractionDigits: 2
                    })}
                  </td>
                </tr>
              )}
              
              {/* Total Row */}
              <tr className="bg-gray-100 font-bold">
                <td colSpan={3} className="border border-gray-300 px-4 py-4 text-right text-lg">
                  TOTAL:
                </td>
                <td className="border border-gray-300 px-4 py-4 text-right text-xl font-bold text-blue-600">
                  {receiptData.total_cost.toLocaleString('en-SL', {
                    style: 'currency',
                    currency: 'SLE',
                    minimumFractionDigits: 2
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 border-t pt-4">
          <p>Thank you for your business!</p>
          <p className="mt-2">For any inquiries, please contact us at the numbers above.</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Utility function to generate receipt data from project
export function generateReceiptData(project: any, budgetItems: any[]): ReceiptData {
  const items: ReceiptItem[] = budgetItems.map(item => ({
    quantity: item.quantity,
    description: item.item_name,
    unit_price: item.unit_price,
    total: item.total_price
  }))

  return {
    project_number: project.project_number,
    customer_name: project.customer?.full_name || 'Unknown Customer',
    customer_phone: project.customer?.phone_number,
    customer_email: project.customer?.email,
    site_address: project.site?.site_address || 'Site address not provided',
    date: new Date().toLocaleDateString('en-GB'),
    items,
    labor_cost: project.labor_cost || 0,
    manual_cost: project.manual_cost || 0,
    total_cost: project.total_project_cost || 0
  }
}
