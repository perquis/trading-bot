export const currencyFormat = (buyPrice: number, quantity: number): string =>
  Intl.NumberFormat("en-ES", { currency: "USD", style: "currency" }).format(buyPrice * quantity);
