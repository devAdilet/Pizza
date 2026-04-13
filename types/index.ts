export interface SizeOption {
  label: string;
  priceModifier: number;
}

export interface CrustOption {
  label: string;
  priceModifier: number;
}

export type ToppingState = 'None' | 'Regular' | 'Extra' | 'Left Half' | 'Right Half';

export interface ToppingSelection {
  id: string;
  name: string;
  state: ToppingState;
  priceModifier: number;
}

export interface Pizza {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  imageUrl: string;
  
  isCustomizable?: boolean;
  availableSizes?: SizeOption[];
  availableCrusts?: CrustOption[];

  kcal?: number;
  rating?: number;
  prepTime?: string;
}

export interface CartItem extends Pizza {
  cartItemId: string;
  quantity: number;
  finalPrice: number;
  
  selectedSize?: SizeOption;
  selectedCrust?: CrustOption;
  selectedToppings?: ToppingSelection[];
  specialInstructions?: string;
}

export interface AddToCartPayload {
  pizza: Pizza;
  quantity?: number;
  selectedSize?: SizeOption;
  selectedCrust?: CrustOption;
  selectedToppings?: ToppingSelection[];
  specialInstructions?: string;
  finalPrice?: number;
}
