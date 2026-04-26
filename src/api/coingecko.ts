import axios from "axios";
import type { CoinMarket, ChartPoint } from "../interface/interface";

const API_BASE = "https://api.coingecko.com/api/v3";

export const fetchTopCoins = async (): Promise<CoinMarket[]> => {
  const { data } = await axios.get(`${API_BASE}/coins/markets`, {
    params: {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: 10,
      page: 1,
    },
  });
  return data;
};

export const fetchChart = async (
  id: string,
  days: number = 30,
): Promise<ChartPoint[]> => {
  const { data } = await axios.get(`${API_BASE}/coins/${id}/market_chart`, {
    params: { vs_currency: "usd", days },
  });

  return (data.prices as [number, number][]).map(([timestamp, price]) => ({
    time: new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    price: Number(price),
  }));
};

export const fetchAllCoins = async (
  page: number = 1,
): Promise<CoinMarket[]> => {
  const { data } = await axios.get(`${API_BASE}/coins/markets`, {
    params: {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: 30,
      page,
      sparkline: false,
      price_change_percentage: "24h",
    },
  });
  return data;
};
