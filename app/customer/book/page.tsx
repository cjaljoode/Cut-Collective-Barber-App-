"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  X,
  Calendar,
  User,
  Scissors,
  MapPin
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

interface ReferenceImage {
  id: string
  url: string
  title: string
  tags: string[]
  barber?: string
}

// Pre-existing cuts gallery
const preExistingCuts: ReferenceImage[] = [
  {
    id: "1",
    url: "/api/placeholder/400/500",
    title: "Classic Skin Fade",
    tags: ["Fade", "Short", "Modern"],
    barber: "John Doe"
  },
  {
    id: "2",
    url: "/api/placeholder/400/500",
    title: "Textured Crop",
    tags: ["Textured", "Medium", "Stylish"],
    barber: "Sarah Smith"
  },
  {
    id: "3",
    url: "/api/placeholder/400/500",
    title: "Design Fade",
    tags: ["Design", "Fade", "Custom"],
    barber: "Mike Johnson"
  },
  {
    id: "4",
    url: "/api/placeholder/400/500",
    title: "Taper Fade",
    tags: ["Taper", "Professional", "Clean"],
    barber: "Alex Brown"
  },
  {
    id: "5",
    url: "/api/placeholder/400/500",
    title: "Long Hair Styling",
    tags: ["Long", "Styling", "Elegant"],
    barber: "Chris Wilson"
  },
  {
    id: "6",
    url: "/api/placeholder/400/500",
    title: "Beard Trim & Shape",
    tags: ["Beard", "Trim", "Shape"],
    barber: "John Doe"
  },
  {
    id: "7",
    url: "/api/placeholder/400/500",
    title: "Pompadour",
    tags: ["Classic", "Pompadour", "Vintage"],
    barber: "Sarah Smith"
  },
  {
    id: "8",
    url: "/api/placeholder/400/500",
    title: "Undercut",
    tags: ["Undercut", "Modern", "Sharp"],
    barber: "Mike Johnson"
  },
]

interface BookingData {
  shop: string
  barber: string
  service: string
  date: string
  time: string
  referenceImage: ReferenceImage | null
  uploadedImage: File | null
  notes: string
}

