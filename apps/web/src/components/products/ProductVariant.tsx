interface Variant {
    id: string;
    name: string;
    value: string;
    price?: number;
    stock?: number;
    sku?: string;
  }
  
  interface ProductVariantProps {
    variants: Variant[];
    selected: Variant | null;
    onSelect: (variant: Variant) => void;
    type?: 'color' | 'size' | 'default';
  }
  
  export function ProductVariant({ variants, selected, onSelect, type = 'default' }: ProductVariantProps) {
    if (type === 'color') {
      return (
        <div className="flex flex-wrap gap-3">
          {variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => onSelect(variant)}
              className={`
                w-10 h-10 rounded-full border-2 transition-all
                ${selected?.id === variant.id ? 'border-[var(--color-brand-primary)] scale-110' : 'border-gray-300'}
              `}
              style={{ backgroundColor: variant.value.toLowerCase() }}
              title={variant.name}
            />
          ))}
        </div>
      );
    }
  
    if (type === 'size') {
      return (
        <div className="flex flex-wrap gap-3">
          {variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => onSelect(variant)}
              disabled={variant.stock === 0}
              className={`
                px-4 py-2 rounded-lg border transition-all
                ${selected?.id === variant.id
                  ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] text-white'
                  : 'border-gray-300 hover:border-[var(--color-brand-primary)]'
                }
                ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {variant.name}
              {variant.stock === 0 && <span className="ml-1 text-xs">(Sold Out)</span>}
            </button>
          ))}
        </div>
      );
    }
  
    // Default variant display
    return (
      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => onSelect(variant)}
            disabled={variant.stock === 0}
            className={`
              px-4 py-2 rounded-lg border transition-all
              ${selected?.id === variant.id
                ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]'
                : 'border-gray-300 hover:border-[var(--color-brand-primary)]'
              }
              ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="text-sm font-medium">{variant.name}</div>
            {variant.price && (
              <div className="text-xs text-gray-500">+₦{variant.price.toLocaleString()}</div>
            )}
          </button>
        ))}
      </div>
    );
  }