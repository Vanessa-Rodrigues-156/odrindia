"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Mail} from "lucide-react";
import  {toast}  from "sonner";

function CompleteProfileClient() {
  const { user, completeProfile, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user data from URL params (for Google OAuth flow) or from auth context
  const [userDisplayData, setUserDisplayData] = useState({
    name: "",
    email: "",
    image: ""
  });

  const [formData, setFormData] = useState({
    contactNumber: "",
    city: "",
    country: "",
    userType: "",
    institution: "",
    highestEducation: "",
    odrLabUsage: "",
  });

  // --- FIX: Always show the form if Google OAuth params are present, even if user is null ---
  useEffect(() => {
    if (!searchParams) return;
    const emailFromParams = searchParams.get("email");
    const nameFromParams = searchParams.get("name");
    const imageFromParams = searchParams.get("image");
    const fromGoogle = searchParams.get("fromGoogle");

    if (fromGoogle === "true" && emailFromParams) {
      setUserDisplayData({
        name: nameFromParams || "",
        email: emailFromParams,
        image: imageFromParams || ""
      });
    } else if (user) {
      setUserDisplayData({
        name: user.name,
        email: user.email,
        image: user.imageAvatar || ""
      });
    }

    // Only redirect to home if user is fully authenticated and NOT in Google OAuth flow
    if (
      !loading &&
      user &&
      localStorage.getItem("token") &&
      user.contactNumber &&
      user.city &&
      user.country &&
      fromGoogle !== "true"
    ) {
      router.push("/home");
      return;
    }

    // Only redirect to sign-in if no user and not in Google OAuth flow
    if (!loading && !user && !emailFromParams) {
      router.push("/signin");
      return;
    }
  }, [user, loading, router, searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.contactNumber || !formData.city || !formData.country || !formData.userType) {
        throw new Error("Please fill in all required fields");
      }

      // For students, institution is required
      if (formData.userType === "student" && !formData.institution) {
        throw new Error("Institution is required for students");
      }

      const profileData = {
        userId: user?.id,
        email: userDisplayData.email, // Ensure email is always included
        name: userDisplayData.name,   // Ensure name is always included
        image: userDisplayData.image, // Include image if available
        ...formData,
      };

      console.log("Submitting profile data:", profileData);

      const result = await completeProfile(profileData);

      // Show success message
      toast.success("Profile completed!", {
        description: result.message || "Your profile has been successfully updated.",
        duration: 3000,
      });

      // Redirect to intended page or home
      const redirectTo = searchParams?.get("redirect") || "/home";
      setTimeout(() => {
        router.push(redirectTo);
      }, 1500);

    } catch (err) {
      console.error("Profile completion error:", err);
      setError(err instanceof Error ? err.message : "Failed to complete profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- FIX: Only block rendering if loading, not if user is null and Google params exist ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Only block rendering if neither user nor Google params are present
  const emailFromParams = searchParams?.get("email");
  if (!user && !emailFromParams) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Complete Your Profile</CardTitle>
            <p className="text-gray-600">Please provide additional information to complete your registration</p>
          </CardHeader>
          
          <CardContent>
            {/* User Info Display */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="font-medium">{userDisplayData.name}</span>
              </div>
              <p className="text-sm text-gray-600">{userDisplayData.email}</p>
              {userDisplayData.image && (
                <img 
                  src={userDisplayData.image} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full mt-2"
                />
              )}
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Number */}
              <div>
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                  placeholder="Your phone number"
                  required
                />
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Your city"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    placeholder="Your country"
                    required
                  />
                </div>
              </div>

              {/* User Type */}
              <div>
                <Label htmlFor="userType">I am a *</Label>
                <Select value={formData.userType} onValueChange={(value) => handleInputChange("userType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="professional">Legal Professional</SelectItem>
                    <SelectItem value="researcher">Researcher</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Institution (required for students) */}
              {formData.userType === "student" && (
                <div>
                  <Label htmlFor="institution">Institution *</Label>
                  <Input
                    id="institution"
                    value={formData.institution}
                    onChange={(e) => handleInputChange("institution", e.target.value)}
                    placeholder="Your university/college"
                    required
                  />
                </div>
              )}

              {/* Highest Education */}
              <div>
                <Label htmlFor="highestEducation">Highest Education</Label>
                <Select value={formData.highestEducation} onValueChange={(value) => handleInputChange("highestEducation", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="bachelors">Bachelor&apos;s Degree</SelectItem>
                    <SelectItem value="masters">Master&apos;s Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ODR Lab Usage */}
              <div>
                <Label htmlFor="odrLabUsage">How do you plan to use ODR Lab?</Label>
                <Textarea
                  id="odrLabUsage"
                  value={formData.odrLabUsage}
                  onChange={(e) => handleInputChange("odrLabUsage", e.target.value)}
                  placeholder="Tell us about your interests and how you plan to contribute..."
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                    Completing Profile...
                  </>
                ) : (
                  "Complete Profile"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    }>
      <CompleteProfileClient />
    </Suspense>
  );
}
