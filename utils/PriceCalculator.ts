import { SizeOption, CrustOption, ToppingSelection } from '@/types';

export const calculateFinalPrice = (
  basePrice: number,
  selectedSize?: SizeOption,
  selectedCrust?: CrustOption,
  selectedToppings?: ToppingSelection[]
): number => {
  const sizePrice = selectedSize?.priceModifier || 0;
  const crustPrice = selectedCrust?.priceModifier || 0;
  const toppingsPrice = (selectedToppings || []).reduce((acc, t) => {
    return acc + (t.state === 'Extra' ? t.priceModifier * 2 : t.priceModifier);
  }, 0);

  return basePrice + sizePrice + crustPrice + toppingsPrice;
};
