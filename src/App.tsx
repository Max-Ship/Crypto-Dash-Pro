import { useEffect, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import TopPage from "./pages/TopPage";
import FavoritesPage from "./pages/FavoritesPage";
import AllCoins from "./pages/AllCoins";
import Portfolio from "./pages/Portfolio";

function App() {
  const [globalError, setGlobalError] = useState<string | null>(() => {
    return sessionStorage.getItem("last_api_error");
  });

  useEffect(() => {
    if (globalError) {
      sessionStorage.removeItem("last_api_error");
    }

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const msg =
          "Network error or API limit reached. Please wait a minute and refresh the page.";

        setGlobalError(msg);
        sessionStorage.setItem("last_api_error", msg);

        return Promise.reject(error);
      },
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [globalError]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white antialiased">
      <BrowserRouter basename="/">
        <Header />
        <Routes>
          <Route path="/" element={<TopPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/all-coins" element={<AllCoins />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center text-2xl">
                404 - Go to{" "}
                <Link to="/" className="text-blue-400 hover:text-blue-300">
                  Dashboard
                </Link>
              </div>
            }
          />
        </Routes>

        {globalError && (
          <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
            <div className="relative bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-red-500" />
              </div>
              <h2 className="text-3xl font-black mb-2 text-white">
                Oops! API Limit
              </h2>
              <p className="text-slate-400 text-lg mb-8">{globalError}</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setGlobalError(null);
                    window.location.reload();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
