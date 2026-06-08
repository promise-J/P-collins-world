export function InventoryCard({
  totalProducts,

  lowStock,
}: any) {
  return (
    <div>
      Total Products:
      {totalProducts}
      Low Stock:
      {lowStock}
    </div>
  );
}
