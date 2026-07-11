/**
 * Contractor Profile — Lead Capture Form
 * Submits a quote request to the contractor
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Send, Shield } from "lucide-react";

interface Props {
  contractor: any;
}

export function ProfileLeadForm({ contractor }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    projectType: "Heat Pump Installation",
    homeSize: "",
    currentHeating: "",
    preferredTimeline: "Within 30 days",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          contractorId: contractor.id,
          city: contractor.city,
          state: contractor.state,
          zipCode: contractor.zipCode,
          homeSize: form.homeSize ? parseInt(form.homeSize) : undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      setSubmitted(true);
      toast({
        title: "Request Sent!",
        description: `${contractor.businessName} will contact you soon.`,
        variant: "success",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to send your request. Please try again.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="card-base p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
          <Send className="h-8 w-8 text-success" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Request Sent!</h3>
        <p className="text-sm text-text-muted mb-4">
          {contractor.businessName} will review your information and reach out
          soon via email or phone.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setSubmitted(false);
            setForm({
              firstName: "", lastName: "", email: "", phone: "",
              projectType: "Heat Pump Installation", homeSize: "",
              currentHeating: "", preferredTimeline: "Within 30 days",
              message: "",
            });
          }}
        >
          Send Another Request
        </Button>
      </div>
    );
  }

  return (
    <div className="card-base p-6">
      <h3 className="text-lg font-semibold mb-1">Get a Free Quote</h3>
      <p className="text-sm text-text-muted mb-4">
        Request a quote from {contractor.businessName}. No obligation.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="First Name*"
            required
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Last Name*"
            required
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <input
          type="email"
          placeholder="Email*"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <input
          type="tel"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <select
          value={form.projectType}
          onChange={(e) => setForm({ ...form, projectType: e.target.value })}
          className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option>Heat Pump Installation</option>
          <option>Mini-Split / Ductless</option>
          <option>Heat Pump Repair</option>
          <option>Heat Pump Water Heater</option>
          <option>Ductwork / Retrofit</option>
          <option>Other</option>
        </select>

        <input
          type="number"
          placeholder="Home Size (sq ft)"
          value={form.homeSize}
          onChange={(e) => setForm({ ...form, homeSize: e.target.value })}
          className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <select
          value={form.currentHeating}
          onChange={(e) => setForm({ ...form, currentHeating: e.target.value })}
          className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Current Heating System</option>
          <option>Natural Gas Furnace</option>
          <option>Oil Furnace</option>
          <option>Electric Baseboard</option>
          <option>Propane Furnace</option>
          <option>Existing Heat Pump</option>
          <option>Other / Not Sure</option>
        </select>

        <select
          value={form.preferredTimeline}
          onChange={(e) =>
            setForm({ ...form, preferredTimeline: e.target.value })
          }
          className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option>Just exploring</option>
          <option>Within 30 days</option>
          <option>Within 90 days</option>
          <option>ASAP</option>
        </select>

        <textarea
          placeholder="Additional details about your project..."
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Send Request"}
        </Button>

        <p className="text-xs text-text-muted text-center flex items-center justify-center gap-1">
          <Shield className="h-3 w-3" />
          Your info is never shared without your consent
        </p>
      </form>
    </div>
  );
}
