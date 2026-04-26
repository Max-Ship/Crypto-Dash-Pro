import { useState, useMemo } from "react";
import { Heart, Trash2, Star } from "lucide-react";
import { motion } from "framer-motion";
import { storage } from "../utils/storage";
import type { FavoriteCoin } from "../interface/interface";

const FavoritesPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<FavoriteCoin[]>(
    storage.getFavorites(),
  );

  const removeFavorite = (id: string) => {
    const coinToRemove = favorites.find((f) => f.id === id);
    if (coinToRemove) {
      storage.toggleFavorite(coinToRemove);
      setFavorites(storage.getFavorites());
    }
  };

  const filteredFavorites = useMemo(() => {
    return favorites.filter(
      (f) =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.symbol.toLowerCase().includes(search.toLowerCase()),
    );
  }, [favorites, search]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-orange-900/10 to-slate-900 p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black text-center mb-12 bg-clip-text text-transparent bg-linear-to-r from-orange-400 to-red-500 drop-shadow-2xl">
          My Favorites ({favorites.length})
        </h1>

        <div className="mb-12">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search favorites (BTC, ETH...)"
              className="w-full p-4 pl-12 pr-12 bg-slate-800/50 backdrop-blur-xl border border-slate-600 rounded-2xl text-lg font-medium placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 shadow-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-orange-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFavorites.length === 0 ? (
            <div className="col-span-full text-center py-32 text-slate-400 animate-pulse">
              <Heart
                className="w-32 h-32 mx-auto mb-8 opacity-20"
                strokeWidth={1}
              />
              <h3 className="text-3xl font-bold mb-4">No favorites yet</h3>
              <p className="text-xl">
                Add coins from{" "}
                <span className="font-semibold text-orange-400">Dashboard</span>{" "}
                →{" "}
                <Heart
                  className="inline w-5 h-5 mx-auto"
                  strokeWidth={3}
                  stroke="orange"
                  fill="white"
                />
              </p>
            </div>
          ) : (
            filteredFavorites.map((coin) => (
              <motion.div
                key={coin.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-linear-to-br from-slate-800 to-orange-900/20 p-8 rounded-3xl border border-slate-700/50 hover:border-orange-500 hover:shadow-2xl hover:bg-orange-900/30 transition-all duration-500 hover:scale-[1.02]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4 flex-1">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-20 h-20 rounded-2xl shadow-2xl ring-2 ring-slate-700/50"
                    />
                    <div>
                      <h3 className="text-2xl font-bold bg-linear-to-r from-white to-slate-200 bg-clip-text text-transparent">
                        {coin.name}
                      </h3>
                      <p className="text-orange-400 font-semibold text-xl">
                        {coin.symbol.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFavorite(coin.id)}
                    className="p-3 bg-slate-700/50 hover:bg-red-500/70 rounded-2xl transition-all duration-300 group-hover:scale-110 hover:shadow-lg ml-4"
                    title="Remove favorite"
                  >
                    <Trash2 className="w-6 h-6 text-slate-400 group-hover:text-red-400" />
                  </button>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="text-4xl font-black text-white">
                    ${coin.current_price.toLocaleString()}
                  </div>
                  <div
                    className={`flex items-center space-x-2 text-2xl font-bold ${
                      coin.price_change_percentage_24h >= 0
                        ? "text-green-400 animate-pulse"
                        : "text-red-400"
                    }`}
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </div>
                  <div className="flex items-center text-sm text-slate-400 space-x-4">
                    <span>
                      Added: {new Date(coin.addedAt).toLocaleDateString()}
                    </span>
                    <span>
                      Cap: ${coin.market_cap?.toLocaleString() || "N/A"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
