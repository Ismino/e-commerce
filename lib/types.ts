export type Product = {
  id: number;
  title: string;
  description?: string;
  price: number;
  rating: number;
  category: string;
  thumbnail: string;
  images?: string[];
};

export type ProductsResponse = {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type Category = { slug: string; name: string };
