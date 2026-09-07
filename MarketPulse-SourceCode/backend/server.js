const express = require("express");
const cors = require("cors");

const { updateMarketData } = require("./data/marketData");

const watchlistRoutes = require("./routes/watchlist");
const marketRoutes = require("./routes/market");
const changesRoutes = require("./routes/changes");
const alertsRoutes = require("./routes/alerts");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "MarketPulse API is running 🚀"
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "healthy",
        service: "MarketPulse Backend"
    });
});

// Watchlist routes
app.use("/api/watchlist", watchlistRoutes);

// Market routes
app.use("/api/market", marketRoutes);

app.use("/api/changes", changesRoutes);

app.use("/api/alerts", alertsRoutes);

// Automatic market data update
setInterval(() => {
    updateMarketData();
    console.log("Market data updated");
}, 5000);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`MarketPulse backend running on port ${PORT}`);
});