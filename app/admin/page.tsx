"use client";

import { use } from "react";
import AdminDashboardView from "../component/admin/dashboard/AdminDashboardView";
import LeadsWorkspace from "../component/admin/leads-management/LeadManagement";

export default function AdminMasterPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const resolvedParams = use(searchParams);
  const activeTab = resolvedParams.tab || "dashboard";

  return (
    <>
      {activeTab === "dashboard" && <AdminDashboardView />}
      {activeTab === "leads" && <LeadsWorkspace />}
    </>
  );
}
