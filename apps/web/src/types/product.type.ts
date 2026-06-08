export interface Product {
    _id:string;
    name:string;
    slug:string;
    description:string;
    sku:string;
    category:string;
    images:string[];
    // variants:Variant[];
    stock:number;
    price:number;
    salePrice?:number;
    featured:boolean;
    flashSale:boolean;
    averageRating:number;
    totalReviews:number;
    createdAt:string;
   }