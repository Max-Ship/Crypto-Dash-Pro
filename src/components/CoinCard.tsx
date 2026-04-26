import { useState, memo } from "react";
import { Heart, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { storage } from "../utils/storage";
import placeholder from "../assets/favicon.svg";
import type { CoinMarket } from "../interface/interface";

interface CoinCardProps {
  coin: CoinMarket;
  onClick: () => void;
}

export const CoinCard: React.FC<CoinCardProps> = memo(({ coin, onClick }) => {
  const change = Number(coin.price_change_percentage_24h);
  const isUp = change > 0;
  const [isFav, setIsFav] = useState(() => storage.isFavorite(coin.id));

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    storage.toggleFavorite(coin);
    setIsFav(!isFav);
  };

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.05, rotateX: 5, y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="max-h-63.5 bg-linear-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-slate-700/50 hover:border-blue-500/70 hover:shadow-blue-500/25 cursor-pointer group overflow-hidden hover:shadow-2xl relative"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-linear-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4  max-h-45.25">
          <div className="flex items-center space-x-3">
            <img
              src={coin.image || placeholder}
              alt={coin.name}
              className="w-14 h-14 rounded-2xl shadow-lg ring-2 ring-white/20 hover:scale-110 transition-transform duration-300"
            />
            <div>
              <h3 className="line-clamp-2 font-bold text-white text-lg leading-tight drop-shadow-sm">
                {coin.name}
              </h3>
              <p className="text-slate-400 text-sm font-mono uppercase tracking-wider">
                {coin.symbol.toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        <div className="text-right pt-2">
          <p className="text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-lg">
            ${coin.current_price.toLocaleString()}
          </p>
          <div
            className={`flex items-center justify-end space-x-1 font-semibold text-sm md:text-base mt-2 mb-3 ${
              isUp ? "text-green-400 animate-pulse" : "text-red-400"
            }`}
          >
            <motion.button
              whileHover={{ scale: 1.2, rotate: 360 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-xl mr-auto transition-all backdrop-blur-sm border border-slate-600/50 shadow-lg shrink-0 ${
                isFav
                  ? "bg-linear-to-r from-orange-500/80 to-red-500/80 border-orange-400/50 shadow-orange-500/30"
                  : "bg-slate-700/60 hover:bg-orange-500/60 border-slate-600/50 hover:border-orange-400/50 hover:shadow-orange-500/30"
              }`}
              onClick={handleFavoriteClick}
              title={isFav ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={`w-6 h-6 transition-all duration-300 ${
                  isFav
                    ? "fill-current text-white drop-shadow-lg scale-110"
                    : "text-slate-300 hover:text-orange-300"
                }`}
              />
            </motion.button>

            <span>{change.toFixed(4)}%</span>
            {isUp ? (
              <TrendingUp className="w-5 h-5 animate-bounce" />
            ) : (
              <TrendingDown className="w-5 h-5 animate-pulse" />
            )}
          </div>

          <p className="text-xs text-slate-500 mt-1 font-mono">
            Cap: ${coin.market_cap?.toLocaleString() ?? "N/A"}
          </p>
        </div>
      </div>
    </motion.div>
  );
});
