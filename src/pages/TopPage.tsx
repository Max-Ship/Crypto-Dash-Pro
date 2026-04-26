import { useState, useEffect, useCallback } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { CoinCard } from "../components/CoinCard";
import { fetchTopCoins, fetchChart } from "../api/coingecko";
import type { CoinMarket, ChartPoint } from "../interface/interface";

const TopPage: React.FC = () => {
  const [coins, setCoins] = useState<CoinMarket[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CoinMarket | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopCoins()
      .then(setCoins)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCoinClick = useCallback(async (coin: CoinMarket) => {
    setSelectedCoin(coin);
    setLoading(true);
    try {
      const data = await fetchChart(coin.id, 30);
      setChartData(data);
    } catch (error) {
      console.error("Chart error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading && coins.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 to-purple-900 flex items-center justify-center">
        <div className="text-3xl text-white animate-pulse">
          Loading Markets...
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 pb-6">
        <h2 className="text-4xl font-bold text-center mb-12 bg-linear-to-r from-slate-200 to-slate-300 bg-clip-text text-transparent drop-shadow-lg">
          Top 10 by Market Cap
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {coins.map((coin) => (
            <CoinCard
              key={coin.id}
              coin={coin}
              onClick={() => handleCoinClick(coin)}
            />
          ))}
        </div>

        {selectedCoin && (
          <section className="max-w-auto mx-auto bg-slate-900/30 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-slate-700/50 shadow-2xl mt-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 gap-6">
              <div className="flex items-center space-x-6">
                <img
                  src={selectedCoin.image}
                  alt={selectedCoin.name}
                  className="w-20 h-20 rounded-3xl shadow-2xl ring-4 ring-blue-500/30"
                />
                <div>
                  <h2 className="text-4xl lg:text-5xl font-black bg-linear-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">
                    {selectedCoin.name}
                  </h2>
                  <p className="text-2xl text-slate-400 font-mono uppercase">
                    {selectedCoin.symbol.toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-5xl font-black">
                  ${selectedCoin.current_price.toLocaleString()}
                </div>
                <div
                  className={`text-2xl font-bold flex items-center justify-end ${
                    selectedCoin.price_change_percentage_24h >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {selectedCoin.price_change_percentage_24h.toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="w-full h-112.5 lg:h-137.5 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="priceGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop
                        offset="100%"
                        stopColor="#ec4899"
                        stopOpacity={0.9}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="5 5"
                    stroke="#374151"
                    strokeOpacity={0.3}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
                    stroke="#94a3b8"
                    fontSize={14}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={14}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
                  />
                  <Tooltip
                    labelFormatter={() => ""}
                    contentStyle={{
                      background: "rgba(15, 23, 42, 0.95)",
                      border: "1px solid #475569",
                      borderRadius: "16px",
                      padding: "16px",
                      backdropFilter: "blur(20px)",
                    }}
                    formatter={(value) =>
                      value != null
                        ? [`$${Number(value).toLocaleString()}`]
                        : ["-"]
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="url(#priceGradient)"
                    strokeWidth={5}
                    dot={{ fill: "#3b82f6", strokeWidth: 4, r: 8 }}
                    activeDot={{
                      r: 12,
                      strokeWidth: 4,
                      fill: "#6366f1",
                      stroke: "#ffffff",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}
      </section>
    </>
  );
};

export default TopPage;
