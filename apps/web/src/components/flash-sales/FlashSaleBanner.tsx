import { Button } from "@/ui";

export function FlashSaleBanner() {
  return (
    <div className="rounded-xl bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] p-6 text-white">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">🔥 Flash Sale</h2>
          <p className="mt-1 opacity-90">Up to 70% off on selected items</p>
        </div>
        <Button variant="secondary" className="bg-white text-[var(--color-brand-primary)] hover:bg-gray-100">
          Shop Now
        </Button>
      </div>
    </div>
  );
}