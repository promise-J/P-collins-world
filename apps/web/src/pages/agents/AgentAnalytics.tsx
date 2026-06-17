import { useState } from "react";
import { Card, Badge, Button } from "@/ui";
import { TrendingUp, TrendingDown, Eye, Users, Calendar, DollarSign, Building2, MessageSquare } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const propertyViewsData = [
  { month: "Jan", views: 450, inquiries: 25 },
  { month: "Feb", views: 580, inquiries: 32 },
  { month: "Mar", views: 620, inquiries: 38 },
  { month: "Apr", views: 780, inquiries: 45 },
  { month: "May", views: 920, inquiries: 52 },
  { month: "Jun", views: 1050, inquiries: 60 },
];

const clientGrowthData = [
  { month: "Jan", clients: 15 },
  { month: "Feb", clients: 22 },
  { month: "Mar", clients: 28 },
  { month: "Apr", clients: 35 },
  { month: "May", clients: 42 },
  { month: "Jun", clients: 52 },
];

const propertyTypeData = [
  { name: "APARTMENT", value: 45, color: "#3B82F6" },
  { name: "HOUSE", value: 30, color: "#10B981" },
  { name: "COMMERCIAL", value: 15, color: "#8B5CF6" },
  { name: "LAND", value: 10, color: "#F59E0B" },
];

export default function AgentAnalytics() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");

  const stats = [
    { label: "Total Views", value: "4,400", change: "+24.5%", icon: Eye, color: "bg-blue-100 text-blue-600" },
    { label: "Total Inquiries", value: "252", change: "+18.2%", icon: MessageSquare, color: "bg-green-100 text-green-600" },
    { label: "Active Clients", value: "52", change: "+32.1%", icon: Users, color: "bg-purple-100 text-purple-600" },
    { label: "Commission", value: "₦4.8M", change: "+12.8%", icon: DollarSign, color: "bg-orange-100 text-orange-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">Analytics</h1>
          <p className="text-gray-500 mt-1">Track your performance and insights</p>
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
        {/* Property Views & Inquiries */}
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-[var(--color-brand-text)] mb-4">Property Views & Inquiries</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={propertyViewsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar dataKey="views" fill="#8B3A3A" radius={[4, 4, 0, 0]} name="Views" />
                <Bar dataKey="inquiries" fill="#D4A373" radius={[4, 4, 0, 0]} name="Inquiries" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Client Growth */}
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-[var(--color-brand-text)] mb-4">Client Growth</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={clientGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Line type="monotone" dataKey="clients" stroke="#8B3A3A" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Property Type Distribution */}
      <Card className="p-5">
        <h2 className="text-lg font-semibold text-[var(--color-brand-text)] mb-4">Property Type Distribution</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="h-64 w-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent ?? 1 * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {propertyTypeData.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-sm text-gray-500">{item.value} listings</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}