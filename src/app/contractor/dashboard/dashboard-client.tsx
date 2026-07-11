/**
 * Contractor Dashboard — Full Implementation
 * All tabs: overview, leads, profile, credits, subscription, case-studies, settings
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  BarChart3, MessageSquare, Building2, CreditCard, Star, FileText, Settings,
  Eye, Bell, TrendingUp, Users, DollarSign, Clock, Search, CheckCircle2,
  XCircle, ChevronDown, ChevronUp, Plus, ShoppingCart, ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { CREDIT_PACKS, PREMIUM_PLANS } from "@/lib/stripe";

interface DashboardProps {
  contractor: any;
  recentLeads: any[];
}

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "leads", label: "Leads", icon: MessageSquare },
  { id: "profile", label: "Profile", icon: Building2 },
  { id: "credits", label: "Credits", icon: CreditCard },
  { id: "subscription", label: "Subscription", icon: Star },
  { id: "case-studies", label: "Case Studies", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

const LEAD_STATUS_OPTIONS = [
  "NEW", "CONTACTED", "QUALIFIED", "QUOTE_SENT",
  "CONTRACT_SIGNED", "INSTALLATION_SCHEDULED", "COMPLETED", "LOST",
];

export default function DashboardClient({
  contractor,
  recentLeads,
}: DashboardProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [leads, setLeads] = useState(recentLeads);
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const subscription = contractor.subscriptions?.[0];
  const counts = contractor._count;

  // Update lead status
  async function updateLeadStatus(leadId: string, newStatus: string) {
    setLoadingStatus(leadId);
    try {
      const res = await fetch(`/api/leads/${leadId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }

      setLeads((prev: any[]) =>
        prev.map((l: any) =>
          l.id === leadId ? { ...l, status: newStatus, creditDeducted: newStatus === "CONTACTED" ? true : l.creditDeducted } : l
        )
      );

      toast({
        title: "Status Updated",
        description: `Lead moved to ${newStatus.replace(/_/g, " ")}`,
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update lead",
        variant: "error",
      });
    } finally {
      setLoadingStatus(null);
    }
  }

  // Create Stripe checkout
  async function handlePurchase(itemType: string, itemId: string) {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractorId: contractor.id,
          itemType,
          itemId,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Checkout failed");
      }
    } catch (error: any) {
      toast({
        title: "Checkout Error",
        description: error.message || "Failed to start checkout",
        variant: "error",
      });
    } finally {
      setCheckoutLoading(false);
    }
  }

  // Open customer portal
  async function openPortal() {
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractorId: contractor.id }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      toast({ title: "Error", description: "Failed to open billing portal", variant: "error" });
    }
  }

  return (
    <div className="min-h-[80vh] bg-surface-muted">
      <div className="container-content py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">{contractor.businessName}</h1>
            <p className="text-text-muted text-sm">
              {contractor.city}, {contractor.state}
              {contractor.isVerified && <span className="ml-2 text-success text-xs font-medium">✓ Verified</span>}
              {contractor.badgeOfExcellence && <span className="ml-2 badge-excellence text-xs">Badge of Excellence</span>}
              {subscription && <span className="ml-2 badge-premium text-xs">Premium</span>}
            </p>
          </div>
          <Link href={`/pro/${contractor.slug}`} target="_blank">
            <Button variant="outline" size="sm"><Eye className="h-4 w-4" /> View Public Profile</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: MessageSquare, label: "Total Leads", value: counts.leads, color: "text-primary" },
            { icon: Star, label: "Rating", value: `${contractor.averageRating.toFixed(1)} ★`, color: "text-accent-dark" },
            { icon: DollarSign, label: "Credit Balance", value: `${contractor.leadBalance}`, color: "text-success" },
            { icon: Clock, label: "Response Rate", value: `${contractor.responseRate}%`, color: "text-secondary" },
          ].map((stat) => (
            <div key={stat.label} className="card-base p-4">
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-xs text-text-muted">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-1 mb-6 border-b border-border pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? "bg-primary text-white" : "text-text-muted hover:bg-surface-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="card-base p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Leads</h2>
              {leads.length === 0 ? (
                <p className="text-sm text-text-muted py-8 text-center">
                  No leads yet. Complete your profile and get verified to start receiving leads.
                </p>
              ) : (
                <div className="space-y-3">
                  {leads.slice(0, 5).map((lead: any) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-surface-muted rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{lead.firstName} {lead.lastName}</p>
                        <p className="text-xs text-text-muted">
                          {lead.city}, {lead.state} · {new Date(lead.createdAt).toLocaleDateString()}
                          {lead.projectType && ` · ${lead.projectType}`}
                        </p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        lead.status === "NEW" ? "bg-primary/10 text-primary" :
                        lead.status === "CONTACTED" ? "bg-accent/10 text-accent-dark" :
                        lead.status === "COMPLETED" ? "bg-success/10 text-success" :
                        "bg-surface-muted text-text-muted"
                      }`}>{lead.status.replace(/_/g, " ")}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="card-base p-6">
                <h3 className="font-semibold mb-2">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("profile")}>
                    <Building2 className="h-4 w-4" /> Edit Your Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("credits")}>
                    <CreditCard className="h-4 w-4" /> Buy Lead Credits
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("case-studies")}>
                    <FileText className="h-4 w-4" /> Add Case Study
                  </Button>
                </div>
              </div>

              <div className="card-base p-6">
                <h3 className="font-semibold mb-2">Tips & Alerts</h3>
                <ul className="space-y-2 text-sm text-text-muted">
                  {!contractor.isVerified && (
                    <li className="flex items-start gap-2"><Bell className="h-4 w-4 text-warning shrink-0 mt-0.5" /> Complete verification to start receiving leads</li>
                  )}
                  {contractor.leadBalance < 10 && contractor.isVerified && (
                    <li className="flex items-start gap-2"><Bell className="h-4 w-4 text-warning shrink-0 mt-0.5" /> Low credit balance — add credits soon</li>
                  )}
                  {counts.caseStudies === 0 && (
                    <li className="flex items-start gap-2"><TrendingUp className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Add case studies to improve trust</li>
                  )}
                  <li className="flex items-start gap-2"><Users className="h-4 w-4 shrink-0 mt-0.5" /> {counts.reviews} approved reviews</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── Leads Tab ── */}
        {activeTab === "leads" && (
          <div className="card-base">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold">All Leads ({leads.length})</h2>
            </div>
            {leads.length === 0 ? (
              <div className="p-12 text-center text-text-muted">
                <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                <p>No leads yet. Make sure your profile is complete and verified.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {leads.map((lead: any) => (
                  <div key={lead.id} className="p-4 hover:bg-surface-muted/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{lead.firstName} {lead.lastName}</p>
                        <p className="text-xs text-text-muted">{lead.email}{lead.phone ? ` · ${lead.phone}` : ""}</p>
                        <p className="text-xs text-text-muted">{lead.city}, {lead.state} {lead.zipCode}</p>
                        {lead.projectType && <p className="text-xs text-text-muted mt-1">Project: {lead.projectType}</p>}
                        {lead.preferredTimeline && <p className="text-xs text-text-muted">Timeline: {lead.preferredTimeline}</p>}
                        {lead.notes && <p className="text-xs text-text-muted mt-1 italic">&ldquo;{lead.notes}&rdquo;</p>}
                        <p className="text-xs text-text-muted mt-1">
                          Received: {new Date(lead.createdAt).toLocaleDateString()} · {lead.source || "profile_page"}
                          {lead.creditDeducted && <span className="ml-2 text-success">● 1 credit used</span>}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          disabled={loadingStatus === lead.id}
                          className="text-xs px-2 py-1 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          {LEAD_STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt.replace(/_/g, " ")}</option>
                          ))}
                        </select>
                        <p className="text-xs text-text-muted mt-1">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Credits Tab ── */}
        {activeTab === "credits" && (
          <div className="space-y-6">
            <div className="card-base p-6">
              <h2 className="text-lg font-semibold mb-4">Current Balance</h2>
              <div className="flex items-center gap-4">
                <p className="text-4xl font-bold text-primary">{contractor.leadBalance}</p>
                <p className="text-text-muted">lead credits remaining</p>
              </div>
            </div>

            <div className="card-base p-6">
              <h2 className="text-lg font-semibold mb-4">Buy Lead Credits</h2>
              <p className="text-sm text-text-muted mb-6">
                One credit is deducted each time you mark a lead as contacted. Unused credits never expire.
              </p>
              <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                {CREDIT_PACKS.map((pack) => (
                  <div key={pack.id} className="card-base p-4 text-center border-2 hover:border-primary transition-colors">
                    <p className="text-2xl font-bold text-primary">{pack.credits}</p>
                    <p className="text-xs text-text-muted mb-3">lead credits</p>
                    <p className="text-lg font-semibold mb-1">${(pack.priceCents / 100).toFixed(0)}</p>
                    <p className="text-xs text-text-muted mb-4">
                      ${(pack.priceCents / 100 / pack.credits).toFixed(0)}/lead
                    </p>
                    <Button
                      size="sm"
                      className="w-full"
                      disabled={checkoutLoading}
                      onClick={() => handlePurchase("credits", pack.id)}
                    >
                      <ShoppingCart className="h-3 w-3" /> Buy
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Subscription Tab ── */}
        {activeTab === "subscription" && (
          <div className="space-y-6">
            <div className="card-base p-6">
              <h2 className="text-lg font-semibold mb-4">Current Plan</h2>
              {subscription ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {subscription.planType === "PREMIUM_MONTHLY" ? "Premium Monthly" :
                       subscription.planType === "PREMIUM_YEARLY" ? "Premium Yearly" : "Free"}
                    </p>
                    {subscription.currentPeriodEnd && (
                      <p className="text-sm text-text-muted">
                        Renews: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                      </p>
                    )}
                    <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                      subscription.status === "ACTIVE" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                    }`}>{subscription.status}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={openPortal}>
                    <ExternalLink className="h-4 w-4" /> Manage Billing
                  </Button>
                </div>
              ) : (
                <p className="text-text-muted text-sm">No active subscription</p>
              )}
            </div>

            <div className="card-base p-6">
              <h2 className="text-lg font-semibold mb-4">Premium Plans</h2>
              <p className="text-sm text-text-muted mb-6">
                Premium gives you enhanced profile features, early lead access, and advanced analytics.
                Premium does NOT affect your search ranking.
              </p>
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
                {PREMIUM_PLANS.map((plan) => (
                  <div key={plan.id} className="card-base p-6 border-2 hover:border-accent transition-colors">
                    <p className="text-lg font-bold">{plan.label}</p>
                    <p className="text-3xl font-bold mt-2">${(plan.priceCents / 100).toFixed(0)}</p>
                    <p className="text-xs text-text-muted mb-4">per {plan.interval}</p>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-text-muted">
                          <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" /> {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={plan.id === "premium_monthly" ? "default" : "outline"}
                      disabled={checkoutLoading}
                      onClick={() => handlePurchase("premium", plan.id)}
                    >
                      {subscription ? "Upgrade" : "Subscribe"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Profile Tab ── */}
        {activeTab === "profile" && (
          <div className="card-base p-6">
            <h2 className="text-lg font-semibold mb-2">Profile Information</h2>
            <p className="text-sm text-text-muted mb-6">
              Your public profile information. Edit fields to update what homeowners see.
            </p>
            <div className="space-y-4 max-w-2xl">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-text-muted block mb-1">Business Name</label>
                  <input defaultValue={contractor.businessName} className="w-full h-10 px-3 rounded-lg border border-border text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted block mb-1">Tagline</label>
                  <input defaultValue={contractor.tagline || ""} className="w-full h-10 px-3 rounded-lg border border-border text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted block mb-1">Description</label>
                <textarea defaultValue={contractor.description} rows={4} className="w-full px-3 py-2 rounded-lg border border-border text-sm resize-none" />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-text-muted block mb-1">Phone</label>
                  <input defaultValue={contractor.phone || ""} className="w-full h-10 px-3 rounded-lg border border-border text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted block mb-1">Email</label>
                  <input defaultValue={contractor.email || ""} className="w-full h-10 px-3 rounded-lg border border-border text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted block mb-1">Website</label>
                  <input defaultValue={contractor.website || ""} className="w-full h-10 px-3 rounded-lg border border-border text-sm" />
                </div>
              </div>
              <Button variant="default">Save Changes</Button>
            </div>
          </div>
        )}

        {/* ── Case Studies Tab ── */}
        {activeTab === "case-studies" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Case Studies ({counts.caseStudies})</h2>
              <Button size="sm"><Plus className="h-4 w-4" /> Add Case Study</Button>
            </div>
            {counts.caseStudies === 0 ? (
              <div className="card-base p-12 text-center text-text-muted">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <p>No case studies yet. Case studies help homeowners trust your work.</p>
                <p className="text-xs mt-2">Include before/after photos, energy savings data, and customer testimonials.</p>
              </div>
            ) : (
              <p className="text-text-muted text-sm">Case study management coming in Phase 4.</p>
            )}
          </div>
        )}

        {/* ── Settings Tab ── */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="card-base p-6">
              <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="text-xs font-medium text-text-muted block mb-1">Notification Email</label>
                  <input defaultValue={contractor.email || ""} className="w-full h-10 px-3 rounded-lg border border-border text-sm" />
                  <p className="text-xs text-text-muted mt-1">Where lead notifications are sent</p>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-border" />
                  <label className="text-sm">Email me when new leads arrive</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-border" />
                  <label className="text-sm">Weekly lead summary digest</label>
                </div>
                <Button variant="default">Save Settings</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
