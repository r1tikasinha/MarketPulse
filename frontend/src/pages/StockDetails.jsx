import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Activity,
  TrendingUp,
  AlertTriangle,
  Zap,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { useNavigate, useParams } from "react-router-dom";

function StockDetails() {

  const { symbol } = useParams();
  const navigate = useNavigate();
const [stock, setStock] = useState(null);
const [loading, setLoading] = useState(true);
const [selectedRange, setSelectedRange] = useState("1D");


  // ============================================
  // LOAD STOCK
  // ============================================

  useEffect(() => {

    loadStock();

    const interval = setInterval(() => {
      loadStock();
    }, 5000);

    return () => clearInterval(interval);

  }, [symbol]);


  const loadStock = async () => {

    try {

      const response = await fetch(
        `http://localhost:5000/api/market/${symbol}`
      );

      const result = await response.json();

      if (result.success) {
        setStock(result.data);
      }

    } catch (error) {

      console.error(
        "Stock details error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  // ============================================
  // FORMAT PRICE
  // ============================================

  const formatPrice = (price) => {

    return Number(price).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  };


  // ============================================
  // LOADING
  // ============================================

  if (loading) {

    return (

      <div className="page">

        <div className="loading-state">
          Loading stock details...
        </div>

      </div>

    );

  }


  // ============================================
  // STOCK NOT FOUND
  // ============================================

  if (!stock) {

    return (

      <div className="page">

        <button
          className="back-button"
          onClick={() => navigate("/markets")}
        >
          <ArrowLeft size={18} />
          Back to Markets
        </button>

        <div className="watchlist-empty">

          <h3>
            Stock not found
          </h3>

          <p>
            We could not find this stock.
          </p>

        </div>

      </div>

    );

  }


  // ============================================
  // BASIC CALCULATIONS
  // ============================================

  const isPositive =
    Number(stock.changePercent) >= 0;


  const volumeRatio =
    Number(stock.averageVolume) > 0
      ? Number(stock.volume) /
        Number(stock.averageVolume)
      : 0;


  const prices =
    (stock.priceHistory || [])
      .map(Number);


  const highPrice =
    prices.length > 0
      ? Math.max(...prices)
      : Number(stock.price);


  const lowPrice =
    prices.length > 0
      ? Math.min(...prices)
      : Number(stock.price);


  // ============================================
  // ATTENTION SCORE
  // ============================================

  const changePercent =
    Math.abs(
      Number(stock.changePercent) || 0
    );


  let attentionScore = 0;
  const attentionReasons = [];


  // Price movement

  if (changePercent >= 5) {

    attentionScore += 4;

    attentionReasons.push(
      "Large price movement"
    );

  } else if (changePercent >= 3) {

    attentionScore += 3;

    attentionReasons.push(
      "Significant price movement"
    );

  } else if (changePercent >= 1.5) {

    attentionScore += 2;

    attentionReasons.push(
      "Noticeable price movement"
    );

  }


  // Volume

  if (volumeRatio >= 2) {

    attentionScore += 3;

    attentionReasons.push(
      "Unusual trading volume"
    );

  } else if (volumeRatio >= 1.5) {

    attentionScore += 2;

    attentionReasons.push(
      "Above-average trading volume"
    );

  } else if (volumeRatio >= 1.2) {

    attentionScore += 1;

    attentionReasons.push(
      "Trading volume is elevated"
    );

  }


  // Volatility

  const volatility =
    Number(stock.volatility) || 0;


  if (volatility >= 4) {

    attentionScore += 3;

    attentionReasons.push(
      "High volatility"
    );

  } else if (volatility >= 2.5) {

    attentionScore += 2;

    attentionReasons.push(
      "Elevated volatility"
    );

  } else if (volatility >= 1.5) {

    attentionScore += 1;

  }


  attentionScore =
    Math.min(
      attentionScore,
      10
    );


  // ============================================
  // ATTENTION LEVEL
  // ============================================

  let attentionLevel = "Normal";


  if (attentionScore >= 8) {

    attentionLevel = "Critical";

  } else if (attentionScore >= 6) {

    attentionLevel = "Important";

  } else if (attentionScore >= 3) {

    attentionLevel = "Interesting";

  }


  // ============================================
  // CHART DATA
  // ============================================

// ============================================
// CHART DATA
// ============================================

const rangePoints = {
  "1D": 7,
  "1W": 14,
  "1M": 30,
  "3M": 90,
  "6M": 180,
  "1Y": 365,
};

const pointsToShow =
  rangePoints[selectedRange] || 7;

const selectedPrices =
  (stock.priceHistory || [])
    .slice(-pointsToShow);

const chartData =
  selectedPrices.map((price, index) => {

    let timeLabel;

    if (selectedRange === "1D") {

      const totalMinutes =
        9 * 60 + 30 + index * 30;

      const hour =
        Math.floor(totalMinutes / 60);

      const minute =
        totalMinutes % 60;

      const displayHour =
        hour > 12
          ? hour - 12
          : hour;

      const period =
        hour >= 12
          ? "PM"
          : "AM";

      timeLabel =
        `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;

    } else if (selectedRange === "1W") {

      timeLabel = `Day ${index + 1}`;

    } else if (selectedRange === "1M") {

      timeLabel = `Day ${index + 1}`;

    } else if (selectedRange === "3M") {

      timeLabel = `Week ${index + 1}`;

    } else if (selectedRange === "6M") {

      timeLabel = `Week ${index + 1}`;

    } else {

      timeLabel = `Month ${index + 1}`;

    }

    return {
      time: timeLabel,
      price: Number(price),
    };

  });
  // ============================================
  // MARKETPULSE INSIGHT
  // ============================================

  let insight =
    "No major market movement detected.";

  if (attentionScore >= 8) {

    insight =
      "This stock deserves immediate attention because multiple market signals are unusually strong.";

  } else if (attentionScore >= 6) {

    insight =
      "This stock is showing important market activity. Price, volume or volatility has moved beyond normal levels.";

  } else if (attentionScore >= 3) {

    insight =
      "This stock is showing a noticeable change compared with normal market activity.";

  }


  return (

    <div className="page">


      {/* ============================================ */}
      {/* BACK BUTTON */}
      {/* ============================================ */}

      <button
        className="back-button"
        onClick={() => navigate("/markets")}
      >

        <ArrowLeft size={18} />

        Back to Markets

      </button>


      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}

      <div className="stock-detail-header">

        <div>

          <p className="eyebrow">
            NSE · MARKET DATA
          </p>

          <h1>
            {stock.name}
          </h1>

          <p className="stock-symbol-large">
            {stock.symbol}
          </p>

        </div>


        <div className="stock-price-section">

          <div className="stock-price-large">

            ₹{formatPrice(stock.price)}

          </div>


          <div
            className={`stock-change-large ${
              isPositive
                ? "positive"
                : "negative"
            }`}
          >

            {isPositive ? (
              <ArrowUpRight size={18} />
            ) : (
              <ArrowDownRight size={18} />
            )}

            {isPositive ? "+" : ""}

            {stock.changePercent}%

          </div>

        </div>

      </div>


      {/* ============================================ */}
      {/* ATTENTION CARD */}
      {/* ============================================ */}

      <div className="activity-card">

        <div className="section-heading">

          <div>

            <p className="eyebrow">
              MARKETPULSE ATTENTION
            </p>

            <h2>
              {attentionLevel}
            </h2>

          </div>


          <div className="stock-attention-score">

            <Zap size={20} />

            <strong>
              {attentionScore}/10
            </strong>

          </div>

        </div>


        <p style={{ marginTop: "10px" }}>
          {insight}
        </p>


        {attentionReasons.length > 0 && (

          <div
            style={{
              marginTop: "18px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >

            {attentionReasons.map(
              (reason, index) => (

                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >

                  <AlertTriangle
                    size={16}
                  />

                  <span>
                    {reason}
                  </span>

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* ============================================ */}
      {/* STATS */}
      {/* ============================================ */}

      <div className="stock-stats-grid">


        {/* Today's Change */}

        <div className="stock-stat-card">

          <div className="stat-icon">
            <TrendingUp size={19} />
          </div>

          <span>
            Today's Change
          </span>

          <strong>

            {isPositive ? "+" : ""}

            ₹{formatPrice(stock.change)}

          </strong>

        </div>


        {/* Volume */}

        <div className="stock-stat-card">

          <div className="stat-icon">
            <BarChart3 size={19} />
          </div>

          <span>
            Trading Volume
          </span>

          <strong>

            {(
              Number(stock.volume) /
              1000000
            ).toFixed(2)}M

          </strong>

        </div>


        {/* Average Volume */}

        <div className="stock-stat-card">

          <div className="stat-icon">
            <Activity size={19} />
          </div>

          <span>
            Average Volume
          </span>

          <strong>

            {(
              Number(
                stock.averageVolume
              ) /
              1000000
            ).toFixed(2)}M

          </strong>

        </div>


        {/* Volume Ratio */}

        <div className="stock-stat-card">

          <div className="stat-icon">
            <Activity size={19} />
          </div>

          <span>
            Volume Ratio
          </span>

          <strong>
            {volumeRatio.toFixed(2)}×
          </strong>

        </div>


        {/* High */}

        <div className="stock-stat-card">

          <div className="stat-icon">
            <TrendingUp size={19} />
          </div>

          <span>
            High Price
          </span>

          <strong>
            ₹{formatPrice(highPrice)}
          </strong>

        </div>


        {/* Low */}

        <div className="stock-stat-card">

          <div className="stat-icon">
            <ArrowDownRight size={19} />
          </div>

          <span>
            Low Price
          </span>

          <strong>
            ₹{formatPrice(lowPrice)}
          </strong>

        </div>

      </div>


      {/* ============================================ */}
      {/* PRICE CHART */}
      {/* ============================================ */}

      <div className="stock-detail-section">

        <div className="section-heading">

  <div>

    <p className="eyebrow">
      PRICE MOVEMENT
    </p>

    <h2>
      Recent Price History
    </h2>

  </div>

  <div className="chart-range-buttons">

    {["1D", "1W", "1M", "3M", "6M", "1Y"].map(
      (range) => (

        <button
          key={range}
          className={
            selectedRange === range
              ? "active"
              : ""
          }
          onClick={() =>
            setSelectedRange(range)
          }
        >
          {range}
        </button>

      )
    )}

  </div>

</div>


        <div className="stock-chart-card">

          {chartData.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height={350}
            >

              <LineChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
              >

                <CartesianGrid
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                />


                <XAxis
  dataKey="time"
  tick={{
    fontSize: 12,
    fill: "#64748b",
  }}
  axisLine={{
    stroke: "#cbd5e1",
  }}
  tickLine={{
    stroke: "#cbd5e1",
  }}
  interval={
    selectedRange === "1D"
      ? 0
      : selectedRange === "1W"
      ? 2
      : selectedRange === "1M"
      ? 4
      : selectedRange === "3M"
      ? 9
      : selectedRange === "6M"
      ? 14
      : 29
  }
/>


                <YAxis
                  domain={[
                    "auto",
                    "auto",
                  ]}
                  tick={{
                    fontSize: 13,
                    fill: "#334155",
                  }}
                  axisLine={{
                    stroke: "#64748b",
                  }}
                  tickLine={{
                    stroke: "#64748b",
                  }}
                  width={70}
                />


                <Tooltip
                  formatter={(value) => [
                    `₹${Number(
                      value
                    ).toFixed(2)}`,
                    "Price",
                  ]}
                  labelFormatter={(label) =>
                    `Time: ${label}`
                  }
                />


                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={
                    isPositive
                      ? "#16a34a"
                      : "#dc2626"
                  }
                  strokeWidth={3}
                  dot={false}
                  activeDot={{
                    r: 7,
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          ) : (

            <div className="watchlist-empty">

              <p>
                No price history available.
              </p>

            </div>

          )}

        </div>

      </div>


      {/* ============================================ */}
      {/* WHY THIS STOCK MATTERS */}
      {/* ============================================ */}

      <div className="stock-detail-section">

        <div className="section-heading">

          <div>

            <p className="eyebrow">
              MARKET ACTIVITY
            </p>

            <h2>
              Why this stock matters
            </h2>

          </div>

        </div>


        <div className="activity-card">


          <div className="activity-row">

            <span>
              Price movement
            </span>

            <strong
              className={
                isPositive
                  ? "positive"
                  : "negative"
              }
            >

              {isPositive ? "+" : ""}

              {stock.changePercent}%

            </strong>

          </div>


          <div className="activity-row">

            <span>
              Volume vs average
            </span>

            <strong>
              {volumeRatio.toFixed(2)}×
            </strong>

          </div>


          <div className="activity-row">

            <span>
              Volatility
            </span>

            <strong>
              {stock.volatility}
            </strong>

          </div>


          <div className="activity-row">

            <span>
              Attention score
            </span>

            <strong>
              {attentionScore}/10
            </strong>

          </div>


          <div className="activity-row">

            <span>
              Attention level
            </span>

            <strong>
              {attentionLevel}
            </strong>

          </div>

        </div>

      </div>

    </div>

  );

}

export default StockDetails;