export default function BookAppointmentPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedImage, setSelectedImage] = useState<ReferenceImage | null>(null)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedShop, setSelectedShop] = useState("")
  const [selectedBarber, setSelectedBarber] = useState("")
  const [selectedService, setSelectedService] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [notes, setNotes] = useState("")

  const totalSteps = 4

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedImage(file)
      setSelectedImage(null) // Clear pre-selected image
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSelectPreExisting = (image: ReferenceImage) => {
    setSelectedImage(image)
    setUploadedImage(null)
    setImagePreview(null)
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setUploadedImage(null)
    setImagePreview(null)
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // In a real app, this would submit to your backend
    const bookingData: BookingData = {
      shop: selectedShop,
      barber: selectedBarber,
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      referenceImage: selectedImage,
      uploadedImage: uploadedImage,
      notes: notes
    }
    
    console.log("Booking submitted:", bookingData)
    alert("Appointment booked successfully! Your reference image has been sent to the barber.")
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedShop && selectedBarber && selectedService
      case 2:
        return selectedImage || uploadedImage
      case 3:
        return selectedDate && selectedTime
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Link href="/customer" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-foreground mb-2">Book Appointment</h1>
        <p className="text-muted-foreground">Schedule your next cut in a few simple steps</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  step === currentStep
                    ? "bg-primary text-primary-foreground"
                    : step < currentStep
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {step < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step
                )}
              </div>
              <p className="text-xs mt-2 text-center text-muted-foreground">
                {step === 1 && "Shop & Service"}
                {step === 2 && "Reference Image"}
                {step === 3 && "Date & Time"}
                {step === 4 && "Confirm"}
              </p>
            </div>
            {step < totalSteps && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  step < currentStep ? "bg-primary" : "bg-secondary"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 1: Select Shop, Barber, and Service */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scissors className="h-5 w-5 mr-2" />
                  Select Shop & Service
                </CardTitle>
                <CardDescription>Choose your preferred barbershop and service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Shop</label>
                  <select
                    value={selectedShop}
                    onChange={(e) => setSelectedShop(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Choose a shop...</option>
                    <option value="elite-cuts">Elite Cuts Barbershop</option>
                    <option value="precision">Precision Barbers</option>
                    <option value="gentlemans">The Gentleman's Cut</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Select Barber</label>
                  <select
                    value={selectedBarber}
                    onChange={(e) => setSelectedBarber(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={!selectedShop}
                  >
                    <option value="">Choose a barber...</option>
                    {selectedShop && (
                      <>
                        <option value="john-doe">John Doe</option>
                        <option value="sarah-smith">Sarah Smith</option>
                        <option value="mike-johnson">Mike Johnson</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Select Service</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={!selectedBarber}
                  >
                    <option value="">Choose a service...</option>
                    <option value="haircut">Haircut - $25</option>
                    <option value="beard-trim">Beard Trim - $15</option>
                    <option value="haircut-beard">Haircut + Beard - $35</option>
                    <option value="fade">Fade - $30</option>
                    <option value="line-up">Line Up - $12</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Select Reference Image */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Reference Image
                </CardTitle>
                <CardDescription>
                  Upload a photo or select from our gallery to show your barber the style you want
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload Section */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Upload Your Own Image</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-sm font-medium text-foreground mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </label>
                  </div>
                </div>

                {/* Preview Uploaded Image */}
                {imagePreview && (
                  <div className="relative">
                    <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border">
                      <img
                        src={imagePreview}
                        alt="Uploaded preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Uploaded: {uploadedImage?.name}
                    </p>
                  </div>
                )}

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                {/* Pre-existing Gallery */}
                <div>
                  <label className="text-sm font-medium mb-4 block">Select from Gallery</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {preExistingCuts.map((cut) => (
                      <motion.button
                        key={cut.id}
                        onClick={() => handleSelectPreExisting(cut)}
                        className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage?.id === cut.id
                            ? "border-primary ring-2 ring-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <div className="text-4xl">✂️</div>
                        </div>
                        {selectedImage?.id === cut.id && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="bg-primary text-primary-foreground rounded-full p-2">
                              <Check className="h-6 w-6" />
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                          <p className="text-xs font-medium text-white text-left">{cut.title}</p>
                          <p className="text-xs text-white/70 text-left">{cut.barber}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Selected Image Info */}
                {(selectedImage || uploadedImage) && (
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {selectedImage ? selectedImage.title : "Your Uploaded Image"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {selectedImage
                            ? `By ${selectedImage.barber} • ${selectedImage.tags.join(", ")}`
                            : "This image will be sent to your barber"}
                        </p>
                      </div>
                      <button
                        onClick={handleRemoveImage}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Select Date & Time */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Select Date & Time
                </CardTitle>
                <CardDescription>Choose when you'd like your appointment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Select Time</label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"].map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          selectedTime === time
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border hover:bg-accent"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  Confirm Appointment
                </CardTitle>
                <CardDescription>Review your booking details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 rounded-lg border border-border">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Shop</p>
                      <p className="text-sm text-muted-foreground">{selectedShop}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 rounded-lg border border-border">
                    <User className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Barber</p>
                      <p className="text-sm text-muted-foreground">{selectedBarber}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 rounded-lg border border-border">
                    <Scissors className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Service</p>
                      <p className="text-sm text-muted-foreground">{selectedService}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 rounded-lg border border-border">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Date & Time</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedDate} at {selectedTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 rounded-lg border border-border">
                    <ImageIcon className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground mb-2">Reference Image</p>
                      {selectedImage && (
                        <div className="relative w-32 h-40 rounded-lg overflow-hidden border border-border">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <div className="text-2xl">✂️</div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                            <p className="text-xs text-white">{selectedImage.title}</p>
                          </div>
                        </div>
                      )}
                      {imagePreview && (
                        <div className="relative w-32 h-40 rounded-lg overflow-hidden border border-border">
                          <img
                            src={imagePreview}
                            alt="Reference"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Additional Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests or notes for your barber..."
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {currentStep < totalSteps ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90"
          >
            <Check className="h-4 w-4 mr-2" />
            Confirm Booking
          </Button>
        )}
      </div>
    </div>
  )
}

