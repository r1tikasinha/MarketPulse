import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [marketData, setMarketData] = useState({});
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState("");

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [watchlistResponse, marketResponse] = await Promise.all([
        fetch("http://localhost:5000/api/watchlist"),
        fetch("http://localhost:5000/api/market"),
      ]);

      const watchlistResult = await watchlistResponse.json();
      const marketResult = await marketResponse.json();

      setWatchlist(watchlistResult.data || []);

      const marketMap = {};

      (marketResult.data || []).forEach((stock) => {
        marketMap[stock.symbol] = stock;
      });

      setMarketData(marketMap);
    } catch (error) {
      console.error("Watchlist error:", error);
    } finally {
      setLoading(false);
    }
  };

  const addStock = async () => {
    if (!selectedStock) {
      return;
    }

    const stock = marketData[selectedStock];

    if (!stock) {
      return;
    }

    setAdding(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/watchlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            symbol: stock.symbol,
            name: stock.name,
            exchange: "NSE",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Unable to add stock");
        return;
      }

      setWatchlist((current) => [
        ...current,
        result.data,
      ]);

      setSelectedStock("");
      setShowModal(false);
    } catch (error) {
      console.error("Add stock error:", error);
      alert("Unable to connect to backend");
    } finally {
      setAdding(false);
    }
  };

  const removeStock = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/watchlist/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete stock");
      }

      setWatchlist((current) =>
        current.filter((stock) => stock.id !== id)
      );
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const filteredStocks = watchlist.filter((stock) => {
    const query = search.toLowerCase();

    return (
      stock.symbol.toLowerCase().includes(query) ||
      stock.name.toLowerCase().includes(query)
    );
  });

  const formatPrice = (price) => {
    return Number(price).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading-state">
          Loading your watchlist...
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">YOUR PORTFOLIO</p>

          <h1>My Watchlist</h1>

          <p className="page-subtitle">
            Track the stocks that matter most to you.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          Add Stock
        </button>
      </div>

      <div className="watchlist-toolbar">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search your watchlist..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="watchlist-count">
          {watchlist.length} stocks tracked
        </div>
      </div>

      <div className="watchlist-container">
        <div className="watchlist-header">
          <span>STOCK</span>
          <span>PRICE</span>
          <span>CHANGE</span>
          <span>EXCHANGE</span>
          <span>ACTION</span>
        </div>

        {filteredStocks.length === 0 ? (
          <div className="watchlist-empty">
            <Star size={30} />

            <h3>No stocks found</h3>

            <p>
              Try searching for another stock in your
              watchlist.
            </p>
          </div>
        ) : (
          filteredStocks.map((stock) => {
            const market = marketData[stock.symbol];

            const isPositive = market
              ? market.changePercent >= 0
              : true;

            return (
              <div
                className="watchlist-row"
                key={stock.id}
              >
                <div className="watchlist-stock">
                  <div className="stock-star">
                    <Star size={17} />
                  </div>

                  <div>
                    <strong>{stock.symbol}</strong>

                    <span>{stock.name}</span>
                  </div>
                </div>

                <div className="watchlist-price">
                  {market
                    ? `₹${formatPrice(market.price)}`
                    : "—"}
                </div>

                <div
                  className={`watchlist-change ${
                    isPositive
                      ? "positive"
                      : "negative"
                  }`}
                >
                  {market && (
                    <>
                      {isPositive ? (
                        <ArrowUpRight size={15} />
                      ) : (
                        <ArrowDownRight size={15} />
                      )}

                      {isPositive ? "+" : ""}
                      {market.changePercent}%
                    </>
                  )}
                </div>

                <div className="exchange">
                  {stock.exchange}
                </div>

                <button
                  className="delete-button"
                  onClick={() =>
                    removeStock(stock.id)
                  }
                  title="Remove from watchlist"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="add-stock-modal">
            <div className="modal-header">
              <div>
                <p className="eyebrow">WATCHLIST</p>
                <h2>Add a Stock</h2>
              </div>

              <button
                className="modal-close"
                onClick={() => {
                  setShowModal(false);
                  setSelectedStock("");
                }}
              >
                <X size={20} />
              </button>
            </div>

            <p className="modal-description">
              Choose a stock to start tracking its market
              movement.
            </p>

            <label>Select Stock</label>

            <select
              value={selectedStock}
              onChange={(event) =>
                setSelectedStock(event.target.value)
              }
            >
              <option value="">
                Choose a stock...
              </option>

              {Object.values(marketData).map(
                (stock) => (
                  <option
                    key={stock.symbol}
                    value={stock.symbol}
                  >
                    {stock.symbol} — {stock.name}
                  </option>
                )
              )}
            </select>

            {selectedStock &&
              marketData[selectedStock] && (
                <div className="selected-stock-preview">
                  <div>
                    <strong>
                      {marketData[selectedStock].symbol}
                    </strong>

                    <span>
                      {marketData[selectedStock].name}
                    </span>
                  </div>

                  <strong>
                    ₹
                    {formatPrice(
                      marketData[selectedStock].price
                    )}
                  </strong>
                </div>
              )}

            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => {
                  setShowModal(false);
                  setSelectedStock("");
                }}
              >
                Cancel
              </button>

              <button
                className="primary-button"
                disabled={!selectedStock || adding}
                onClick={addStock}
              >
                {adding ? "Adding..." : "Add to Watchlist"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Watchlist;