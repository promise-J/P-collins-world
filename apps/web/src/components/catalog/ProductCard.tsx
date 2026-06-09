import { Card, Button } from "@/ui";

export function ProductCard({ product }: any) {
  return (
    <Card hover>
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/300"}
          alt={product.name}
          className="h-56 w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {product.discount && (
          <span className="absolute top-2 right-2 bg-[var(--color-brand-primary)] text-white text-xs px-2 py-1 rounded-full">
            -{product.discount}%
          </span>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="font-semibold text-[var(--color-brand-text)] line-clamp-1">
          {product.name}
        </h3>
        <p className="text-[var(--color-brand-primary)] font-bold text-lg">
          ₦{product.price?.toLocaleString()}
        </p>
        <Button className="w-full">Add to Cart</Button>
      </div>
    </Card>
  );
}