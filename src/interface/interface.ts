export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
}

export interface ChartPoint {
  time: string;
  price: number;
}

export interface FavoriteCoin extends CoinMarket {
  addedAt: string;
}
