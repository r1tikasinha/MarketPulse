import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Eye,
  RefreshCw,
  TrendingUp,
  Zap,
} from "lucide-react";

function Dashboard() {
  const [watchlist, setWatchlist] = useState([]);
  const [changes, setChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);
  const [error, setError] = useState("");
  const [triggeredAlerts, setTriggeredAlerts] = useState([]);

  // ============================================
  // AUTOMATIC REFRESH
  // ============================================

  useEffect(() => {
  loadDashboard();

  const savedSettings =
    JSON.parse(
      localStorage.getItem(
        "marketpulse-settings"
      ) || "{}"
    );

  const autoRefresh =
    savedSettings.autoRefresh !== false;

  const refreshInterval =
    Number(
      savedSettings.refreshInterval || 10
    );

  if (!autoRefresh) {
    return;
  }

  const interval =
    setInterval(
      () => {
        loadDashboard();
      },
      refreshInterval * 1000
    );

  return () => {
    clearInterval(interval);
  };
}, []);

  // ============================================
  // LOAD DASHBOARD DATA
  // ============================================

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        watchlistResponse,
        changesResponse,
        alertsResponse,
      ] = await Promise.all([
        fetch("https://marketpulse-r28a.onrender.com/api/watchlist"),
        fetch("https://marketpulse-r28a.onrender.com/api/changes"),
        fetch("https://marketpulse-r28a.onrender.com/api/alerts"),
      ]);

      if (
        !watchlistResponse.ok ||
        !changesResponse.ok ||
        !alertsResponse.ok
      ) {
        throw new Error("Backend request failed");
      }

      const watchlistResult =
        await watchlistResponse.json();

      const changesResult =
        await changesResponse.json();

      const alertsResult =
        await alertsResponse.json();

      // Watchlist
      if (watchlistResult.success) {
        setWatchlist(
          watchlistResult.data || []
        );
      }

      // Market changes
      if (changesResult.success) {
        setChanges(
          changesResult.data || []
        );

        setLastChecked(
          changesResult.lastChecked || null
        );
      }

      // Triggered alerts
      if (alertsResult.success) {
        setTriggeredAlerts(
          (alertsResult.data || []).filter(
            (alert) =>
              alert.status === "triggered"
          )
        );
      }

    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );

      setError(
        "Unable to load dashboard data."
      );

    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FORMAT PRICE
  // ============================================

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  // ============================================
  // FORMAT TIME
  // ============================================

  const formatTime = (date) => {
    if (!date) {
      return "--";
    }

    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ============================================
  // TOP MOVER
  // ============================================

  const topMover =
    changes.length > 0
      ? [...changes].sort(
          (a, b) =>
            Math.abs(b.changePercent) -
            Math.abs(a.changePercent)
        )[0]
      : null;

  // ============================================
  // HIGHEST ATTENTION
  // ============================================

  const highestAttention =
    changes.length > 0
      ? [...changes].sort(
          (a, b) =>
            b.attentionScore -
            a.attentionScore
        )[0]
      : null;

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="page">
        <div className="loading-state">
          <Activity size={20} />
          Loading MarketPulse...
        </div>
      </div>
    );
  }

  // ============================================
  // ERROR
  // ============================================

  if (error) {
    return (
      <div className="page">
        <div className="watchlist-empty">
          <Activity size={30} />

          <h3>
            Dashboard unavailable
          </h3>

          <p>
            {error} Make sure the backend
            is running on port 5000.
          </p>

          <button
            className="secondary-button"
            onClick={loadDashboard}
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // DASHBOARD
  // ============================================

  return (
    <div className="page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="page-header">

        <div>
          <p className="eyebrow">
            MARKET INTELLIGENCE
          </p>

          <h1>
            Good evening, Ritika
          </h1>

          <p className="page-subtitle">
            Here's what matters in your market
            watchlist right now.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={loadDashboard}
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>


      {/* =====================================
          TRIGGERED ALERTS
      ====================================== */}

      {triggeredAlerts.length > 0 && (

        <div className="triggered-alert-panel">

          <div className="triggered-alert-header">

            <div className="triggered-alert-title">

              <div className="triggered-alert-icon">
                <Bell size={18} />
              </div>

              <div>
                <span>
                  ATTENTION REQUIRED
                </span>

                <h2>
                  Market Alerts
                </h2>
              </div>

            </div>

            <Link
              to="/alerts"
              className="view-alerts-link"
            >
              View all alerts
            </Link>

          </div>


          <div className="triggered-alert-list">

            {triggeredAlerts
              .slice(0, 3)
              .map((alert) => (

                <div
                  className="triggered-alert-card"
                  key={alert.id}
                >

                  <div className="triggered-alert-card-left">

                    <div className="alert-symbol">
                      {alert.symbol}
                    </div>

                    <div className="alert-description">

                      <strong>

                        {alert.type === "price" &&
                          `Price ${alert.condition} ₹${alert.value}`}

                        {alert.type === "volume" &&
                          `Volume reached ${alert.value}× average`}

                        {alert.type === "attention" &&
                          `Attention score reached ${alert.value}/10`}

                      </strong>

                      <span>
                        Triggered market condition
                      </span>

                    </div>

                  </div>


                  <div className="triggered-badge">

                    <span></span>

                    Triggered

                  </div>

                </div>

              ))}

          </div>

        </div>

      )}


      {/* =====================================
          SUMMARY CARDS
      ====================================== */}

      <div className="dashboard-stats">

        {/* Watchlist */}

        <div className="stat-card">

          <div className="stat-card-top">

            <div className="stat-icon">
              <Eye size={19} />
            </div>

            <span>
              WATCHLIST
            </span>

          </div>

          <strong>
            {watchlist.length}
          </strong>

          <p>
            Stocks you're tracking
          </p>

        </div>


        {/* Changes */}

        <div className="stat-card">

          <div className="stat-card-top">

            <div className="stat-icon">
              <Activity size={19} />
            </div>

            <span>
              MEANINGFUL CHANGES
            </span>

          </div>

          <strong>
            {changes.length}
          </strong>

          <p>
            Movements worth attention
          </p>

        </div>


        {/* Top mover */}

        <div className="stat-card">

          <div className="stat-card-top">

            <div className="stat-icon">
              <TrendingUp size={19} />
            </div>

            <span>
              TOP MOVER
            </span>

          </div>

          <strong>
            {topMover
              ? topMover.symbol
              : "--"}
          </strong>

          <p>
            {topMover
              ? `${
                  topMover.changePercent >= 0
                    ? "+"
                    : ""
                }${topMover.changePercent}%`
              : "No major movement"}
          </p>

        </div>


        {/* Attention */}

        <div className="stat-card">

          <div className="stat-card-top">

            <div className="stat-icon">
              <Zap size={19} />
            </div>

            <span>
              HIGHEST ATTENTION
            </span>

          </div>

          <strong>
            {highestAttention
              ? `${highestAttention.attentionScore}/10`
              : "--"}
          </strong>

          <p>
            {highestAttention
              ? highestAttention.symbol
              : "No alerts"}
          </p>

        </div>

      </div>


      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <div className="dashboard-grid">

        {/* ===================================
            MARKET SIGNALS
        ==================================== */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>

              <span className="panel-eyebrow">
                MARKET SIGNALS
              </span>

              <h2>
                What needs your attention
              </h2>

            </div>

            <Link
              to="/changes"
              className="panel-link"
            >
              View all
            </Link>

          </div>


          <div className="signal-list">

            {changes.length === 0 ? (

              <div className="watchlist-empty">

                <Activity size={26} />

                <h3>
                  Market is quiet
                </h3>

                <p>
                  No meaningful changes detected.
                </p>

              </div>

            ) : (

              changes
                .slice(0, 4)
                .map((stock) => {

                  const isPositive =
                    stock.changePercent >= 0;

                  return (

                    <Link
                      to={`/stock/${stock.symbol}`}
                      className="signal-row"
                      key={stock.symbol}
                    >

                      <div className="signal-stock">

                        <div className="signal-icon">

                          {isPositive ? (
                            <ArrowUpRight
                              size={17}
                            />
                          ) : (
                            <ArrowDownRight
                              size={17}
                            />
                          )}

                        </div>

                        <div>

                          <strong>
                            {stock.symbol}
                          </strong>

                          <span>
                            {stock.name}
                          </span>

                        </div>

                      </div>


                      <div className="signal-move">

                        <strong
                          className={
                            isPositive
                              ? "positive"
                              : "negative"
                          }
                        >
                          {isPositive
                            ? "+"
                            : ""}
                          {stock.changePercent}%
                        </strong>

                        <span>
                          ₹
                          {formatPrice(
                            stock.price
                          )}
                        </span>

                      </div>


                      <div className="signal-attention">

                        <span>
                          Attention
                        </span>

                        <strong>
                          {stock.attentionScore}/10
                        </strong>

                      </div>

                    </Link>

                  );

                })

            )}

          </div>

        </div>


        {/* ===================================
            QUICK INSIGHT
        ==================================== */}

        <div className="dashboard-panel insight-panel">

          <div className="panel-header">

            <div>

              <span className="panel-eyebrow">
                QUICK INSIGHT
              </span>

              <h2>
                Why it matters
              </h2>

            </div>

            <div className="insight-icon">
              <Zap size={18} />
            </div>

          </div>


          {highestAttention ? (

            <div className="insight-content">

              <div className="insight-stock">

                <strong>
                  {highestAttention.symbol}
                </strong>

                <span>
                  {highestAttention.name}
                </span>

              </div>


              <div className="insight-score">

                <span>
                  ATTENTION SCORE
                </span>

                <strong>
                  {highestAttention.attentionScore}/10
                </strong>

              </div>


              <div className="insight-reasons">

                {(
                  highestAttention.reasons || []
                ).map(
                  (reason, index) => (

                    <div
                      className="insight-reason"
                      key={index}
                    >

                      <span>
                        •
                      </span>

                      {reason}

                    </div>

                  )
                )}

              </div>


              <Link
                to={`/stock/${highestAttention.symbol}`}
                className="primary-button insight-button"
              >
                View stock details
              </Link>

            </div>

          ) : (

            <div className="watchlist-empty">

              <Bell size={26} />

              <h3>
                Nothing urgent
              </h3>

              <p>
                We'll highlight important
                movements here.
              </p>

            </div>

          )}

        </div>

      </div>


      {/* =====================================
          BOTTOM INFO
      ====================================== */}

      <div className="dashboard-footer">

        <div>

          <Activity size={15} />

          <span>
            MarketPulse analyzes your
            watchlist for meaningful changes.
          </span>

        </div>

        <span>
          Last analyzed{" "}
          {formatTime(lastChecked)}
        </span>

      </div>

    </div>
  );
}

export default Dashboard;