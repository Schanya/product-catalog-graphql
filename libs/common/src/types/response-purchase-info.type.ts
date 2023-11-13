class ProductsInfo {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

export class ResponsePurchaseInfo {
  currency: string;
  products: { commonInfo: ProductsInfo; amount: number }[];
}
