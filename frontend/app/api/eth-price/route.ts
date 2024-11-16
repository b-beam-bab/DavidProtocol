import { z } from "zod";

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

export async function GET() {
  try {
    const response = await fetch(
      "https://api.g.alchemy.com/prices/v1/tokens/by-symbol?symbols=ETH",
      {
        headers: {
          Authorization: `Bearer ${process.env.ALCHEMY_API_KEY}`,
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: "Failed to fetch ETH price" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const parsed = priceResponseSchema.parse(data);
    const price = parseFloat(parsed.data[0].prices[0].value);

    return Response.json({ price });
  } catch (error) {
    console.error("Error fetching ETH price:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
