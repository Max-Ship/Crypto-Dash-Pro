import type { CoinMarket, FavoriteCoin } from "../interface/interface";

const FAVORITES_KEY = "cryptoFavorites";

export const storage = {
  getFavorites(): FavoriteCoin[] {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveFavorites(favs: FavoriteCoin[]): void {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  },

  toggleFavorite(coin: CoinMarket): void {
    const favorites = this.getFavorites();
    const exists = favorites.some((f) => f.id === coin.id);

    if (exists) {
      this.saveFavorites(favorites.filter((f) => f.id !== coin.id));
    } else {
      this.saveFavorites([
        { ...coin, addedAt: new Date().toISOString() },
        ...favorites,
      ]);
    }
  },

  isFavorite(coinId: string): boolean {
    return this.getFavorites().some((f) => f.id === coinId);
  },
};
