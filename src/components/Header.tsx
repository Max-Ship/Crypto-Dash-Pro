import { NavLink } from "react-router-dom";
import { Home, Heart, List, DollarSign } from "lucide-react";

const Header = () => {
  const baseLink =
    "flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl font-semibold border transition-all duration-300 min-w-35";

  return (
    <header className="text-center mb-12 pt-6">
      <h1 className="text-6xl md:text-7xl font-black bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-purple-400 to-indigo-400 drop-shadow-2xl mb-6">
        Crypto Dash Pro
      </h1>
      <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6">
        Real-time prices, charts. Built with React + TypeScript + CoinGecko API
      </p>

      <nav className="flex flex-col sm:flex-row justify-center gap-4 max-w-4xl mx-auto p-2 bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50">
        <NavLink
          to="/"
          className={({ isActive }) => `
            ${baseLink} bg-linear-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 hover:from-blue-500/40 shadow-lg hover:shadow-blue-500/25
            ${isActive ? "scale-105 border-blue-400 underline decoration-blue-400 decoration-2 underline-offset-8" : "hover:scale-105"}
          `}
        >
          <Home className="w-6 h-6" />
          <span>Top 10</span>
        </NavLink>

        <NavLink
          to="/favorites"
          className={({ isActive }) => `
            ${baseLink} bg-linear-to-r from-orange-500/20 to-red-500/20 border-orange-500/30 hover:from-orange-500/40 shadow-lg hover:shadow-orange-500/25
            ${isActive ? "scale-105 border-orange-400 underline decoration-orange-400 decoration-2 underline-offset-8" : "hover:scale-105"}
          `}
        >
          <Heart className="w-6 h-6" />
          <span>Favorites</span>
        </NavLink>

        <NavLink
          to="/all-coins"
          className={({ isActive }) => `
            ${baseLink} bg-linear-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/30 hover:from-emerald-500/40 shadow-lg hover:shadow-emerald-500/25
            ${isActive ? "scale-105 border-emerald-400 underline decoration-emerald-400 decoration-2 underline-offset-8" : "hover:scale-105"}
          `}
        >
          <List className="w-6 h-6" />
          <span>All Coins</span>
        </NavLink>

        <NavLink
          to="/portfolio"
          className={({ isActive }) => `
            ${baseLink} bg-linear-to-r from-yellow-500/30 via-orange-400/30 to-amber-500/30 border-2 border-yellow-400/50 hover:from-yellow-500/50 hover:to-orange-500/50 shadow-lg hover:shadow-yellow-500/30
            ${isActive ? "scale-105 border-yellow-400 underline decoration-yellow-400 decoration-2 underline-offset-8 shadow-2xl" : "hover:scale-105"}
          `}
        >
          <DollarSign className="w-6 h-6" />
          <span>Portfolio</span>
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
