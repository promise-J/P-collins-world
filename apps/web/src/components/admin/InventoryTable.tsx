import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProductService } from '@/services/product.service';
import { Card, Badge, Button, Spinner, Pagination, Input } from '@/ui';
import { Search, Edit, Trash2, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LowStockAlert } from '../inventory/LowStockAlert';

interface InventoryTableProps {
  showLowStockOnly?: boolean;
}

export function InventoryTable({ showLowStockOnly = false }: InventoryTableProps) {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['inventory', page, limit, search],
    queryFn: () => ProductService.list({ page, limit, search }),
  });

  const products = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const lowStockProducts = products.filter((p: any) => p.stock > 0 && p.stock <= 10);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Low Stock Alert */}
      {showLowStockOnly && lowStockProducts.length > 0 && (
        <div className="space-y-2">
          {lowStockProducts.map((product: any) => (
            <LowStockAlert key={product._id} remaining={product.stock} />
          ))}
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Product</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Price</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Stock</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Sales</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product: any) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images?.[0] || '/placeholder.png'}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-brand-text">{product.name}</p>
                      <p className="text-xs text-gray-400">SKU: {product._id.slice(-8)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">
                  ₦{product.price?.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span className={product.stock <= 10 ? 'text-red-500 font-medium' : ''}>
                    {product.stock} units
                  </span>
                </td>
                <td className="px-4 py-3">
                  {product.status === 'ACTIVE' ? (
                    <Badge variant="success">Active</Badge>
                  ) : product.status === 'OUT_OF_STOCK' ? (
                    <Badge variant="danger">Out of Stock</Badge>
                  ) : (
                    <Badge variant="warning">Disabled</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  {product.salesCount || 0} sold
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link to={`/admin/products/${product._id}/edit`}>
                      <button className="p-1 rounded hover:bg-gray-100">
                        <Edit size={18} className="text-gray-500" />
                      </button>
                    </Link>
                    <button className="p-1 rounded hover:bg-gray-100">
                      <Package size={18} className="text-gray-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {products.length === 0 && (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
}