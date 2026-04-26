import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAllCoins } from "../api/coingecko";
import { CoinCard } from "../components/CoinCard";
import type { CoinMarket } from "../interface/interface";

const AllCoins = () => {
  const [coins, setCoins] = useState<CoinMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [filterUp, setFilterUp] = useState<"all" | "up" | "down">("all");

  const loadingCoins = 30;

  const loadCoins = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const data = await fetchAllCoins(pageNum);
      setCoins(data);
      setHasMore(data.length === loadingCoins);
    } catch (error) {
      console.error("Failed to load coins", error);
      setCoins([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => loadCoins(page))();
  }, [page, loadCoins]);

  const filteredCoins = useMemo(() => {
    return coins.filter((coin) => {
      const matchesSearch =
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filterUp === "all"
          ? true
          : filterUp === "up"
            ? coin.price_change_percentage_24h > 0
            : coin.price_change_percentage_24h <= 0;

      return matchesSearch && matchesFilter;
    });
  }, [coins, search, filterUp]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handleFilter = useCallback((type: "all" | "up" | "down") => {
    setFilterUp(type);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 px-4"
      >
        <h1 className="text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-linear-to-r from-emerald-400 via-teal-400 to-green-400 drop-shadow-2xl mb-6">
          All Coins
        </h1>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-12">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Bitcoin, ETH, SOL..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:border-emerald-500/70 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-xl hover:shadow-emerald-500/20"
            />
          </div>

          <div className="flex gap-2 bg-slate-900/50 backdrop-blur-xl p-2 rounded-2xl border border-slate-700/50">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFilter("all")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
                filterUp === "all"
                  ? "bg-emerald-500/20 border-green-500/50 shadow-emerald-500/25 text-emerald-300"
                  : "text-slate-300 hover:bg-slate-500/50 hover:border-slate-500/50"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>All</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFilter("up")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
                filterUp === "up"
                  ? "bg-green-500/20 border-green-500/50 shadow-green-500/25 text-green-300"
                  : "text-green-400 hover:bg-slate-700/50 hover:border-slate-500/50"
              }`}
            >
              <TrendingUp className="w-5 h-5 animate-bounce" />
              <span>Up</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFilter("down")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
                filterUp === "down"
                  ? "bg-red-500/20 border-red-500/50 shadow-red-500/25 text-red-300"
                  : "text-red-300 hover:bg-slate-700/50 hover:border-slate-500/50"
              }`}
            >
              <TrendingDown className="w-5 h-5 animate-pulse" />
              <span>Down</span>
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {Array(20)
                .fill(0)
                .map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="bg-slate-800/50 backdrop-blur-xl rounded-3xl h-80 animate-pulse"
                  />
                ))}
            </div>
          ) : coins.length === 0 || filteredCoins.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32"
            >
              <Search className="w-24 h-24 text-slate-600 mx-auto mb-8 opacity-50" />
              <h3 className="text-3xl font-bold text-slate-400 mb-4">
                No results found
              </h3>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-16">
              <AnimatePresence>
                {filteredCoins.map((coin, index) => (
                  <motion.div
                    key={coin.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <CoinCard
                      coin={coin}
                      onClick={() => {
                        return;
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>

        {!loading && coins.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-16">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="p-3 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-600/50 hover:bg-slate-700/70 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-emerald-500/20 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            <motion.div className="text-xl font-bold text-slate-200 px-8 py-3 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50">
              Страница {page}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setPage(page + 1)}
              disabled={!hasMore}
              className="p-3 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-600/50 hover:bg-slate-700/70 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-emerald-500/20 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCoins;
