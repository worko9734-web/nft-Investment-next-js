"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Copy,
  Check,
  Upload,
  ArrowRight,
  Building,
  CreditCard,
  Receipt,
  Smartphone,
  Banknote,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { redirect } from "next/navigation"
import SuccessAlert from "@/components/success-alert"
import { useUser } from "@/app/context/UserContext"
import DashboardLayout from "@/components/DashboardLayout"

export default function DepositPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedMethod, setSelectedMethod] = useState("")
  const [copiedField, setCopiedField] = useState("")
  const [amount, setAmount] = useState("")
  const [method_name, setMethodName] = useState("")
  const [uploadedFile, setUploadedFile] = useState(null)

  const paymentMethods = {
    UBL: {
      name: "MEEZAN DIGITAL BANK",
      icon: <Building className="h-6 w-6" />,
      accountNumber: "00300112211311",
      accountTitle: "MUHAMMAD RAEES",
      ibanNumber: "PK08MEZN0000300112211311",
      color: "bg-blue-600",
    },
    "Jazz Cash": {
      name: "Jazz Cash",
      icon: <Smartphone className="h-6 w-6" />,
      accountNumber: "03297317417",
      accountTitle: "Nauman Shah",
      ibanNumber: "N/A",
      color: "bg-orange-600",
    },
    Easypaisa: {
      name: "Easypaisa",
      icon: <Smartphone className="h-6 w-6" />,
      accountNumber: "03241708868",
      accountTitle: "M.abbas",
      ibanNumber: "N/A",
      color: "bg-green-600",
    },
  }

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(""), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleMethodSelect = (method) => {
    setSelectedMethod(method)
    setMethodName(method)
  }

  const { token } = useUser();

  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState({})

  const handleSubmit = async () => {
    if (!amount || !uploadedFile) {
      alert("Please enter amount and upload receipt")
      return
    }

    try {
      const formData = new FormData()
      formData.append("login_token", token)
      formData.append("amount", amount)
      formData.append("is_mine", 0)
      formData.append("payment_proof", uploadedFile)
      formData.append("method_name", selectedMethod)

      const res = await fetch("https://stocktitan.site/api/deposit", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        setOpen(true)
        setMessage({
          title: "Success",
          desc: data.message || "Deposit request submitted successfully!",
          type: "success",
        })
        setTimeout(() => {
          setOpen(false)
          redirect("/dashboard/deposit/log")
        }, 3000)
      } else {
        alert(data.message || "Something went wrong")
      }
    } catch (error) {
      console.error("Error submitting deposit:", error)
      alert("Failed to submit deposit")
    }
  }

  const getStepIcon = (step) => {
    switch (step) {
      case 1:
        return <Banknote className="h-5 w-5" />
      case 2:
        return <Building className="h-5 w-5" />
      case 3:
        return <CreditCard className="h-5 w-5" />
      case 4:
        return <Receipt className="h-5 w-5" />
      default:
        return null
    }
  }

  const getStepTitle = (step) => {
    switch (step) {
      case 1:
        return "Select Method"
      case 2:
        return selectedMethod ? `${selectedMethod} Details` : "Payment Details"
      case 3:
        return "Enter Amount"
      case 4:
        return "Upload Receipt"
      default:
        return ""
    }
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-green-900 p-4 pb-30">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800/50"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">Deposit Funds</h1>
              <p className="text-gray-400 text-sm">
                Step {currentStep} of 4{selectedMethod && <span className="text-emerald-400"> • {selectedMethod}</span>}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step <= currentStep ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-400"
                      }`}
                  >
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-12 h-1 mx-1 ${step < currentStep ? "bg-emerald-600" : "bg-gray-700"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Method</span>
              <span>Details</span>
              <span>Amount</span>
              <span>Receipt</span>
            </div>
          </div>

          {/* Main Card */}
          <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {getStepIcon(currentStep)}
                {getStepTitle(currentStep)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentStep === 1 && (
                <div className="space-y-4">
                  <p className="text-gray-400 text-sm mb-4">Choose your preferred payment method</p>

                  <div className="grid gap-3">
                    {Object.entries(paymentMethods).map(([key, method]) => (
                      <div
                        key={key}
                        onClick={() => handleMethodSelect(key)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedMethod === key
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${method.color} text-white`}>{method.icon}</div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold">{method.name}</h3>
                            <p className="text-gray-400 text-sm">{key === "UBL" ? "Bank Transfer" : "Mobile Wallet"}</p>
                          </div>
                          {selectedMethod === key && <Check className="h-5 w-5 text-emerald-400" />}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={handleNext}
                    disabled={!selectedMethod}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 mt-6 disabled:opacity-50"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}

              {currentStep === 2 && selectedMethod && (
                <div className="space-y-4">
                  <p className="text-gray-400 text-sm mb-4">Copy these {selectedMethod} details to make your deposit</p>

                  {/* Account Number */}
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-400 text-sm">
                          {selectedMethod === "UBL" ? "Account Number" : "Mobile Number"}
                        </Label>
                        <p className="text-white font-semibold text-xs font-mono">
                          {paymentMethods[selectedMethod].accountNumber}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(paymentMethods[selectedMethod].accountNumber, "accountNumber")}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-green-950"
                      >
                        {copiedField === "accountNumber" ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Account Title */}
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-400 text-sm">Account Title</Label>
                        <p className="text-white font-semibold text-xs">{paymentMethods[selectedMethod].accountTitle}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(paymentMethods[selectedMethod].accountTitle, "accountTitle")}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-green-950"
                      >
                        {copiedField === "accountTitle" ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* IBAN Number (only for UBL) */}
                  {selectedMethod === "UBL" && (
                    <div className="bg-gray-800/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-gray-400 text-sm">IBAN Number</Label>
                          <p className="text-white font-semibold text-xs font-mono">
                            {paymentMethods[selectedMethod].ibanNumber}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(paymentMethods[selectedMethod].ibanNumber, "ibanNumber")}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-green-950"
                        >
                          {copiedField === "ibanNumber" ? (
                            <Check className="h-4 w-4 text-green-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setCurrentStep(1)}
                      variant="outline"
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 bg-green-700"
                    >
                      Back
                    </Button>
                    <Button onClick={handleNext} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Enter Amount (previously Step 2) */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <p className="text-gray-400 text-sm">Enter the amount you want to deposit</p>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Deposit Amount (PKR)</Label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 text-xs h-12"
                    />
                  </div>

                  {amount && (
                    <div className="bg-emerald-600/20 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Amount to Transfer:</span>
                        <span className="text-emerald-400 font-bold text-xs">PKR {amount}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setCurrentStep(2)}
                      variant="outline"
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 bg-green-700"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!amount}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Upload Receipt (previously Step 3) */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <p className="text-gray-400 text-sm">Upload your payment receipt to complete the deposit</p>

                  {/* Amount Summary */}
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Payment Method:</span>
                      <span className="text-white font-bold">{selectedMethod}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Deposit Amount:</span>
                      <span className="text-white font-bold">PKR {amount}</span>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label className="text-gray-300">Payment Receipt</Label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-gray-600 transition-colors">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="receipt-upload"
                      />
                      <label htmlFor="receipt-upload" className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <div className="text-gray-400">
                          <span className="text-emerald-400 hover:text-emerald-300">Click to upload</span>
                        </div>
                        <p className="text-sm text-gray-500">PNG, JPG, PDF</p>
                      </label>
                    </div>

                    {uploadedFile && (
                      <div className="bg-gray-800/30 rounded-lg p-3 flex items-center gap-3">
                        <Receipt className="h-5 w-5 text-green-400" />
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{uploadedFile.name}</p>
                          <p className="text-gray-400 text-xs">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400">Uploaded</Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setCurrentStep(3)}
                      variant="outline"
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 bg-green-700"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!uploadedFile}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <SuccessAlert open={open} message={message} />
          {/* Help Text */}
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">Need help? Contact support for assistance</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
