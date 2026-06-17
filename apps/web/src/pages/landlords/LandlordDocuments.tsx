import { useState } from "react";
import { Card, Button, Badge } from "@/ui";
import { Search, FileText, File, FileImage, FileArchive, Download, Eye, Plus, FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const dummyDocuments = [
  {
    _id: "1",
    title: "Lease Agreement - Luxury Apartment",
    type: "PDF",
    category: "Lease Agreements",
    propertyId: {
      _id: "prop_001",
      title: "Luxury Apartment in Victoria Island",
    },
    tenantId: {
      _id: "tenant_001",
      firstName: "John",
      lastName: "Doe",
    },
    size: "2.4 MB",
    uploadedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "ACTIVE",
  },
  {
    _id: "2",
    title: "Property Inspection Report - Modern House",
    type: "PDF",
    category: "Inspection Reports",
    propertyId: {
      _id: "prop_002",
      title: "Modern 4-Bedroom House in Lekki",
    },
    tenantId: null,
    size: "5.1 MB",
    uploadedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: "ACTIVE",
  },
  {
    _id: "3",
    title: "Rent Receipt - July 2024",
    type: "IMAGE",
    category: "Receipts",
    propertyId: {
      _id: "prop_003",
      title: "Commercial Space in Ikeja",
    },
    tenantId: {
      _id: "tenant_003",
      firstName: "Mike",
      lastName: "Johnson",
    },
    size: "850 KB",
    uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "ACTIVE",
  },
  {
    _id: "4",
    title: "Floor Plan - Commercial Space",
    type: "IMAGE",
    category: "Floor Plans",
    propertyId: {
      _id: "prop_003",
      title: "Commercial Space in Ikeja",
    },
    tenantId: null,
    size: "3.2 MB",
    uploadedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    status: "ARCHIVED",
  },
];

export default function LandlordDocuments() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const handleDownload = (id: string) => {
    toast.success("Document download started");
  };

  const handleView = (id: string) => {
    toast.success("Opening document preview");
  };

  const handleArchive = (id: string) => {
    toast.success("Document archived");
  };

  const filteredDocuments = dummyDocuments.filter(doc =>
    doc.title.toLowerCase().includes(search.toLowerCase()) ||
    doc.category.toLowerCase().includes(search.toLowerCase()) ||
    doc.propertyId?.title?.toLowerCase().includes(search.toLowerCase()) ||
    doc.tenantId?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    doc.tenantId?.lastName?.toLowerCase().includes(search.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "PDF": return <FileText size={18} className="text-red-500" />;
      case "IMAGE": return <FileImage size={18} className="text-blue-500" />;
      case "ARCHIVE": return <FileArchive size={18} className="text-yellow-500" />;
      default: return <File size={18} className="text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE": return <Badge variant="success">Active</Badge>;
      case "ARCHIVED": return <Badge variant="default">Archived</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">Documents</h1>
          <p className="text-gray-500 mt-1">Manage property and tenant documents</p>
        </div>
        <Button>
          <Plus size={18} className="mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Documents</p>
              <p className="text-2xl font-bold text-[var(--color-brand-text)]">{dummyDocuments.length}</p>
            </div>
            <FileText size={24} className="text-gray-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Lease Agreements</p>
              <p className="text-2xl font-bold text-blue-600">
                {dummyDocuments.filter(d => d.category === "Lease Agreements").length}
              </p>
            </div>
            <FileText size={24} className="text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inspection Reports</p>
              <p className="text-2xl font-bold text-green-600">
                {dummyDocuments.filter(d => d.category === "Inspection Reports").length}
              </p>
            </div>
            <FileText size={24} className="text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Receipts</p>
              <p className="text-2xl font-bold text-purple-600">
                {dummyDocuments.filter(d => d.category === "Receipts").length}
              </p>
            </div>
            <FileText size={24} className="text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
        >
          <option value="">All Categories</option>
          <option value="Lease Agreements">Lease Agreements</option>
          <option value="Inspection Reports">Inspection Reports</option>
          <option value="Receipts">Receipts</option>
          <option value="Floor Plans">Floor Plans</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
        >
          <option value="">All Types</option>
          <option value="PDF">PDF</option>
          <option value="IMAGE">Image</option>
          <option value="ARCHIVE">Archive</option>
        </select>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
          <Card key={doc._id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  {getTypeIcon(doc.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-brand-text)] line-clamp-1">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-gray-500">{doc.category}</p>
                </div>
              </div>
              {getStatusBadge(doc.status)}
            </div>

            <div className="mt-3 space-y-2 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Property</span>
                <span className="font-medium text-gray-700">{doc.propertyId?.title || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span>Tenant</span>
                <span className="font-medium text-gray-700">
                  {doc.tenantId ? `${doc.tenantId.firstName} ${doc.tenantId.lastName}` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Size</span>
                <span className="font-medium text-gray-700">{doc.size}</span>
              </div>
              <div className="flex justify-between">
                <span>Uploaded</span>
                <span className="font-medium text-gray-700">
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="secondary" className="flex-1" onClick={() => handleView(doc._id)}>
                <Eye size={14} className="mr-1" />
                View
              </Button>
              <Button size="sm" variant="ghost" className="flex-1" onClick={() => handleDownload(doc._id)}>
                <Download size={14} className="mr-1" />
                Download
              </Button>
              {doc.status === "ACTIVE" && (
                <Button size="sm" variant="ghost" onClick={() => handleArchive(doc._id)}>
                  <FolderOpen size={14} />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No documents found</p>
        </div>
      )}
    </div>
  );
}