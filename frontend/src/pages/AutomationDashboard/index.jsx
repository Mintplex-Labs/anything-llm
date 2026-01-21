import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useParams } from "react-router-dom";
import Automation from "@/models/automation";
import { isMobile } from "react-device-detect";
import { FullScreenLoader } from "@/components/Preloader";
import {
  Gauge,
  ChartLine,
  Users,
  Briefcase,
  Play,
  Pause,
  TrendUp,
  CheckCircle,
  Clock,
} from "@phosphor-icons/react";
import showToast from "@/utils/toast";

// Category icons mapping
const CATEGORY_ICONS = {
  business: Briefcase,
  marketing: ChartLine,
  sales: Gauge,
  hr: Users,
};

// Category display names
const CATEGORY_NAMES = {
  business: "Business",
  marketing: "Marketing",
  sales: "Sales",
  hr: "HR",
};

export default function AutomationDashboard() {
  const { categorySlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [automations, setAutomations] = useState([]);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!categorySlug) return;
      const data = await Automation.byCategory(categorySlug);
      setAutomations(data.automations);
      setMetrics(data.metrics);
      setLoading(false);
    }
    fetchData();
  }, [categorySlug]);

  const handleToggleAutomation = async (automationId, currentStatus) => {
    const newStatus = !currentStatus;
    const success = await Automation.toggleActive(automationId, newStatus);
    if (success) {
      setAutomations((prev) =>
        prev.map((auto) =>
          auto.id === automationId ? { ...auto, active: newStatus } : auto
        )
      );
      showToast(
        `Automation ${newStatus ? "activated" : "deactivated"} successfully`,
        "success"
      );
    } else {
      showToast("Failed to update automation status", "error");
    }
  };

  if (loading) return <FullScreenLoader />;

  const IconComponent = CATEGORY_ICONS[categorySlug] || Briefcase;
  const categoryName = CATEGORY_NAMES[categorySlug] || categorySlug;

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      {!isMobile && <Sidebar />}
      <div className="flex-1 overflow-y-auto bg-theme-bg-secondary">
        <div className="flex flex-col w-full h-full">
          {/* Header */}
          <div className="bg-theme-bg-primary border-b border-theme-border p-6">
            <div className="flex items-center gap-x-4 mb-2">
              <IconComponent
                size={32}
                weight="fill"
                className="text-blue-500"
              />
              <h1 className="text-3xl font-bold text-white">
                {categoryName} Automations
              </h1>
            </div>
            <p className="text-theme-text-secondary">
              Manage and monitor your {categoryName.toLowerCase()} automation
              workflows
            </p>
          </div>

          {/* Metrics Dashboard */}
          {metrics && (
            <div className="p-6 border-b border-theme-border bg-theme-bg-primary">
              <h2 className="text-xl font-semibold text-white mb-4">
                Dashboard Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                  icon={<CheckCircle size={24} weight="fill" />}
                  label="Total Automations"
                  value={metrics.total || 0}
                  color="blue"
                />
                <MetricCard
                  icon={<Play size={24} weight="fill" />}
                  label="Active"
                  value={metrics.active || 0}
                  color="green"
                />
                <MetricCard
                  icon={<TrendUp size={24} weight="fill" />}
                  label="Executions (24h)"
                  value={metrics.executions || 0}
                  color="purple"
                />
                <MetricCard
                  icon={<Clock size={24} weight="fill" />}
                  label="Success Rate"
                  value={`${metrics.successRate || 0}%`}
                  color="orange"
                />
              </div>
            </div>
          )}

          {/* Automations List */}
          <div className="flex-1 p-6 overflow-y-auto">
            <h2 className="text-xl font-semibold text-white mb-4">
              Automation Workflows
            </h2>

            {automations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <IconComponent
                  size={64}
                  weight="thin"
                  className="text-theme-text-secondary mb-4"
                />
                <p className="text-theme-text-secondary text-lg">
                  No automations found in this category
                </p>
                <p className="text-theme-text-secondary text-sm mt-2">
                  Create your first automation to get started
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {automations.map((automation) => (
                  <AutomationCard
                    key={automation.id}
                    automation={automation}
                    onToggle={handleToggleAutomation}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ icon, label, value, color }) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-500",
    green: "bg-green-500/10 text-green-500",
    purple: "bg-purple-500/10 text-purple-500",
    orange: "bg-orange-500/10 text-orange-500",
  };

  return (
    <div className="bg-theme-bg-secondary border border-theme-border rounded-lg p-4">
      <div className="flex items-center gap-x-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        <div className="flex-1">
          <p className="text-theme-text-secondary text-sm">{label}</p>
          <p className="text-white text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Automation Card Component
function AutomationCard({ automation, onToggle }) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    await onToggle(automation.id, automation.active);
    setIsToggling(false);
  };

  return (
    <div className="bg-theme-bg-secondary border border-theme-border rounded-lg p-5 hover:border-blue-500/50 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-x-3 mb-2">
            <h3 className="text-lg font-semibold text-white">
              {automation.name}
            </h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                automation.active
                  ? "bg-green-500/20 text-green-400"
                  : "bg-gray-500/20 text-gray-400"
              }`}
            >
              {automation.active ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="text-theme-text-secondary text-sm mb-3">
            {automation.description || "No description available"}
          </p>
          <div className="flex items-center gap-x-4 text-sm text-theme-text-secondary">
            {automation.lastRun && (
              <span>Last run: {new Date(automation.lastRun).toLocaleString()}</span>
            )}
            {automation.executions !== undefined && (
              <span>Executions: {automation.executions}</span>
            )}
          </div>
        </div>
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={`p-2 rounded-lg transition-all ${
            automation.active
              ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
              : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
          } ${isToggling ? "opacity-50 cursor-not-allowed" : ""}`}
          title={automation.active ? "Pause automation" : "Start automation"}
        >
          {automation.active ? (
            <Pause size={20} weight="fill" />
          ) : (
            <Play size={20} weight="fill" />
          )}
        </button>
      </div>
    </div>
  );
}
