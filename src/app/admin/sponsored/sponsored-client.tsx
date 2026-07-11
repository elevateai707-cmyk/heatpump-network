/**
 * Admin — Sponsored Placement Management Client
 * Full CRUD for sponsored placements
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  DollarSign, Plus, PauseCircle, PlayCircle, Trash2, Search,
  MapPin, Globe,
} from "lucide-react";

interface Props {
  placements: any[];
  contractors: any[];
}

export default function SponsoredClient({ placements, contractors }: Props) {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    contractorId: "",
    city: "",
    state: "",
    isGlobal: false,
    monthlyRateCents: 29900,
    startsAt: new Date().toISOString().split("T")[0],
    endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/sponsored", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          startsAt: new Date(form.startsAt),
          endsAt: new Date(form.endsAt),
        }),
      });

      if (!res.ok) throw new Error("Failed");

      toast({ title: "Sponsored Placement Created", variant: "success", description: "The sponsored placement has been created and will display on relevant search pages." });
      setShowForm(false);
      window.location.reload();
    } catch {
      toast({ title: "Error", description: "Failed to create placement", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(id: string, current: boolean) {
    try {
      const res = await fetch(`/api/admin/sponsored/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });

      if (!res.ok) throw new Error("Failed");
      window.location.reload();
    } catch {
      toast({ title: "Error", description: "Failed to update", variant: "error" });
    }
  }

  const activePlacements = placements.filter((p) => p.isActive);
  const pausedPlacements = placements.filter((p) => !p.isActive);

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="container-content py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-primary" />
              Sponsored Placements
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Manage sponsored listings — clearly labelled, separate from organic results
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" /> New Placement
          </Button>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="card-base p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Create Sponsored Placement</h2>
            <form onSubmit={handleCreate} className="space-y-4 max-w-lg">
              <div>
                <label className="text-xs font-medium text-text-muted block mb-1">Contractor</label>
                <select
                  value={form.contractorId}
                  onChange={(e) => setForm({ ...form, contractorId: e.target.value })}
                  required
                  className="w-full h-10 px-3 rounded-lg border border-border text-sm"
                >
                  <option value="">Select contractor</option>
                  {contractors.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.businessName} — {c.city}, {c.state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isGlobal}
                  onChange={(e) => setForm({ ...form, isGlobal: e.target.checked })}
                  className="rounded border-border"
                />
                <label className="text-sm">Show globally on all search pages</label>
              </div>

              {!form.isGlobal && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-text-muted block mb-1">City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg border border-border text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-muted block mb-1">State</label>
                    <input
                      type="text"
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      maxLength={2}
                      className="w-full h-10 px-3 rounded-lg border border-border text-sm"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-text-muted block mb-1">Monthly Rate ($)</label>
                <input
                  type="number"
                  value={form.monthlyRateCents / 100}
                  onChange={(e) => setForm({ ...form, monthlyRateCents: parseInt(e.target.value) * 100 })}
                  className="w-full h-10 px-3 rounded-lg border border-border text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-text-muted block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={form.startsAt}
                    onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-border text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted block mb-1">End Date</label>
                  <input
                    type="date"
                    value={form.endsAt}
                    onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-border text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Placement"}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card-base p-4">
            <p className="text-xs text-text-muted mb-1">Active</p>
            <p className="text-2xl font-bold text-success">{activePlacements.length}</p>
          </div>
          <div className="card-base p-4">
            <p className="text-xs text-text-muted mb-1">Paused</p>
            <p className="text-2xl font-bold text-text-muted">{pausedPlacements.length}</p>
          </div>
          <div className="card-base p-4">
            <p className="text-xs text-text-muted mb-1">Monthly Revenue</p>
            <p className="text-2xl font-bold text-primary">
              ${activePlacements.reduce((s, p) => s + p.monthlyRateCents, 0) / 100}/mo
            </p>
          </div>
        </div>

        {/* Active placements */}
        <h2 className="text-lg font-semibold mb-4">Active Placements ({activePlacements.length})</h2>
        <div className="space-y-3 mb-8">
          {activePlacements.length === 0 ? (
            <div className="card-base p-8 text-center text-text-muted">
              <DollarSign className="h-8 w-8 mx-auto mb-2" />
              <p>No active sponsored placements</p>
            </div>
          ) : (
            activePlacements.map((p) => (
              <div key={p.id} className="card-base p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <div>
                    <p className="font-medium">{p.contractor?.businessName || "Unknown"}</p>
                    <div className="flex items-center gap-3 text-xs text-text-muted">
                      {p.isGlobal ? (
                        <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> Global</span>
                      ) : (
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.city}, {p.state}</span>
                      )}
                      <span>${(p.monthlyRateCents / 100).toFixed(0)}/mo</span>
                      <span>Until {new Date(p.endsAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => toggleActive(p.id, true)}>
                    <PauseCircle className="h-4 w-4 text-warning" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Paused placements */}
        <h2 className="text-lg font-semibold mb-4">Paused ({pausedPlacements.length})</h2>
        <div className="space-y-3">
          {pausedPlacements.map((p) => (
            <div key={p.id} className="card-base p-4 flex items-center justify-between opacity-70">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-text-muted" />
                <div>
                  <p className="font-medium">{p.contractor?.businessName || "Unknown"}</p>
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    {p.isGlobal ? <span>Global</span> : <span>{p.city}, {p.state}</span>}
                    <span>${(p.monthlyRateCents / 100).toFixed(0)}/mo</span>
                  </div>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => toggleActive(p.id, false)}>
                <PlayCircle className="h-4 w-4 text-success" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
