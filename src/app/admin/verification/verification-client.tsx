/**
 * Admin Verification Queue Client Component
 * Approve/reject contractors, review documents
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  Shield,
  AlertTriangle,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Props {
  pending: any[];
  recentlyVerified: any[];
}

type Tab = "pending" | "verified";

export default function VerificationQueueClient({
  pending,
  recentlyVerified,
}: Props) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [selectedContractor, setSelectedContractor] = useState<any>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  async function handleVerify(id: string, action: "VERIFIED" | "REJECTED") {
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/verify/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: action,
          isVerified: action === "VERIFIED",
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast({
        title: action === "VERIFIED" ? "Contractor Verified" : "Contractor Rejected",
        description: "Status updated successfully.",
        variant: action === "VERIFIED" ? "success" : "error",
      });

      // Refresh the page
      window.location.reload();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update verification status.",
        variant: "error",
      });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="container-content py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Verification Queue
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Review and manage contractor verification requests
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card-base p-4">
            <p className="text-xs text-text-muted mb-1">Pending Review</p>
            <p className="text-2xl font-bold text-warning">
              {pending.filter((c) => c.verificationStatus === "PENDING").length}
            </p>
          </div>
          <div className="card-base p-4">
            <p className="text-xs text-text-muted mb-1">Documents Uploaded</p>
            <p className="text-2xl font-bold text-primary">
              {pending.filter((c) => c.verificationStatus === "DOCUMENTS_UPLOADED").length}
            </p>
          </div>
          <div className="card-base p-4">
            <p className="text-xs text-text-muted mb-1">Under Review</p>
            <p className="text-2xl font-bold text-secondary">
              {pending.filter((c) => c.verificationStatus === "UNDER_REVIEW").length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border">
          {[
            { id: "pending" as Tab, label: `Pending (${pending.length})` },
            { id: "verified" as Tab, label: `Recently Verified (${recentlyVerified.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted hover:text-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "pending" && (
          <div className="space-y-4">
            {pending.length === 0 ? (
              <div className="card-base p-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
                <p className="text-lg font-medium">All caught up!</p>
                <p className="text-sm text-text-muted">
                  No contractors awaiting verification.
                </p>
              </div>
            ) : (
              pending.map((contractor) => (
                <div
                  key={contractor.id}
                  className="card-base overflow-hidden"
                >
                  {/* Summary row */}
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-surface-muted/50"
                    onClick={() =>
                      setExpandedId(
                        expandedId === contractor.id ? null : contractor.id
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          contractor.verificationStatus === "PENDING"
                            ? "bg-warning"
                            : contractor.verificationStatus ===
                                "DOCUMENTS_UPLOADED"
                              ? "bg-primary"
                              : "bg-secondary"
                        }`}
                      />
                      <div>
                        <p className="font-medium">{contractor.businessName}</p>
                        <p className="text-xs text-text-muted">
                          {contractor.city}, {contractor.state} ·{" "}
                          {contractor.yearsInBusiness} years in business ·{" "}
                          Status: {contractor.verificationStatus.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-muted">
                        {new Date(contractor.createdAt).toLocaleDateString()}
                      </span>
                      {expandedId === contractor.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>

                  {/* Expanded details */}
                  {expandedId === contractor.id && (
                    <div className="border-t px-4 py-4 space-y-4">
                      {/* Documents */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          Documents
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-surface-muted p-3 rounded-lg">
                            <p className="text-xs text-text-muted">
                              License Number
                            </p>
                            <p className="font-mono text-sm">
                              {contractor.licenseNumber || "Not provided"}
                            </p>
                            {contractor.licenseState && (
                              <p className="text-xs text-text-muted">
                                State: {contractor.licenseState}
                              </p>
                            )}
                          </div>
                          <div className="bg-surface-muted p-3 rounded-lg">
                            <p className="text-xs text-text-muted">
                              Insurance
                            </p>
                            <p className="text-sm">
                              {contractor.insuranceFile
                                ? "Uploaded ✓"
                                : "Not uploaded"}
                            </p>
                            {contractor.insuranceExpiry && (
                              <p className="text-xs text-text-muted">
                                Expires:{" "}
                                {new Date(
                                  contractor.insuranceExpiry
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleVerify(contractor.id, "VERIFIED")
                          }
                          disabled={loading === contractor.id}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          {loading === contractor.id
                            ? "Processing..."
                            : "Approve & Verify"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleVerify(contractor.id, "REJECTED")
                          }
                          disabled={loading === contractor.id}
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                          View Profile
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "verified" && (
          <div className="space-y-3">
            {recentlyVerified.map((contractor) => (
              <div
                key={contractor.id}
                className="card-base p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <div>
                    <p className="font-medium">{contractor.businessName}</p>
                    <p className="text-xs text-text-muted">
                      {contractor.city}, {contractor.state}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-text-muted">
                  Verified{" "}
                  {contractor.verifiedAt
                    ? new Date(contractor.verifiedAt).toLocaleDateString()
                    : "recently"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
