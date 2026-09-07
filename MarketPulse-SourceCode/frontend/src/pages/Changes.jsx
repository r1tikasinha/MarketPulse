
import { useEffect, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  RefreshCw,
  TrendingUp,
  Zap,
} from "lucide-react";

function Changes() {
  const [changes, setChanges] = useState([]);
  const [lastChecked, setLastChecked] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadChanges = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://marketpulse-r28a.onrender.com/api/changes"
      );

      if (!response.ok) {
        throw new Error("Failed to load changes");
      }

      const result = await response.json();

      setChanges(result.data || []);
      setLastChecked(result.previousCheckedAt || null);
    } catch (err) {
      console.error(err);
      setError("Unable to load market changes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChanges();
  }, []);

  const formatTime = (date) => {
    if (!date) return "First check";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="page changes-page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <div className="eyebrow">
            MARKET INTELLIGENCE
          </div>

          <h1>What Changed</h1>

          <p className="page-subtitle">
            See the most meaningful movements in your watchlist
            since your last check.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={loadChanges}
          disabled={loading}
        >
          <RefreshCw
            size={15}
            className={loading ? "spin" : ""}
          />

          Refresh
        </button>
      </div>

      {/* LAST CHECKED */}
      <div className="changes-check-bar">

        <div className="changes-check-left">
          <div className="changes-check-icon">
            <Clock size={17} />
          </div>

          <div>
            <span>PREVIOUS CHECK</span>

            <strong>
              {formatTime(lastChecked)}
            </strong>
          </div>
        </div>

        <div className="changes-count">
          <strong>{changes.length}</strong>
          <span>meaningful changes</span>
        </div>

      </div>

      {/* ERROR */}
      {error && (
        <div className="changes-error">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && changes.length === 0 && (
        <div className="changes-empty">
          <RefreshCw size={24} className="spin" />
          <p>Checking your watchlist...</p>
        </div>
      )}

      {/* NO CHANGES */}
      {!loading && changes.length === 0 && !error && (
        <div className="changes-empty">
          <Activity size={28} />

          <h3>No meaningful changes</h3>

          <p>
            Nothing significant has changed in your watchlist
            since the previous check.
          </p>
        </div>
      )}

      {/* CHANGES */}
      {changes.length > 0 && (
        <div className="changes-list">

          {changes.map((stock) => {

            const isPositive =
              stock.changePercent >= 0;

            return (
              <div
                className="change-card"
                key={stock.symbol}
              >

                {/* LEFT */}
                <div className="change-stock">

                  <div className="change-symbol">
                    {stock.symbol}
                  </div>

                  <div className="change-stock-info">
                    <h3>{stock.name}</h3>

                    <span>
                      ₹
                      {stock.price.toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </span>
                  </div>

                </div>

                {/* PRICE CHANGE */}
                <div className="change-movement">

                  <div
                    className={
                      isPositive
                        ? "positive"
                        : "negative"
                    }
                  >
                    {isPositive ? (
                      <ArrowUpRight size={17} />
                    ) : (
                      <ArrowDownRight size={17} />
                    )}

                    <strong>
                      {isPositive ? "+" : ""}
                      {stock.changePercent}%
                    </strong>
                  </div>

                  {stock.priceChangeSinceLastCheck !==
                    null && (
                    <span>
                      {stock.priceChangeSinceLastCheck >= 0
                        ? "+"
                        : ""}
                      ₹
                      {stock.priceChangeSinceLastCheck.toFixed(
                        2
                      )} since last check
                    </span>
                  )}

                </div>

                {/* ATTENTION */}
                <div className="change-attention">

                  <div className="attention-score">

                    <Zap size={14} />

                    <strong>
                      {stock.attentionScore}/10
                    </strong>

                  </div>

                  <span>
                    {stock.level}
                  </span>

                </div>

                {/* REASONS */}
                <div className="change-reasons">

                  {stock.reasons &&
                    stock.reasons
                      .slice(0, 2)
                      .map((reason, index) => (
                        <span key={index}>
                          {reason}
                        </span>
                      ))}

                </div>

              </div>
            );
          })}

        </div>
      )}

      {/* FOOTER */}
      <div className="changes-footer">

        <TrendingUp size={15} />

        <span>
          MarketPulse prioritizes movements that are
          meaningful rather than simply showing every price tick.
        </span>

      </div>

    </div>
  );
}

export default Changes;