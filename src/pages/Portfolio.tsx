import { useState, useEffect, useMemo } from "react";
import { CircleX, Plus, RefreshCw, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { fetchTopCoins } from "../api/coingecko";
import type { CoinMarket } from "../interface/interface";

interface Holding {
  id: string;
  amount: number;
  addedAt: string;
}

const Portfolio = () => {
  const [holdings, setHoldings] = useState<Record<string, Holding>>({});
  const [coins, setCoins] = useState<CoinMarket[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCoinId, setNewCoinId] = useState("");
  const [newAmount, setNewAmount] = useState(0);

  useEffect(() => {
    const updatePrices = async () => {
      try {
        const data = await fetchTopCoins();
        setCoins(data);
        const priceMap: Record<string, number> = {};
        data.forEach((coin) => {
          priceMap[coin.id] = coin.current_price;
        });
        setPrices(priceMap);
      } catch (error) {
        console.error("Price update failed:", error);
      }
    };

    updatePrices();
    const interval = setInterval(updatePrices, 30000);

    return () => clearInterval(interval);
  }, []);

  const portfolioData = useMemo(() => {
    return Object.entries(holdings).map(([id, holding]) => {
      const coin = coins.find((c) => c.id === id);
      const value = prices[id] * holding.amount || 0;
      const change = coin?.price_change_percentage_24h || 0;
      return {
        id,
        name: coin?.name || id,
        symbol: coin?.symbol?.toUpperCase() || "",
        amount: holding.amount,
        value,
        change,
        pnl: value * (change / 100),
      };
    });
  }, [holdings, coins, prices]);

  const totalValue = useMemo(
    () => portfolioData.reduce((sum, h) => sum + h.value, 0),
    [portfolioData],
  );
  const totalPnl = useMemo(
    () => portfolioData.reduce((sum, h) => sum + h.pnl, 0),
    [portfolioData],
  );

  const pieData = useMemo(
    () => portfolioData.map((h) => ({ name: h.symbol, value: h.value })),
    [portfolioData],
  );

  const addHolding = () => {
    setHoldings((prev) => ({
      ...prev,
      [newCoinId]: {
        id: newCoinId,
        amount: Number(newAmount.toFixed(8)),
        addedAt: new Date().toISOString(),
      },
    }));
    setShowAddModal(false);
    setNewCoinId("");
    setNewAmount(0);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setNewAmount(0);
    setNewCoinId("");
  };

  const removeHolding = (id: string) => {
    setHoldings((prev) => {
      const newHoldings = { ...prev };
      delete newHoldings[id];
      return newHoldings;
    });
  };

  const clearAll = () => {
    if (confirm("Clear All Data Portfolio?")) {
      setHoldings({});
    }
  };

  const COLORS = [
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#eab308",
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-900/20 via-slate-900/50 to-purple-900/20 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-7xl font-black text-center mb-12 bg-clip-text text-transparent bg-linear-to-r from-emerald-400 via-teal-400 to-green-500 drop-shadow-2xl"
        >
          Portfolio Tracker
        </motion.h1>

        <motion.div
          className="text-center mb-16"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <div className="text-5xl md:text-7xl font-black text-white mb-4">
            ${totalValue.toLocaleString()}
          </div>
          <div
            className={`text-2xl font-bold flex items-center justify-center space-x-2 ${
              totalPnl >= 0 ? "text-green-400 animate-pulse" : "text-red-400"
            }`}
          >
            <span>
              P&L: {totalPnl >= 0 ? "+" : ""}${totalPnl.toLocaleString()}
            </span>
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.section
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold bg-linear-to-r from-slate-200 to-slate-300 bg-clip-text">
                  Holdings ({portfolioData.length})
                </h2>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/50 p-4 rounded-2xl font-semibold transition-all"
                    onClick={() => setShowAddModal(true)}
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 p-4 rounded-2xl font-semibold transition-all"
                    onClick={clearAll}
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Clear All</span>
                  </motion.button>
                </div>
              </div>
              <div className="space-y-4 max-h-96 overflow-hidden">
                {portfolioData.length === 0 ? (
                  <div className="text-center py-16 text-slate-500">
                    <Plus className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl">Add your first Coin</p>
                  </div>
                ) : (
                  portfolioData.map((holding) => (
                    <motion.div
                      key={holding.id}
                      className="flex items-center justify-between p-6 bg-slate-800/50 hover:bg-slate-700/50 rounded-2xl transition-all group border border-slate-700/50"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-14 h-14 bg-linear-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="font-bold text-white text-lg">
                            {holding.symbol}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-xl truncate">
                            {holding.name}
                          </p>
                          <p className="text-sm text-slate-400">
                            {holding.amount.toFixed(8)} coins
                          </p>
                        </div>
                      </div>
                      <div className="text-right min-w-35">
                        <p className="text-2xl font-black text-white">
                          ${holding.value.toLocaleString()}
                        </p>
                        <div
                          className={`flex items-center justify-around space-x-1 text-lg font-semibold ${
                            holding.change >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          <span>
                            {holding.change >= 0 ? "+" : ""}
                            {holding.change.toFixed(2)}%
                          </span>
                          <span className="text-sm">
                            {holding.pnl >= 0 ? "+" : ""}
                            {holding.pnl.toFixed(2).toLocaleString()}$
                          </span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeHolding(holding.id)}
                        className="p-3 ml-4 bg-red-500/80 hover:bg-red-600 rounded-xl transition-all shadow-lg hover:shadow-red-500/50 text-white font-bold"
                        title="Delete coin"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl h-96 flex flex-col">
              <h2 className="text-3xl font-bold bg-linear-to-r from-slate-200 to-slate-300 bg-clip-text mb-6 text-center">
                Allocation
              </h2>
              {pieData.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-slate-500">
                  <p className="text-xl">No data available for chart</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.section>
        </div>
      </div>

      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => {
            return;
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-8 max-w-md w-full border border-slate-700/50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-6 text-center bg-linear-to-r from-emerald-400 to-green-500 bg-clip-text">
              Add to Portfolio
            </h3>
            <div className="space-y-4">
              <select
                value={newCoinId}
                onChange={(e) => setNewCoinId(e.target.value)}
                className="w-full p-4 bg-slate-800/50 border border-slate-600 rounded-2xl text-white text-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="">Select a coin...</option>
                {coins.map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol.toUpperCase()}) $
                    {coin.current_price.toLocaleString()}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="0.0000001"
                step="0.0000001"
                placeholder="0.12345678"
                value={newAmount || 0}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewAmount(val === "" ? 0 : parseFloat(val));
                }}
                className="w-full p-4 bg-slate-800/50 border border-slate-600 rounded-2xl text-white text-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              />
              <div className="flex gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center justify-center flex-1 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-emerald-500/50"
                  onClick={addHolding}
                >
                  <Plus className="w-5 h-5 mr-1" />
                  <span>Add Coin</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center justify-center flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 p-4 rounded-2xl transition-all"
                  onClick={closeModal}
                >
                  <CircleX className="w-5 h-5 mr-1 text-red-500" />
                  <span>Cancel</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Portfolio;
