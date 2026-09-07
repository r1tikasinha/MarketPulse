import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  ChevronRight,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Markets() {
  const navigate = useNavigate();

  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarkets();
  }, []);

  const loadMarkets = async () => {
    try {
      const response = await fetch(
        "https://marketpulse-r28a.onrender.com/api/market"
      );

      const result = await response.json();

      if (result.success) {
        setStocks(result.data || []);
      }
    } catch (error) {
      console.error("Markets error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const filteredStocks = stocks.filter((stock) => {
    const query = search.toLowerCase();

    return (
      stock.symbol.toLowerCase().includes(query) ||
      stock.name.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="page">
        <div className="loading-state">
          Loading market data...
        </div>
      </div>
    );
  }

  return (
    <div className="page">

      {/* Header */}
      <div className="page-header">
        <div>
          <p className="eyebrow">MARKET DATA</p>

          <h1>Markets</h1>

          <p className="page-subtitle">
            Explore market performance and activity.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="markets-toolbar">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search stocks..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="market-count">
          {stocks.length} stocks available
        </div>
      </div>

      {/* Market table */}
      <div className="markets-container">

        <div className="markets-header">
          <span>STOCK</span>
          <span>PRICE</span>
          <span>CHANGE</span>
          <span>VOLUME</span>
          <span>VOLATILITY</span>
          <span></span>
        </div>

        {filteredStocks.map((stock) => {

          const isPositive =
            stock.changePercent >= 0;

          return (
            <div
              className="market-row"
              key={stock.symbol}
              onClick={() =>
                navigate(`/stock/${stock.symbol}`)
              }
            >

              {/* Stock */}
              <div className="market-stock">

                <div className="market-icon">
                  <BarChart3 size={17} />
                </div>

                <div>
                  <strong>{stock.symbol}</strong>

                  <span>{stock.name}</span>
                </div>

              </div>

              {/* Price */}
              <div className="market-price">
                ₹{formatPrice(stock.price)}
              </div>

              {/* Change */}
              <div
                className={`market-change ${
                  isPositive
                    ? "positive"
                    : "negative"
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight size={15} />
                ) : (
                  <ArrowDownRight size={15} />
                )}

                {isPositive ? "+" : ""}
                {stock.changePercent}%
              </div>

              {/* Volume */}
              <div className="market-volume">
                {(stock.volume / 1000000).toFixed(2)}M
              </div>

              {/* Volatility */}
              <div className="market-volatility">
                {stock.volatility}
              </div>

              {/* Arrow */}
              <div className="market-arrow">
                <ChevronRight size={18} />
              </div>

            </div>
          );
        })}

        {filteredStocks.length === 0 && (
          <div className="watchlist-empty">
            <BarChart3 size={30} />

            <h3>No stocks found</h3>

            <p>
              Try searching for another stock.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}

export default Markets;