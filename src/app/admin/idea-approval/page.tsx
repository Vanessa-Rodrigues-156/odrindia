"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IdeaSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  course?: string;
  institution?: string;
  ideaCaption: string;
  description: string;
  consent: boolean;
  approved: boolean;
  ideaId?: string;
  createdAt: string;
}

export default function AdminIdeaApprovalPage() {
  const [submissions, setSubmissions] = useState<IdeaSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/approve-idea")
      .then((res) => res.json())
      .then(setSubmissions)
      .finally(() => setLoading(false));
  }, []);

  const approveIdea = async (id: string) => {
    setApproving(id);
    const res = await fetch("/api/admin/approve-idea", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submissionId: id }),
    });
    if (res.ok) {
      setSubmissions((subs) => subs.filter((s) => s.id !== id));
    }
    setApproving(null);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">Pending Idea Submissions</h1>
      {submissions.length === 0 ? (
        <div>No pending submissions.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {submissions.map((s) => (
            <Card key={s.id}>
              <CardHeader>
                <CardTitle>{s.ideaCaption}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 font-semibold">By: {s.name} ({s.email})</div>
                <div className="mb-2">{s.description}</div>
                <div className="mb-2 text-sm text-gray-500">Submitted: {new Date(s.createdAt).toLocaleString()}</div>
                <Button onClick={() => approveIdea(s.id)} disabled={approving === s.id}>
                  {approving === s.id ? "Approving..." : "Approve"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
