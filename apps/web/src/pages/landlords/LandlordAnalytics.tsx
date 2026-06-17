import { useState } from "react";
import { Card, Badge, Button } from "@/ui";
import { TrendingUp, TrendingDown, Home, Users, DollarSign, Calendar, Eye, Building2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const rentCollectionData = [
  { month: "Jan", collected: 1250000, expected: 1300000 },
  { month: "Feb", collected: 1280000, expected: 1300000 },
  { month: "Mar", collected: 1150000, expected: 1300000 },
  { month: "Apr", collected: 1300000, expected: 1300000 },
  { month: "May", collected: 1200000, expected: 1300000 },
  { month: "Jun", collected: 1320000, expected: 1300000 },
];

const occupancyData = [
  { month: "Jan", occupied: 85 },
  { month: "Feb", occupied: 88 },
  { month: "Mar", occupied: 82 },
  { month: "Apr", occupied: 90 },
  { month: "May", occupied: 92 },
  { month: "Jun", occupied: 94 },
];

const propertyTypeData = [
  { name: "APARTMENT", value: 5, color: "#3B82F6" },
  { name: "HOUSE", value: 3, color: "#10B981" },
  { name: "COMMERCIAL", value: 2, color: "#8B5CF6" },
];

export default function LandlordAnalytics() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");

  const stats = [
    { label: "Total Properties", value: "10", change: "+2 this year", icon: Home, color: "bg-blue-100 text-blue-600" },
    { label: "Occupancy Rate", value: "94%", change: "+4.2%", icon: Building2, color: "bg-green-100 text-green-600" },
    { label: "Monthly Rent", value: "₦1.32M", change: "+8.5%", icon: DollarSign, color: "bg-purple-100 text-purple-600" },
    { label: "Total Tenants", value: "8", change: "+1 this month", icon: Users, color: "bg-orange-100 text-orange-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">Analytics</h1>
          <p className="text-gray-500 mt-1">Track your rental property performance</p>
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
                    {stat.change.includes("+") ? (
                      <TrendingUp size={14} className="text-green-500" />
                    ) : (
                      <TrendingDown size={14} className="text-red-500" />
                    )}
                    <span className={`text-xs ${stat.change.includes("+") ? "text-green-600" : "text-red-600"}`}>
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
        {/* Rent Collection */}
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-[var(--color-brand-text)] mb-4">Rent Collection</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rentCollectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip formatter={(value: any) => [`₦${value?.toLocaleString()}`, "Amount"]} />
                <Bar dataKey="collected" fill="#8B3A3A" radius={[4, 4, 0, 0]} name="Collected" />
                <Bar dataKey="expected" fill="#D4A373" radius={[4, 4, 0, 0]} name="Expected" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Occupancy Rate */}
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-[var(--color-brand-text)] mb-4">Occupancy Rate</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" domain={[70, 100]} />
                <Tooltip formatter={(value: any) => [`${value}%`, "Occupancy"]} />
                <Line type="monotone" dataKey="occupied" stroke="#8B3A3A" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Property Distribution */}
      <Card className="p-5">
        <h2 className="text-lg font-semibold text-[var(--color-brand-text)] mb-4">Property Distribution</h2>
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
                <span className="text-sm text-gray-500">{item.value} properties</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}