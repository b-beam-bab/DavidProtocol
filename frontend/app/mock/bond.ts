import { Bond } from "@/lib/types";
import { sepolia } from "viem/chains";

export const MOCK_BONDS: Bond[] = [
  {
    id: 1,
    name: "ETH",
    network: sepolia,
    maturityDate: Date.parse("27 Mar, 2025"),
    liquidity: 6.53,
    maturityValue: "1 ETH",
    fixedAPY: 47.15,
    price: 0.4714,
  },
  {
    id: 2,
    name: "ETH",
    network: sepolia,
    maturityDate: Date.parse("24 Apr 2025"),
    liquidity: 19.82,
    maturityValue: "1 ETH",
    fixedAPY: 43.43,
    price: 0.457,
  },
  {
    id: 3,
    name: "ETH",
    network: sepolia,
    maturityDate: Date.parse("15 May 2025"),
    liquidity: 12.45,
    maturityValue: "1 ETH",
    fixedAPY: 41.22,
    price: 0.4834,
  },
  {
    id: 4,
    name: "ETH",
    network: sepolia,
    maturityDate: Date.parse("30 Jun 2025"),
    liquidity: 8.91,
    maturityValue: "1 ETH",
    fixedAPY: 39.75,
    price: 0.4912,
  },
  {
    id: 5,
    name: "ETH",
    network: sepolia,
    maturityDate: Date.parse("15 Aug 2025"),
    liquidity: 15.33,
    maturityValue: "1 ETH",
    fixedAPY: 37.89,
    price: 0.5067,
  },
];

export const MOCK_ISSUED_BONDS: (Bond & { amount: number })[] = [
  { ...MOCK_BONDS[0], amount: 15 },
  { ...MOCK_BONDS[1], amount: 10 },
  { ...MOCK_BONDS[2], amount: 20 },
  { ...MOCK_BONDS[3], amount: 5 },
  { ...MOCK_BONDS[4], amount: 7 },
];

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
