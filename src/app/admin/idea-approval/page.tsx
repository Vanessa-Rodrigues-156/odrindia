"use client";
import AdminGuard from "@/components/guards/AdminGuard";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Search,
  AlertCircle,
  Calendar,
  User,
  MapPin,
  BookOpen,
  Clock,
  ArrowUpDown,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { format, formatDistanceToNow } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { apiFetch } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  country?: string | null;
  userType?: string | null;
  institution?: string | null;
}

interface IdeaSubmission {
  id: string;
  title: string;
  ideaCaption: string;
  description: string;
  odrExperience: string;
  consent: boolean;
  approved: boolean;
  ideaId?: string;
  createdAt: string;
  userId: string;
  user: User;
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminIdeaApprovalContent />
    </AdminGuard>
  );
}

function AdminIdeaApprovalContent() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<IdeaSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<
    IdeaSubmission[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"createdAt" | "title">(
    "createdAt"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedSubmission, setSelectedSubmission] =
    useState<IdeaSubmission | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Define fetchSubmissions with useCallback before useEffect
  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Fetching idea submissions...");
      const res = await apiFetch("/admin/approve-idea");
      console.log("Response status:", res.status);
      
      if (!res.ok) {
        console.error("Response not OK:", res.status, res.statusText);
        throw new Error(`Failed to fetch submissions: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log("Submissions fetched:", data.length);
      setSubmissions(data);
      setFilteredSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast({
        title: "Error",
        description: "Failed to load idea submissions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  useEffect(() => {
    // Filter and sort submissions
    let result = [...submissions];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (sub) =>
          sub.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.ideaCaption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply tab filter
    if (selectedTab === "recent") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      result = result.filter((sub) => new Date(sub.createdAt) >= oneWeekAgo);
    }

    // Sort submissions
    result.sort((a, b) => {
      if (sortField === "createdAt") {
        return sortDirection === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        const aValue = a[sortField] || "";
        const bValue = b[sortField] || "";
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
    });

    setFilteredSubmissions(result);
  }, [submissions, searchTerm, sortField, sortDirection, selectedTab]);

  const viewSubmissionDetails = (submission: IdeaSubmission) => {
    setSelectedSubmission(submission);
    setIsDetailsOpen(true);
  };

  const closeDetailsDialog = () => {
    setIsDetailsOpen(false);
    // Reset selected submission after dialog closes with a slight delay
    setTimeout(() => setSelectedSubmission(null), 300);
  };

  const approveIdea = async (id: string) => {
    setApproving(id);
    try {
      console.log("Approving idea with ID:", id);
      const res = await apiFetch("/admin/approve-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideaId: id }),
      });

      console.log("Approve response status:", res.status);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to approve idea");
      }

      // Update local state
      setSubmissions((subs) => subs.filter((s) => s.id !== id));

      // Close dialog if open
      if (isDetailsOpen && selectedSubmission?.id === id) {
        closeDetailsDialog();
      }

      toast({
        title: "Idea approved!",
        description:
          "The idea has been approved and is now live on the ODR Labs page.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error approving idea:", error);
      toast({
        title: "Approval failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to approve idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setApproving(null);
    }
  };

  // Loading state with animation
  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#0a1e42]"></div>
          <p className="text-lg text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  const toggleSort = (field: "createdAt" | "title") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="mb-1 text-2xl font-bold text-[#0a1e42]">
              Idea Submission Review
            </h1>
            <p className="text-gray-500">
              Review and approve submitted ideas to make them public
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search submissions..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchSubmissions()}
              className="h-10 w-10"
              title="Refresh submissions">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-refresh-cw">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="bg-gray-50 pb-2">
            <Tabs
              value={selectedTab}
              onValueChange={handleTabChange}
              className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-none">
                <TabsTrigger value="all">All Submissions</TabsTrigger>
                <TabsTrigger value="recent">Recent (Last 7 days)</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <div className="overflow-hidden">
            <div className="flex items-center justify-between border-b px-6 py-3 text-sm font-medium text-gray-500">
              <button
                onClick={() => toggleSort("title")}
                className="flex w-44 items-center transition hover:text-[#0a1e42]">
                Title
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </button>
              <button
                onClick={() => toggleSort("createdAt")}
                className="flex items-center transition hover:text-[#0a1e42]">
                Submission Date
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-4">
              {filteredSubmissions.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-lg text-center">
                  <AlertCircle className="mb-2 h-8 w-8 text-gray-400" />
                  <p className="text-lg font-medium text-gray-500">
                    No pending submissions found
                  </p>
                  <p className="text-sm text-gray-400">
                    {searchTerm
                      ? "Try adjusting your search criteria"
                      : "All submissions have been reviewed"}
                  </p>
                </div>
              ) : (
                <div className="grid gap-5">
                  <AnimatePresence initial={false}>
                    {filteredSubmissions.map((submission) => (
                      <motion.div
                        key={submission.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}>
                        <Card className="overflow-hidden border-l-4 border-l-[#0a1e42] hover:shadow-md">
                          <div className="grid grid-cols-1 md:grid-cols-12 md:divide-x">
                            <div className="col-span-9 space-y-4 p-5">
                              <div>
                                <Badge
                                  variant="info"
                                  className="mb-2">
                                  ID: {submission.id.slice(0, 8)}
                                </Badge>
                                <CardTitle className="mb-1 text-xl">
                                  {submission.title}
                                </CardTitle>
                                {submission.ideaCaption && (
                                  <CardDescription>
                                    {submission.ideaCaption}
                                  </CardDescription>
                                )}
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <h4 className="mb-1 font-medium text-[#0a1e42]">
                                    Description
                                  </h4>
                                  <p className="text-gray-600">
                                    {submission.description}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="mb-1 font-medium text-[#0a1e42]">
                                    ODR Experience
                                  </h4>
                                  <p className="text-gray-600">
                                    {submission.odrExperience}
                                  </p>
                                </div>
                              </div>{" "}
                              <div className="flex flex-wrap items-center gap-3 pt-2 text-sm">
                                <div className="flex items-center gap-1 text-gray-500">
                                  <User className="h-3 w-3" />
                                  <span>
                                    {submission.user?.name || "Anonymous"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-500">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-mail">
                                    <rect
                                      width="20"
                                      height="16"
                                      x="2"
                                      y="4"
                                      rx="2"
                                    />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                  </svg>
                                  <span>
                                    {submission.user?.email || "No email"}
                                  </span>
                                </div>
                                {submission.user?.country && (
                                  <div className="flex items-center gap-1 text-gray-500">
                                    <MapPin className="h-3 w-3" />
                                    <span>{submission.user.country}</span>
                                  </div>
                                )}
                                {submission.user?.userType === "student" &&
                                  submission.user?.institution && (
                                    <div className="flex items-center gap-1 text-gray-500">
                                      <BookOpen className="h-3 w-3" />
                                      <span>{submission.user.institution}</span>
                                    </div>
                                  )}
                              </div>
                            </div>

                            <div className="col-span-3 flex flex-col justify-between p-5">
                              <div>
                                <div className="mb-4 flex items-center gap-1 text-sm text-gray-500">
                                  <Calendar className="h-3 w-3" />
                                  <span>Submitted on</span>
                                </div>
                                <div className="font-medium">
                                  {format(
                                    new Date(submission.createdAt),
                                    "MMM dd, yyyy"
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {format(
                                    new Date(submission.createdAt),
                                    "h:mm a"
                                  )}
                                </div>
                                <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    {formatDistanceToNow(
                                      new Date(submission.createdAt)
                                    )}{" "}
                                    ago
                                  </span>
                                </div>
                              </div>

                              <div className="mt-4 space-y-2">
                                <Button
                                  className="w-full bg-[#0a1e42] hover:bg-[#162d5a]"
                                  onClick={() => approveIdea(submission.id)}
                                  disabled={approving === submission.id}>
                                  {approving === submission.id ? (
                                    <>
                                      <svg
                                        className="mr-2 h-4 w-4 animate-spin"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24">
                                        <circle
                                          className="opacity-25"
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          stroke="currentColor"
                                          strokeWidth="4"></circle>
                                        <path
                                          className="opacity-75"
                                          fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 className="mr-2 h-4 w-4" />
                                      Approve & Publish
                                    </>
                                  )}
                                </Button>
                                <Button
                                  className="w-full"
                                  variant="outline"
                                  onClick={() =>
                                    viewSubmissionDetails(submission)
                                  }>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Details Dialog */}
      <Dialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-2xl">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {selectedSubmission.title}
                </DialogTitle>
                <DialogDescription className="text-base">
                  {selectedSubmission.ideaCaption}
                </DialogDescription>
                <div className="mt-2 flex flex-wrap gap-2 text-sm">
                  <Badge variant="outline">ID: {selectedSubmission.id}</Badge>
                  <Badge variant="outline">
                    Submitted:{" "}
                    {format(new Date(selectedSubmission.createdAt), "PPp")}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="my-4 space-y-6">
                <div>
                  <h3 className="mb-2 font-medium text-[#0a1e42]">
                    Description
                  </h3>
                  <div className="rounded-md bg-gray-50 p-4 text-gray-700">
                    {selectedSubmission.description
                      .split("\n")
                      .map((paragraph, i) => (
                        <p
                          key={i}
                          className={i > 0 ? "mt-3" : ""}>
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-medium text-[#0a1e42]">
                    ODR Experience
                  </h3>
                  <div className="rounded-md bg-gray-50 p-4 text-gray-700">
                    {selectedSubmission.odrExperience
                      .split("\n")
                      .map((paragraph, i) => (
                        <p
                          key={i}
                          className={i > 0 ? "mt-3" : ""}>
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-2 font-medium text-[#0a1e42]">
                      Submission Details
                    </h3>
                    <div className="rounded-md bg-gray-50 p-4 text-sm">
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="font-medium text-gray-500">Status:</dt>
                          <dd>
                            <Badge
                              variant={
                                selectedSubmission.approved ? "success" : "info"
                              }>
                              {selectedSubmission.approved
                                ? "Approved"
                                : "Pending"}
                            </Badge>
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium text-gray-500">
                            Consent Given:
                          </dt>
                          <dd>{selectedSubmission.consent ? "Yes" : "No"}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-medium text-gray-500">
                            Submission Date:
                          </dt>
                          <dd>
                            {format(
                              new Date(selectedSubmission.createdAt),
                              "PPp"
                            )}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium text-[#0a1e42]">
                      Contact Information
                    </h3>
                    <div className="rounded-md bg-gray-50 p-4 text-sm">
                      <dl className="space-y-2">
                        {selectedSubmission.user?.name && (
                          <div className="flex items-start gap-2">
                            <dt className="font-medium text-gray-500">Name:</dt>
                            <dd>{selectedSubmission.user?.name}</dd>
                          </div>
                        )}
                        {selectedSubmission.user?.email && (
                          <div className="flex items-start gap-2">
                            <dt className="font-medium text-gray-500">
                              Email:
                            </dt>
                            <dd>{selectedSubmission.user?.email}</dd>
                          </div>
                        )}
                        {selectedSubmission.user?.country && (
                          <div className="flex items-start gap-2">
                            <dt className="font-medium text-gray-500">
                              Country:
                            </dt>
                            <dd>{selectedSubmission.user.country}</dd>
                          </div>
                        )}
                        {selectedSubmission.user?.userType === "student" &&
                          selectedSubmission.user?.institution && (
                            <div className="flex items-start gap-2">
                              <dt className="font-medium text-gray-500">
                                Institution:
                              </dt>
                              <dd>{selectedSubmission.user.institution}</dd>
                            </div>
                          )}
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
                  <Button
                    variant="outline"
                    onClick={closeDetailsDialog}>
                    Close
                  </Button>
                  <Button
                    className="bg-[#0a1e42] hover:bg-[#162d5a]"
                    disabled={approving === selectedSubmission.id}
                    onClick={() => approveIdea(selectedSubmission.id)}>
                    {approving === selectedSubmission.id ? (
                      <>
                        <svg
                          className="mr-2 h-4 w-4 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approve & Publish Idea
                      </>
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
