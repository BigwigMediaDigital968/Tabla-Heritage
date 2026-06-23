"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Search,
  Check,
  Trash2,
  SlidersHorizontal,
  AlertTriangle,
  Eye,
  RefreshCw,
} from "lucide-react";

interface Lead {
  _id: string;
  firstName: string;
  lastName?: string;
  phone: string;
  email: string;
  serviceInterested: string;
  message?: string;
  status?: "new" | "connected" | "in progress" | "Completed" | "rejected";
  createdAt: string;
}


export default function LeadsWorkspace() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Added state to explicitly control the dropdown element value
  const [statusDropdownValue, setStatusDropdownValue] = useState("");

  // Modal Configuration States
  const [bulkAction, setBulkAction] = useState<{
    type: "status" | "delete";
    targetValue?: string;
  } | null>(null);
  const [activeInspectionLead, setActiveInspectionLead] = useState<Lead | null>(
    null,
  );

  type LeadStatus = keyof typeof statusColors;


  useEffect(() => {
    loadLeadsData();
  }, []);

  const loadLeadsData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      if (!res.ok) throw new Error();
      const payload = await res.json();
      setLeads(payload.data || []);
    } catch {
      toast.error("Failed to load records database pool.");
    } finally {
      setLoading(false);
    }
  };

  console.log(leads);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredLeads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredLeads.map((l) => l._id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const executeBulkStatusUpdate = async (status: string) => {
    const promise = fetch("/api/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds, status }),
    }).then(async (res) => {
      if (!res.ok) throw new Error();
      await loadLeadsData();
      setSelectedIds([]);
      setBulkAction(null);
      setStatusDropdownValue(""); // Reset dropdown state on success
    });

    toast.promise(promise, {
      loading: "Processing pipeline state alterations...",
      success: "Status fields migrated successfully!",
      error: "Could not alter records criteria parameters.",
    });
  };

  const executeBulkDeletion = async () => {
    const promise = fetch("/api/leads", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds }),
    }).then(async (res) => {
      if (!res.ok) throw new Error();
      await loadLeadsData();
      setSelectedIds([]);
      setBulkAction(null);
      setStatusDropdownValue(""); // Reset dropdown state on success
    });

    toast.promise(promise, {
      loading: "Dropping indices from cluster matrix...",
      success: "Selected indices dropped cleanly.",
      error: "Failed to clear collection nodes.",
    });
  };

  const handleCancelAction = () => {
    setBulkAction(null);
    setStatusDropdownValue(""); // Reset dropdown state on user cancellation
  };

  const filteredLeads = leads.filter(
    (l) =>
      `${l.firstName} ${l.lastName || ""}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()),
  );

  const statusColors = {
    new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    connected: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "in progress": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rejected: "bg-neutral-800 text-neutral-400 border-neutral-700",
  };

  return (
    <div className="space-y-6 text-left animate-fadeIn">
      {/* HEADER & MAIN CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--primary)] tracking-wide">
            Leads Management Ledger
          </h1>
          <p className="text-xs text-muted-fg font-light mt-0.5">
            Filter customer records, update pipeline stages, or manage items in bulk.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-fg"
            />
            <input
              type="text"
              placeholder="Search names or emails..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-border text-sm text-fg-main placeholder:text-neutral-300 rounded-xl pl-9 pr-4 py-2 w-60 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
            />
          </div>
          <button
            onClick={loadLeadsData}
            disabled={loading}
            className="p-2 bg-white border border-border text-muted-fg rounded-xl hover:text-[var(--primary)] hover:border-neutral-300 cursor-pointer transition-colors disabled:opacity-50"
            title="Refresh Ledger"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* BULK ACTION ACTION BAR */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-[var(--secondary-light)] border border-[var(--secondary-dark)]/60 rounded-brand flex flex-wrap items-center justify-between gap-3 animate-fadeIn shadow-2xs">
          <span className="text-sm font-medium text-[var(--primary)] pl-1">
            Selected <b className="font-bold">{selectedIds.length}</b> lead{selectedIds.length > 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-2">
            <select
              value={statusDropdownValue}
              onChange={(e) => {
                if (e.target.value) {
                  setStatusDropdownValue(e.target.value);
                  setBulkAction({
                    type: "status",
                    targetValue: e.target.value,
                  });
                }
              }}
              className="bg-white border border-border text-xs font-medium text-fg-main rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[var(--primary)] cursor-pointer shadow-2xs"
            >
              <option value="">Update Pipeline Status...</option>
              <option value="new">Mark New</option>
              <option value="connected">Mark Connected</option>
              <option value="in progress">Mark In Progress</option>
              <option value="Completed">Mark Completed</option>
              <option value="rejected">Mark Rejected</option>
            </select>
            <button
              onClick={() => setBulkAction({ type: "delete" })}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100/80 text-xs font-semibold rounded-lg cursor-pointer transition-colors shadow-2xs"
            >
              <Trash2 size={13} /> Delete Records
            </button>
          </div>
        </div>
      )}

      {/* CORE DATA DISPLAY TABLE CONTAINER */}
      <div className="bg-white border border-border/80 rounded-brand overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-muted-main border-b border-border text-muted-fg font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === filteredLeads.length &&
                      filteredLeads.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-neutral-300 bg-white text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer w-4 h-4"
                  />
                </th>
                <th className="p-4">Lead Profile</th>
                <th className="p-4">Interest / Service</th>
                <th className="p-4">Pipeline Phase</th>
                <th className="p-4">Submission Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-fg-main font-light">
              {filteredLeads.map((lead: any) => {
                const isChecked = selectedIds.includes(lead._id);
                return (
                  <tr
                    key={lead._id}
                    className={`hover:bg-muted-main/40 transition-colors ${isChecked ? "bg-[var(--secondary-light)]/40" : ""}`}
                  >
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectOne(lead._id)}
                        className="rounded border-neutral-300 bg-white text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer w-4 h-4"
                      />
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-fg-main text-sm">
                        {lead.firstName} {lead.lastName || ""}
                      </p>
                      <p className="text-muted-fg font-mono text-xs mt-0.5">
                        {lead.email} • {lead.phone}
                      </p>
                    </td>
                    <td className="p-4 font-medium text-xs uppercase tracking-wider text-neutral-500">
                      {lead.serviceInterested}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize tracking-wide ${statusColors?.[(lead?.status as LeadStatus) || "new"] || "bg-neutral-100 text-neutral-700 border-neutral-200"}`}
                      >
                        {lead.status || "new"}
                      </span>
                    </td>
                    <td className="p-4 text-muted-fg text-xs">
                      {new Date(lead.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setActiveInspectionLead(lead)}
                        className="p-1.5 bg-white text-muted-fg hover:text-[var(--primary)] hover:bg-muted-main border border-border rounded-lg cursor-pointer transition-all shadow-2xs"
                        title="View Lead Details"
                      >
                        <Eye size={14} className="stroke-[1.75]" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredLeads.length === 0 && !loading && (
            <div className="text-center py-12 text-muted-fg font-light">
              No lead records match your current query parameters.
            </div>
          )}
        </div>
      </div>

      {/* CONFIRMATION OVERLAY MODAL */}
      {bulkAction && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="w-full max-w-sm bg-white border border-border p-6 rounded-brand space-y-5 text-center shadow-lg">
            <div className="mx-auto w-10 h-10 bg-amber-50 border border-amber-200 text-amber-600 rounded-full flex items-center justify-center">
              <AlertTriangle size={18} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-fg-main uppercase tracking-wider">
                Confirm Operation
              </h4>
              <p className="text-xs text-muted-fg font-light leading-relaxed">
                {bulkAction.type === "delete"
                  ? `Are you absolutely sure you want to permanently delete the selected ${selectedIds.length} lead records? This action cannot be reversed.`
                  : `Are you sure you want to switch the selected ${selectedIds.length} leads to stage "${bulkAction.targetValue}"?`}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleCancelAction}
                className="py-2 text-xs font-semibold bg-muted-main hover:bg-neutral-200 rounded-xl cursor-pointer transition-colors text-fg-main border border-border"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  bulkAction.type === "delete"
                    ? executeBulkDeletion()
                    : executeBulkStatusUpdate(bulkAction.targetValue!)
                }
                className={`py-2 text-xs font-semibold text-white rounded-xl cursor-pointer transition-colors shadow-xs ${bulkAction.type === "delete" ? "bg-red-600 hover:bg-red-500" : "bg-[var(--primary)] hover:bg-[var(--primary-light)]"}`}
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPACT DETAIL DRAWER / MODAL */}
      {activeInspectionLead && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="w-full max-w-lg bg-white border border-border rounded-brand overflow-hidden shadow-xl">
            <div className="p-5 border-b border-border flex justify-between items-center bg-muted-main">
              <div>
                <h4 className="text-sm font-bold text-[var(--primary)] tracking-wide">
                  Lead File Inspector
                </h4>
                <p className="text-[10px] font-mono text-muted-fg mt-0.5">
                  Reference ID: {activeInspectionLead._id}
                </p>
              </div>
              <button
                onClick={() => setActiveInspectionLead(null)}
                className="text-xs text-muted-fg hover:text-fg-main cursor-pointer px-2.5 py-1 bg-white border border-border rounded-lg transition-colors shadow-2xs"
              >
                Close File
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-muted-fg uppercase tracking-wider font-bold">
                    First Name
                  </label>
                  <p className="text-fg-main text-sm font-medium mt-0.5">
                    {activeInspectionLead.firstName}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] text-muted-fg uppercase tracking-wider font-bold">
                    Last Name
                  </label>
                  <p className="text-fg-main text-sm font-medium mt-0.5">
                    {activeInspectionLead.lastName || "—"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-muted-fg uppercase tracking-wider font-bold">
                    Email Address
                  </label>
                  <p className="text-fg-main font-mono mt-0.5">
                    {activeInspectionLead.email}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] text-muted-fg uppercase tracking-wider font-bold">
                    Phone Number
                  </label>
                  <p className="text-fg-main font-mono mt-0.5">
                    {activeInspectionLead.phone}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-muted-fg uppercase tracking-wider font-bold block">
                  Customer Message / Notes
                </label>
                <div className="mt-1 p-3 bg-bg-main border border-border text-fg-main font-light leading-relaxed rounded-xl max-h-32 overflow-y-auto whitespace-pre-wrap">
                  {activeInspectionLead.message ||
                    "No additional user message left with this submission."}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

