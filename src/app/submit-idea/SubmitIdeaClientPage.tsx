"use client"
import { LightbulbIcon, Upload } from "lucide-react"
import { useState, useRef } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ideaSubmissionSchema } from "./ideaSchema";

export default function SubmitIdeaClientPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: '',
    course: '',
    institution: '',
    idea_caption: '',
    description: '',
    consent: false
  });
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Filter files larger than 10MB
      const validFiles = filesArray.filter(file => file.size <= 10 * 1024 * 1024);
      
      if (validFiles.length < filesArray.length) {
        toast({
          title: "File size exceeded",
          description: "Some files were larger than 10MB and were not selected.",
          variant: "destructive"
        });
      }
      
      setSelectedFiles(validFiles);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Client-side Zod validation
    const parsed = ideaSubmissionSchema.safeParse(formData);
    if (!parsed.success) {
      setFormErrors(parsed.error.flatten().fieldErrors);
      toast({
        title: "Validation Error",
        description: "Please correct the highlighted fields.",
        variant: "destructive"
      });
      return;
    } else {
      setFormErrors({});
    }

    if (!formData.consent) {
      toast({
        title: "Consent required",
        description: "Please agree to the privacy policy to submit your idea.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submissionData = new FormData();
      
      // Append form data
      Object.entries(formData).forEach(([key, value]) => {
        submissionData.append(key, value.toString());
      });
      
      // Append files
      selectedFiles.forEach(file => {
        submissionData.append('files', file);
      });
      
      const response = await fetch('/api/submit-idea', {
        method: 'POST',
        body: submissionData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit idea');
      }
      
      toast({
        title: "Idea submitted successfully!",
        description: "We'll review your submission and get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        role: '',
        course: '',
        institution: '',
        idea_caption: '',
        description: '',
        consent: false
      });
      setSelectedFiles([]);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your idea. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="bg-[#0a1e42] py-12 text-white md:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-sky-500/20 p-3">
                  <LightbulbIcon className="h-8 w-8 text-sky-400" />
                </div>
              </div>
              <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Got an idea for a better, <br></br> tech-enabled justice system?
              </h1>
              <p className="text-lg text-gray-200">
              Drop it on the Idea Board — every great change starts with a single seed.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <Card className="border-2">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl text-[#0a1e42]">Idea Submission Form</CardTitle>
                  <CardDescription>
                    Fill out the form below to share your ideas for improving online dispute resolution.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name" 
                          required 
                        />
                        {formErrors.name && (
                          <p className="text-xs text-red-600">{formErrors.name[0]}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          name="email"
                          type="email" 
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email address" 
                          required 
                        />
                        {formErrors.email && (
                          <p className="text-xs text-red-600">{formErrors.email[0]}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Mobile Number</Label>
                      <Input 
                        id="phone" 
                        name="phone"
                        type="tel" 
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your mobile number" 
                        required
                      />
                      {formErrors.phone && (
                        <p className="text-xs text-red-600">{formErrors.phone[0]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Residential Address</Label>
                      <Input 
                        id="address" 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your residential address" 
                        required
                      />
                      {formErrors.address && (
                        <p className="text-xs text-red-600">{formErrors.address[0]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Are you a</Label>
                      <select
                        id="role"
                        name="role"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>Select your role</option>
                        <option value="law">Law Enthusiast</option>
                        <option value="tech">Tech Enthusiast</option>
                        <option value="researcher">Researcher</option>
                      </select>
                      {formErrors.role && (
                        <p className="text-xs text-red-600">{formErrors.role[0]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="course">Course pursued or Pursuing</Label>
                      <Input 
                        id="course" 
                        name="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        placeholder="Write the name of the Course" 
                        required={formData.role === "student"}
                        disabled={formData.role !== "student"}
                      />
                      {formErrors.course && (
                        <p className="text-xs text-red-600">{formErrors.course[0]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="institution">Name of the Institution (if student)</Label>
                      <Input 
                        id="institution" 
                        name="institution"
                        value={formData.institution}
                        onChange={handleInputChange}
                        placeholder="Enter institution name"
                        required={formData.role === "student"}
                        disabled={formData.role !== "student"}
                      />
                      {formErrors.institution && (
                        <p className="text-xs text-red-600">{formErrors.institution[0]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="idea_caption">Caption for Your Idea</Label>
                      <Input
                        id="idea_caption"
                        name="idea_caption"
                        value={formData.idea_caption}
                        onChange={handleInputChange}
                        placeholder="Eg. Succession Disputes, Contract Disputes, etc."
                        required
                      />
                      {formErrors.idea_caption && (
                        <p className="text-xs text-red-600">{formErrors.idea_caption[0]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Briefly describe your concept, specifying the area of dispute it addresses and your vision for designing an ODR system to resolve it.
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Please describe your idea in detail..."
                        className="min-h-[150px]"
                        required
                      />
                      {formErrors.description && (
                        <p className="text-xs text-red-600">{formErrors.description[0]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="file">Supporting Documents (Optional)</Label>
                      <div className="rounded-lg border border-dashed border-gray-300 p-6">
                        <div className="flex flex-col items-center justify-center space-y-2 text-center">
                          <Upload className="h-8 w-8 text-gray-400" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-[#0a1e42]">
                              Drag & drop files here or click to browse
                            </p>
                            <p className="text-xs text-gray-500">
                              Supports images, videos, and PDFs (Max file size: 10MB)
                            </p>
                          </div>
                          <Input 
                            ref={fileInputRef}
                            id="file" 
                            type="file" 
                            className="hidden" 
                            accept="image/*,video/*,.pdf" 
                            multiple 
                            onChange={handleFileChange}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Select Files
                          </Button>
                          {selectedFiles.length > 0 && (
                            <div className="mt-3 w-full">
                              <p className="text-sm font-medium text-[#0a1e42]">{selectedFiles.length} file(s) selected</p>
                              <ul className="mt-2 max-h-32 overflow-y-auto text-left text-xs text-gray-500">
                                {selectedFiles.map((file, index) => (
                                  <li key={index} className="truncate">
                                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="consent" 
                        name="consent"
                        checked={formData.consent}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 rounded border-gray-300" 
                        required 
                      />
                      <Label htmlFor="consent" className="text-sm">
                        I agree to the processing of my personal data in accordance with the{" "}
                        <a href="/privacy-policy" className="text-sky-600 hover:underline">
                          Privacy Policy
                        </a>
                      </Label>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-[#0a1e42] hover:bg-[#263e69]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Your Idea"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="mt-12 rounded-lg bg-gray-50 p-6">
                <h3 className="mb-4 text-xl font-bold text-[#0a1e42]">What happens next?</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0a1e42] text-white">
                      <span className="text-sm">1</span>
                    </div>
                    <p className="text-gray-700">
                      Join the ODR Lab and discuss your innovative ideas with your peers.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0a1e42] text-white">
                      <span className="text-sm">2</span>
                    </div>
                    <p className="text-gray-700">
                      Connect with ODR Mentors.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0a1e42] text-white">
                      <span className="text-sm">3</span>
                    </div>
                    <p className="text-gray-700">
                     Be Ready to Innovate, Impact and Inspire.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
