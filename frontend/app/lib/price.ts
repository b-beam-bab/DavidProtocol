import { z } from "zod";
import { cache } from "react";

const priceResponseSchema = z.object({
  data: z.array(
    z.object({
      symbol: z.string(),
      prices: z.array(
        z.object({
          currency: z.string(),
          value: z.string(),
          lastUpdatedAt: z.string(),
        })
      ),
      error: z.null(),
    })
  ),
});

export const getEthPrice = cache(async () => {
  console.log(process.env.ALCHEMY_API_KEY);
  try {
    const response = await fetch(
      "https://api.g.alchemy.com/prices/v1/tokens/by-symbol?symbols=ETH",
      {
        headers: {
          Authorization: `Bearer ${process.env.ALCHEMY_API_KEY}`,
          accept: "application/json",
        },
        // Add cache control for production
        next: {
          revalidate: 60,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ETH price: ${response.statusText}`);
    }

    const data = await response.json();
    const parsed = priceResponseSchema.parse(data);
    return parseFloat(parsed.data[0].prices[0].value);
  } catch (error) {
    console.error("Error fetching ETH price:", error);
    throw error;
  }
});
