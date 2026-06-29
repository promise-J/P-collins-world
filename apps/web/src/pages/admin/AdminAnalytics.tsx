import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Button, Spinner } from "@/ui";
import { TrendingUp, TrendingDown, Users, ShoppingBag, Building2, Wallet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { AdminService } from "@/services/admin.service";
import { AnalyticsService } from "@/services/analytics.service";

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");

  // Fetch real data
  const { data: metricsData, isLoading: metricsLoading } = useQuery({
    queryKey: ["admin-dashboard-metrics"],
    queryFn: () => AdminService.getDashboardMetrics(),
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ["admin-revenue", timeRange],
    queryFn: () => AdminService.getMonthlyRevenue(),
  });

  const { data: userAnalyticsData, isLoading: userAnalyticsLoading } = useQuery({
    queryKey: ["admin-user-analytics"],
    queryFn: () => AnalyticsService.getUserAnalytics(),
  });

  const { data: productAnalyticsData, isLoading: productAnalyticsLoading } = useQuery({
    queryKey: ["admin-product-analytics"],
    queryFn: () => AnalyticsService.getProductAnalytics(),
  });

  const metrics = metricsData?.data || {};
  const revenueChartData = revenueData?.data || [];
  const userAnalytics = userAnalyticsData?.data || {};
  const productAnalytics = productAnalyticsData?.data || {};

  // Calculate stats
  const stats = [
    {
      label: "Total Revenue",
      value: `₦${(metrics?.totalRevenue || 0).toLocaleString()}`,
      change: metrics?.revenueGrowth || "+0%",
      icon: TrendingUp,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Total Users",
      value: (metrics?.users || 0).toLocaleString(),
      change: metrics?.userGrowth || "+0%",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Orders",
      value: (metrics?.orders || 0).toLocaleString(),
      change: metrics?.orderGrowth || "+0%",
      icon: ShoppingBag,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Total Properties",
      value: (metrics?.properties || 0).toLocaleString(),
      change: metrics?.propertyGrowth || "+0%",
      icon: Building2,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  // Prepare pie chart data from user analytics
  const userDistribution = [
    { name: "Users", value: userAnalytics.usersByRole?.USER || 0, color: "#3B82F6" },
    { name: "Agents", value: userAnalytics.usersByRole?.AGENT || 0, color: "#8B5CF6" },
    { name: "Landlords", value: userAnalytics.usersByRole?.LANDLORD || 0, color: "#F59E0B" },
    { name: "Vendors", value: userAnalytics.usersByRole?.VENDOR || 0, color: "#10B981" },
  ];

  const COLORS = ["#3B82F6", "#8B5CF6", "#F59E0B", "#10B981"];

  // Show loading state
  if (metricsLoading || revenueLoading || userAnalyticsLoading || productAnalyticsLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">Analytics</h1>
          <p className="text-gray-500 mt-1">Platform performance metrics and insights</p>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {["week", "month", "year"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as any)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                timeRange === range
                  ? "bg-white shadow-sm text-[var(--color-brand-primary)]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.change.startsWith("+");
          return (
            <Card key={stat.label} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-[var(--color-brand-text)] mt-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {isPositive ? (
                      <TrendingUp size={14} className="text-green-500" />
                    ) : (
                      <TrendingDown size={14} className="text-red-500" />
                    )}
                    <span className={`text-xs ${isPositive ? "text-green-600" : "text-red-600"}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon size={20} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[var(--color-brand-text)]">Revenue Overview</h2>
            <span className="text-sm text-gray-500">
              Total: ₦{(metrics?.totalRevenue || 0).toLocaleString()}
            </span>
          </div>
          <div className="h-80">
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    formatter={(value: any) => [`₦${value?.toLocaleString()}`, "Revenue"]}
                    contentStyle={{ borderRadius: "8px", border: "none" }}
                  />
                  <Bar dataKey="revenue" fill="#8B3A3A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No revenue data available
              </div>
            )}
          </div>
        </Card>

        {/* User Growth Chart */}
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-[var(--color-brand-text)] mb-4">User Growth</h2>
          <div className="h-80">
            {userAnalytics.userGrowth?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userAnalytics.userGrowth || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    formatter={(value: any) => [value?.toLocaleString(), "Users"]}
                    contentStyle={{ borderRadius: "8px", border: "none" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#8B3A3A"
                    strokeWidth={2}
                    dot={{ fill: "#8B3A3A" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No user growth data available
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* User Distribution */}
      <Card className="p-5">
        <h2 className="text-lg font-semibold text-[var(--color-brand-text)] mb-4">User Distribution</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="h-64 w-64">
            {userDistribution.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent ?? 1 * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {userDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [value?.toLocaleString(), "Users"]}
                    contentStyle={{ borderRadius: "8px", border: "none" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No user distribution data available
              </div>
            )}
          </div>
          <div className="space-y-3">
            {userDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-sm text-gray-500">
                  {item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          Total Users: {(userDistribution.reduce((sum, d) => sum + d.value, 0)).toLocaleString()}
        </div>
      </Card>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Top Product Category</h3>
          <p className="text-xl font-bold text-[var(--color-brand-text)] mt-1">
            {productAnalytics.topCategory || "N/A"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {productAnalytics.categoryCount || 0} products in category
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">KYC Completion Rate</h3>
          <p className="text-xl font-bold text-[var(--color-brand-text)] mt-1">
            {userAnalytics.kycCompletionRate || "0%"}
          </p>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-brand-primary)] rounded-full"
              style={{
                width: `${parseFloat(userAnalytics.kycCompletionRate || "0")}%`,
              }}
            />
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Active Listings</h3>
          <p className="text-xl font-bold text-[var(--color-brand-text)] mt-1">
            {(metrics?.activeProperties || 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Out of {(metrics?.properties || 0).toLocaleString()} total
          </p>
        </Card>
      </div>
    </div>
  );
}