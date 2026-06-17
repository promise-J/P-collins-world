import { useState } from "react";
import { Card, Button, Badge } from "@/ui";
import { TrendingUp, TrendingDown, Users, ShoppingBag, Building2, Wallet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 5000000, orders: 45 },
  { month: "Feb", revenue: 7500000, orders: 62 },
  { month: "Mar", revenue: 6200000, orders: 58 },
  { month: "Apr", revenue: 8900000, orders: 78 },
  { month: "May", revenue: 10500000, orders: 92 },
  { month: "Jun", revenue: 12300000, orders: 105 },
];

const userGrowthData = [
  { month: "Jan", users: 1200 },
  { month: "Feb", users: 1500 },
  { month: "Mar", users: 1800 },
  { month: "Apr", users: 2200 },
  { month: "May", users: 2800 },
  { month: "Jun", users: 3500 },
];

const pieData = [
  { name: "Users", value: 3500, color: "#3B82F6" },
  { name: "Vendors", value: 250, color: "#10B981" },
  { name: "Agents", value: 150, color: "#8B5CF6" },
  { name: "Landlords", value: 180, color: "#F59E0B" },
];

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");

  const stats = [
    { label: "Total Revenue", value: "₦28.4M", change: "+24.5%", icon: TrendingUp, color: "bg-green-100 text-green-600" },
    { label: "Total Users", value: "3,500", change: "+18.2%", icon: Users, color: "bg-blue-100 text-blue-600" },
    { label: "Total Orders", value: "440", change: "+32.1%", icon: ShoppingBag, color: "bg-purple-100 text-purple-600" },
    { label: "Total Properties", value: "320", change: "+12.8%", icon: Building2, color: "bg-orange-100 text-orange-600" },
  ];

  const COLORS = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B"];

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
          return (
            <Card key={stat.label} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-[var(--color-brand-text)] mt-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp size={14} className="text-green-500" />
                    <span className="text-xs text-green-600">{stat.change}</span>
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
          <h2 className="text-lg font-semibold text-[var(--color-brand-text)] mb-4">Revenue Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip formatter={(value: any) => [`₦${value?.toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#8B3A3A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* User Growth Chart */}
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-[var(--color-brand-text)] mb-4">User Growth</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip formatter={(value: any) => [value?.toLocaleString(), "Users"]} />
                <Line type="monotone" dataKey="users" stroke="#8B3A3A" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* User Distribution */}
      <Card className="p-5">
        <h2 className="text-lg font-semibold text-[var(--color-brand-text)] mb-4">User Distribution</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="h-64 w-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent ?? 1 * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-sm text-gray-500">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}