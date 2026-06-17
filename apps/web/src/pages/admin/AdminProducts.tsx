import { useState } from "react";
import { Card, Button, Badge, Spinner, Pagination } from "@/ui";
import { Search, Plus, Edit, Trash2, Eye, Package } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// Dummy data
const dummyProducts = [
  {
    _id: "1",
    name: "iPhone 15 Pro Max",
    description: "Latest iPhone with A17 Pro chip",
    price: 1450000,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400"],
    stock: 15,
    status: "ACTIVE",
    rating: 4.8,
    salesCount: 45,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    name: "Samsung Galaxy S24 Ultra",
    description: "Premium Android phone with 200MP camera",
    price: 1350000,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1705172017423-919dd7b59e5c?w=400"],
    stock: 8,
    status: "ACTIVE",
    rating: 4.7,
    salesCount: 32,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "3",
    name: "MacBook Pro M3",
    description: "14-inch MacBook Pro with M3 chip",
    price: 2450000,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"],
    stock: 5,
    status: "ACTIVE",
    rating: 4.9,
    salesCount: 23,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "4",
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise canceling headphones",
    price: 350000,
    category: "Audio",
    images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400"],
    stock: 25,
    status: "ACTIVE",
    rating: 4.8,
    salesCount: 78,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "5",
    name: "Nike Air Max 90",
    description: "Classic sneakers with premium comfort",
    price: 85000,
    category: "Fashion",
    images: ["https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400"],
    stock: 0,
    status: "OUT_OF_STOCK",
    rating: 4.6,
    salesCount: 145,
    createdAt: new Date().toISOString(),
  },
];

export default function AdminProducts() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredProducts = dummyProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      toast.success("Product deleted successfully");
    }
  };

  const handleStatusToggle = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "DISABLED" : "ACTIVE";
    toast.success(`Product ${newStatus === "ACTIVE" ? "activated" : "disabled"} successfully`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">Products</h1>
          <p className="text-gray-500 mt-1">Manage all products on the platform</p>
        </div>
        <Link to="/products/create">
          <Button>
            <Plus size={18} className="mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
          />
        </div>
        <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]">
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Audio">Audio</option>
          <option value="Fashion">Fashion</option>
        </select>
        <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]">
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
          <option value="DISABLED">Disabled</option>
        </select>
      </div>

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Product</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Sales</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0] || "https://via.placeholder.com/40"}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    ₦{product.price.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={product.stock <= 5 ? "text-red-500 font-medium" : ""}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">{product.salesCount}</td>
                  <td className="px-4 py-3">
                    <Badge variant={
                      product.status === "ACTIVE" ? "success" :
                      product.status === "OUT_OF_STOCK" ? "warning" : "danger"
                    }>
                      {product.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/products/${product._id}`}>
                        <button className="p-1 rounded hover:bg-gray-100" title="View">
                          <Eye size={16} className="text-gray-500" />
                        </button>
                      </Link>
                      <Link to={`/admin/products/${product._id}/edit`}>
                        <button className="p-1 rounded hover:bg-gray-100" title="Edit">
                          <Edit size={16} className="text-gray-500" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleStatusToggle(product._id, product.status)}
                        className="p-1 rounded hover:bg-gray-100"
                        title={product.status === "ACTIVE" ? "Disable" : "Activate"}
                      >
                        <Package size={16} className={product.status === "ACTIVE" ? "text-green-500" : "text-gray-400"} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-1 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-400 hover:text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
}