export interface Pizza {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

export interface CartItem extends Pizza {
  quantity: number;
}
