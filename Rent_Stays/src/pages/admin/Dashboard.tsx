import { Building2, Users, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { RevenueChart } from "@/components/admin/dashboard/RevenueChart";
import { OccupancyChart } from "@/components/admin/dashboard/OccupancyChart";

import { QuickActions } from "@/components/admin/dashboard/QuickActions";

import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-up">
        <h1 className="page-header">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's what's happening with your properties.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Properties"
          value={isLoading ? "..." : stats?.totalProperties.toString() || "0"}
          change={stats?.propertiesChange ? `+${stats.propertiesChange} this month` : "No change"}
          changeType="positive"
          icon={Building2}
          iconColor="bg-accent/10 text-accent"
          delay={0.1}
        />
        <StatCard
          title="Active Tenants"
          value={isLoading ? "..." : stats?.activeTenants.toString() || "0"}
          change={stats?.tenantsChange ? `+${stats.tenantsChange} new tenants` : "No change"}
          changeType="positive"
          icon={Users}
          iconColor="bg-success/10 text-success"
          delay={0.15}
        />
        <StatCard
          title="Monthly Revenue"
          value={isLoading ? "..." : `£${stats?.monthlyRevenue.toLocaleString()}` || "£0"}
          change={stats?.revenueChange ? `${stats.revenueChange > 0 ? '+' : ''}${stats.revenueChange}% vs last month` : "No change"}
          changeType={stats?.revenueChange && stats.revenueChange >= 0 ? "positive" : "negative"}
          icon={DollarSign}
          iconColor="bg-primary/10 text-primary"
          delay={0.2}
        />
        <StatCard
          title="Occupancy Rate"
          value={isLoading ? "..." : `${stats?.occupancyRate}%` || "0%"}
          change={stats?.occupancyChange ? `+${stats.occupancyChange}% improvement` : "Stable"}
          changeType="positive"
          icon={TrendingUp}
          iconColor="bg-warning/10 text-warning"
          delay={0.25}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <OccupancyChart />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
