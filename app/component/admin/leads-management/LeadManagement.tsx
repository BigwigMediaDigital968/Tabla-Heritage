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
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
            Leads Management Ledger
          </h1>
          <p className="text-xs text-neutral-400 font-light mt-0.5">
            Filter records, shift pipelines, and execute deletions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <input
              type="text"
              placeholder="Filter names or emails..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#141312] border border-neutral-800 text-xs text-white rounded-xl pl-9 pr-4 py-2 w-56 focus:outline-none focus:border-[#c5a880] transition-colors"
            />
          </div>
          <button
            onClick={loadLeadsData}
            className="p-2 bg-[#141312] border border-neutral-800 rounded-xl hover:text-[#c5a880] cursor-pointer transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ACTION COMMAND BAR */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-[#1c1a18] border border-[#c5a880]/20 rounded-xl flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
          <span className="text-xs font-medium text-[#c5a880] pl-1">
            Selected Rows Checklist Matrix:{" "}
            <b className="font-bold">{selectedIds.length}</b> nodes pinned
          </span>
          <div className="flex items-center gap-2">
            <select
              value={statusDropdownValue} // Bound directly to state variable
              onChange={(e) => {
                if (e.target.value) {
                  setStatusDropdownValue(e.target.value);
                  setBulkAction({
                    type: "status",
                    targetValue: e.target.value,
                  });
                }
              }}
              className="bg-[#141312] border border-neutral-800 text-xs font-semibold text-neutral-300 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="">Shift Pipeline Status...</option>
              <option value="new">Mark New</option>
              <option value="connected">Mark Connected</option>
              <option value="in progress">Mark In Progress</option>
              <option value="Completed">Mark Completed</option>
              <option value="rejected">Mark Rejected</option>
            </select>
            <button
              onClick={() => setBulkAction({ type: "delete" })}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/40 border border-rose-900/40 text-rose-400 hover:bg-rose-900/40 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
            >
              <Trash2 size={13} /> Deletion Clear
            </button>
          </div>
        </div>
      )}

      {/* CORE DATA DISPLAY TABLE CONTAINER GRID */}
      <div className="bg-[#141312] border border-neutral-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-neutral-900/60 border-b border-neutral-800 text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === filteredLeads.length &&
                      filteredLeads.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-neutral-800 bg-[#0c0c0b] text-[#c5a880] focus:ring-0 cursor-pointer w-3.5 h-3.5"
                  />
                </th>
                <th className="p-4">Contact Profile Identity</th>
                <th className="p-4">Track Target Choice</th>
                <th className="p-4">Current Pipeline Phase</th>
                <th className="p-4">Timestamp Entry</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300 font-light">
              {filteredLeads.map((lead) => {
                const isChecked = selectedIds.includes(lead._id);
                return (
                  <tr
                    key={lead._id}
                    className={`hover:bg-neutral-900/30 transition-colors ${isChecked ? "bg-[#c5a880]/5" : ""}`}
                  >
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectOne(lead._id)}
                        className="rounded border-neutral-800 bg-[#0c0c0b] text-[#c5a880] focus:ring-0 cursor-pointer w-3.5 h-3.5"
                      />
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-white text-sm">
                        {lead.firstName} {lead.lastName || ""}
                      </p>
                      <p className="text-neutral-500 font-mono text-[11px] mt-0.5">
                        {lead.email} • {lead.phone}
                      </p>
                    </td>
                    <td className="p-4 font-medium uppercase tracking-wider text-[11px] text-neutral-400">
                      {lead.serviceInterested}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize tracking-wide ${statusColors[lead.status || "new"]}`}
                      >
                        {lead.status || "new"}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-500">
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
                        className="p-1.5 bg-neutral-800/60 text-neutral-300 hover:text-[#c5a880] border border-neutral-700/50 rounded-lg cursor-pointer transition-colors"
                        title="Inspect Record Detail Card Parameters"
                      >
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredLeads.length === 0 && !loading && (
            <div className="text-center py-12 text-neutral-500 font-light">
              No records found matching query parameters.
            </div>
          )}
        </div>
      </div>

      {/* CONFIRMATION MODAL COMPONENT (BULK ACTIONS AND DELETIONS) */}
      {bulkAction && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="w-full max-w-sm bg-[#141312] border border-neutral-800 p-6 rounded-2xl space-y-5 text-center">
            <div className="mx-auto w-10 h-10 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full flex items-center justify-center">
              <AlertTriangle size={18} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Confirm Operation
              </h4>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                {bulkAction.type === "delete"
                  ? `Are you completely sure you want to permanently delete the selected ${selectedIds.length} lead configurations? This cannot be undone.`
                  : `Are you sure you want to switch the selected ${selectedIds.length} leads to stage "${bulkAction.targetValue}"?`}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleCancelAction} // Fixed: Resets both modal and dropdown state
                className="py-2 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 rounded-xl cursor-pointer transition-colors text-neutral-300"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  bulkAction.type === "delete"
                    ? executeBulkDeletion()
                    : executeBulkStatusUpdate(bulkAction.targetValue!)
                }
                className={`py-2 text-xs font-semibold text-white rounded-xl cursor-pointer transition-colors ${bulkAction.type === "delete" ? "bg-rose-600 hover:bg-rose-500" : "bg-[#c5a880] hover:bg-[#b3956d]"}`}
              >
                Confirm Execution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL VIEW OVERLAY DRAWER MODAL */}
      {activeInspectionLead && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="w-full max-w-lg bg-[#141312] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/40">
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">
                  Inspection Node Tracker
                </h4>
                <p className="text-[10px] font-mono text-neutral-500">
                  ID: {activeInspectionLead._id}
                </p>
              </div>
              <button
                onClick={() => setActiveInspectionLead(null)}
                className="text-xs text-neutral-400 hover:text-white cursor-pointer px-2.5 py-1 bg-neutral-800 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">
                    First Name
                  </label>
                  <p className="text-neutral-200 text-sm font-medium mt-0.5">
                    {activeInspectionLead.firstName}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">
                    Last Name
                  </label>
                  <p className="text-neutral-200 text-sm font-medium mt-0.5">
                    {activeInspectionLead.lastName || "—"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">
                    Email Coordinate
                  </label>
                  <p className="text-neutral-200 font-mono mt-0.5">
                    {activeInspectionLead.email}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">
                    Phone Connection
                  </label>
                  <p className="text-neutral-200 font-mono mt-0.5">
                    {activeInspectionLead.phone}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold block">
                  User Context / Short Message
                </label>
                <div className="mt-1 p-3 bg-[#0c0c0b] border border-neutral-800 text-neutral-300 font-light leading-relaxed rounded-xl max-h-32 overflow-y-auto whitespace-pre-wrap">
                  {activeInspectionLead.message ||
                    "No descriptive contextual commentary provided by sender."}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
