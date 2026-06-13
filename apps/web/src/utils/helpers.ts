import { Product } from "@/types/product.type";

export function isProductPopulated(productId: string | Product): productId is Product {
    return typeof productId === "object" && productId !== null && "_id" in productId;
  }
  