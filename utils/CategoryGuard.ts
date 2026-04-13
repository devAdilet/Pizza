export const isCustomizable = (category: string): boolean => {
  return !['Beverages', 'Desserts'].includes(category);
};
