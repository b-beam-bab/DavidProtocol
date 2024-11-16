import { useQuery } from "@tanstack/react-query";

export function useEthPrice() {
  return useQuery({
    queryKey: ["ethPrice"],
    queryFn: async () => {
      const response = await fetch("/api/eth-price");
      if (!response.ok) {
        throw new Error("Failed to fetch ETH price");
      }
      const data = await response.json();
      if ("error" in data) {
        throw new Error(data.error);
      }
      return Number(data.price);
    },
    refetchInterval: 60000, // Refetch every minute
  });
}
