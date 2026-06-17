import { useState } from "react";
import { Card, Button, Badge, Spinner } from "@/ui";
import { Search, Calendar, Clock, CheckCircle, XCircle, Plus, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const dummyAppointments = [
  {
    _id: "1",
    propertyId: {
      _id: "prop_001",
      title: "Luxury Apartment in Victoria Island",
    },
    userId: { firstName: "John", lastName: "Doe", email: "john@example.com", phone: "+234 800 000 0000" },
    scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "CONFIRMED",
    notes: "Client wants to see the apartment at 3pm",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    propertyId: {
      _id: "prop_002",
      title: "Modern 4-Bedroom House in Lekki",
    },
    userId: { firstName: "Jane", lastName: "Smith", email: "jane@example.com", phone: "+234 800 000 0001" },
    scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "PENDING",
    notes: "Client will confirm time later",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "3",
    propertyId: {
      _id: "prop_003",
      title: "Commercial Space in Ikeja",
    },
    userId: { firstName: "Mike", lastName: "Johnson", email: "mike@example.com", phone: "+234 800 000 0002" },
    scheduledDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: "DONE",
    notes: "Inspection completed successfully",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function AgentAppointments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleConfirm = (id: string) => {
    toast.success("Appointment confirmed");
  };

  const handleCancel = (id: string) => {
    toast.success("Appointment cancelled");
  };

  const handleComplete = (id: string) => {
    toast.success("Appointment marked as completed");
  };

  const filteredAppointments = dummyAppointments.filter(app =>
    app.propertyId.title.toLowerCase().includes(search.toLowerCase()) ||
    app.userId.firstName.toLowerCase().includes(search.toLowerCase()) ||
    app.userId.lastName.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return <Badge variant="warning">Pending</Badge>;
      case "CONFIRMED": return <Badge variant="primary">Confirmed</Badge>;
      case "DONE": return <Badge variant="success">Completed</Badge>;
      case "CANCELLED": return <Badge variant="danger">Cancelled</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">Appointments</h1>
          <p className="text-gray-500 mt-1">Manage property viewing appointments</p>
        </div>
        <Button>
          <Plus size={18} className="mr-2" />
          Schedule Appointment
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search appointments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="DONE">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAppointments.map((appointment) => (
          <Card key={appointment._id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[var(--color-brand-primary)]/10 rounded-lg">
                  <Calendar size={20} className="text-[var(--color-brand-primary)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-brand-text)]">
                    {appointment.propertyId.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {new Date(appointment.scheduledDate).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <span>{appointment.userId.firstName} {appointment.userId.lastName}</span>
                    <span>•</span>
                    <span>{appointment.userId.phone}</span>
                  </div>
                  {appointment.notes && (
                    <p className="text-sm text-gray-500 mt-2 italic">"{appointment.notes}"</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                {getStatusBadge(appointment.status)}
                <div className="flex gap-2 mt-3">
                  {appointment.status === "PENDING" && (
                    <>
                      <Button size="sm" variant="ghost" onClick={() => handleConfirm(appointment._id)}>
                        <CheckCircle size={14} className="mr-1" />
                        Confirm
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleCancel(appointment._id)}>
                        <XCircle size={14} className="mr-1" />
                        Cancel
                      </Button>
                    </>
                  )}
                  {appointment.status === "CONFIRMED" && (
                    <Button size="sm" variant="secondary" onClick={() => handleComplete(appointment._id)}>
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No appointments found</p>
        </div>
      )}
    </div>
  );
}