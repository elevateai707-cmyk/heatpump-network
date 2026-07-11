/**
 * Admin — Content Review Queue Client
 * Approve/reject/revise AI-generated content before it goes public
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  CheckCircle2, XCircle, Edit3, FileText, Clock, AlertTriangle,
  ChevronDown, ChevronUp, Search,
} from "lucide-react";

interface Props {
  pending: any[];
  recent: any[];
}

const CONTENT_TYPE_LABELS: Record<string, string> = {
  META_DESCRIPTION: "Meta Description",
  PAGE_INTRO: "Page Intro",
  GUIDE_ARTICLE: "Guide Article",
  FAQ_ANSWER: "FAQ Answer",
  CITY_INTRO: "City Intro",
  TOOL_COPY: "Tool Copy",
};

export default function ContentReviewClient({ pending, recent }: Props) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [revisedContent, setRevisedContent] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleReview(id: string, status: string, revised?: string) {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/content-review/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, revisedContent: revised }),
      });

      if (!res.ok) throw new Error("Failed");

      toast({
        title: status === "APPROVED" ? "Content Approved" : status === "REJECTED" ? "Content Rejected" : "Content Revised",
        variant: status === "APPROVED" ? "success" : status === "REJECTED" ? "error" : "warning",
        description: "Review complete.",
      });

      window.location.reload();
    } catch {
      toast({ title: "Error", description: "Failed to update review status", variant: "error" });
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="container-content py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Content Review Queue
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Review all AI-generated content before it becomes publicly visible
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card-base p-4">
            <p className="text-xs text-text-muted mb-1">Pending Review</p>
            <p className="text-2xl font-bold text-warning">{pending.length}</p>
          </div>
          <div className="card-base p-4">
            <p className="text-xs text-text-muted mb-1">Approved (30d)</p>
            <p className="text-2xl font-bold text-success">
              {recent.filter((r) => r.status === "APPROVED").length}
            </p>
          </div>
          <div className="card-base p-4">
            <p className="text-xs text-text-muted mb-1">Rejected (30d)</p>
            <p className="text-2xl font-bold text-danger">
              {recent.filter((r) => r.status === "REJECTED").length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "pending"
                ? "border-primary text-primary"
                : "border-transparent text-text-muted"
            }`}
          >
            Pending ({pending.length})
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "approved"
                ? "border-primary text-primary"
                : "border-transparent text-text-muted"
            }`}
          >
            Recently Reviewed ({recent.length})
          </button>
        </div>

        {activeTab === "pending" && (
          <div className="space-y-4">
            {pending.length === 0 ? (
              <div className="card-base p-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
                <p className="text-lg font-medium">All caught up!</p>
                <p className="text-sm text-text-muted">No AI-generated content awaiting review.</p>
              </div>
            ) : (
              pending.map((item) => {
                const isExpanded = expandedId === item.id;
                return (
                  <div key={item.id} className="card-base overflow-hidden">
                    <button
                      onClick={() => {
                        setExpandedId(isExpanded ? null : item.id);
                        setRevisedContent(item.content || "");
                      }}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-surface-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-warning" />
                        <div>
                          <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                            {CONTENT_TYPE_LABELS[item.contentType] || item.contentType}
                          </span>
                          <p className="font-medium mt-1">{item.title || "Untitled"}</p>
                          {item.targetUrl && (
                            <p className="text-xs text-text-muted">{item.targetUrl}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <Clock className="h-3 w-3" />
                        {new Date(item.createdAt).toLocaleDateString()}
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t p-4 space-y-4">
                        {/* Original content */}
                        <div>
                          <p className="text-xs font-medium text-text-muted mb-1">AI-Generated Content</p>
                          <div className="p-3 bg-surface-muted rounded-lg text-sm whitespace-pre-wrap">
                            {item.content}
                          </div>
                          {item.originalPrompt && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-text-muted mb-1">Original Prompt</p>
                              <p className="text-xs text-text-muted italic">{item.originalPrompt}</p>
                            </div>
                          )}
                        </div>

                        {/* Revised content */}
                        <div>
                          <p className="text-xs font-medium text-text-muted mb-1">Revised Content (editable)</p>
                          <textarea
                            value={revisedContent}
                            onChange={(e) => setRevisedContent(e.target.value)}
                            rows={5}
                            className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            disabled={loadingId === item.id}
                            onClick={() => handleReview(item.id, "APPROVED")}
                          >
                            <CheckCircle2 className="h-4 w-4" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={loadingId === item.id}
                            onClick={() => handleReview(item.id, "REVISED", revisedContent)}
                          >
                            <Edit3 className="h-4 w-4" /> Save Revision
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={loadingId === item.id}
                            onClick={() => handleReview(item.id, "REJECTED")}
                          >
                            <XCircle className="h-4 w-4" /> Reject
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === "approved" && (
          <div className="space-y-3">
            {recent.map((item) => (
              <div key={item.id} className="card-base p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.status === "APPROVED" ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : item.status === "REVISED" ? (
                    <Edit3 className="h-5 w-5 text-warning" />
                  ) : (
                    <XCircle className="h-5 w-5 text-danger" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{item.title || "Untitled"}</p>
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <span className="px-1.5 py-0.5 bg-surface-muted rounded">
                        {CONTENT_TYPE_LABELS[item.contentType] || item.contentType}
                      </span>
                      <span>{item.status}</span>
                      {item.reviewedAt && <span>· {new Date(item.reviewedAt).toLocaleDateString()}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
