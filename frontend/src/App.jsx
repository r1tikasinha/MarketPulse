import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Watchlist from "./pages/Watchlist";
import Markets from "./pages/Markets";
import Changes from "./pages/Changes";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import StockDetails from "./pages/StockDetails";

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/changes" element={<Changes />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings" element={<Settings />} />

            <Route
              path="/stock/:symbol"
              element={<StockDetails />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;