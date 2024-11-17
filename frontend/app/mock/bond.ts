export function generateMockPriceHistory(
  currentPrice: number,
  days: number = 90
) {
  const priceHistory = [];
  const today = new Date();
  const startingPrice = currentPrice * 0.9; // Start at 90% of current price

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Calculate the base price for this day (linear increase)
    const basePrice =
      startingPrice + (currentPrice - startingPrice) * ((days - i) / days);

    // Add some noise to the price (±2.5% of the base price)
    const noise = (Math.random() - 0.5) * 0.05 * basePrice;
    const price = basePrice + noise;

    priceHistory.push({
      date: date.toISOString().split("T")[0], // YYYY-MM-DD format
      price: Number(price.toFixed(2)),
    });
  }

  return priceHistory;
}
