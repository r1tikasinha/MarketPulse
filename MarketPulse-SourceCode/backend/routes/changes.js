const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const {
    marketData
} = require("../data/marketData");

const {
    calculateAttentionScore
} = require("../analysis/changeEngine");

 // MARKET SNAPSHOT FILE
 
const snapshotPath = path.join(
    __dirname,
    "../data/marketSnapshot.json"
);

// READ SNAPSHOT
function readSnapshot() {
    return JSON.parse(
        fs.readFileSync(
            snapshotPath,
            "utf-8"
        )
    );
}

// SAVE SNAPSHOT
function saveSnapshot(snapshot) {
    fs.writeFileSync(
        snapshotPath,
        JSON.stringify(
            snapshot,
            null,
            2
        )
    );
}

 // ALERTS FILE
 
const alertsPath = path.join(
    __dirname,
    "../data/alerts.json"
);

 // CHECK ALERTS
 
function checkAlerts() {

    try {

        const alerts =
            JSON.parse(
                fs.readFileSync(
                    alertsPath,
                    "utf-8"
                )
            );

        let triggeredCount = 0;

        const updatedAlerts =
            alerts.map((alert) => {

                // Already triggered
                if (
                    alert.status === "triggered"
                ) {
                    return alert;
                }

                // Find stock
                const stock =
                    marketData[
                        alert.symbol
                    ];

                if (!stock) {
                    return alert;
                }

                let triggered = false;

                 // PRICE ALERT
 
                if (
                    alert.type === "price"
                ) {

                    if (
                        alert.condition === "above" &&
                        stock.price >=
                            Number(alert.value)
                    ) {
                        triggered = true;
                    }

                    if (
                        alert.condition === "below" &&
                        stock.price <=
                            Number(alert.value)
                    ) {
                        triggered = true;
                    }
                }

                 // VOLUME ALERT
 
                if (
                    alert.type === "volume"
                ) {

                    const volumeRatio =
                        stock.volume /
                        stock.averageVolume;

                    if (
                        volumeRatio >=
                        Number(alert.value)
                    ) {
                        triggered = true;
                    }
                }

                 // ATTENTION SCORE ALERT
 
                if (
                    alert.type === "attention"
                ) {

                    const analysis =
                        calculateAttentionScore(
                            stock
                        );

                    if (
                        analysis.score >=
                        Number(alert.value)
                    ) {
                        triggered = true;
                    }
                }

                 // TRIGGER ALERT
 
                if (triggered) {

                    triggeredCount++;

                    return {
                        ...alert,
                        status: "triggered",
                        triggeredAt:
                            new Date().toISOString()
                    };
                }

                return alert;

            });

        // Save updated alerts
        fs.writeFileSync(
            alertsPath,
            JSON.stringify(
                updatedAlerts,
                null,
                2
            )
        );

        return triggeredCount;

    } catch (error) {

        console.error(
            "Automatic alert check error:",
            error
        );

        return 0;
    }
}

// ============================================
// WATCHLIST FILE
// ============================================

const watchlistPath =
    path.join(
        __dirname,
        "../data/watchlist.json"
    );

// ============================================
// READ WATCHLIST
// ============================================

function readWatchlist() {

    const data =
        fs.readFileSync(
            watchlistPath,
            "utf-8"
        );

    return JSON.parse(data);
}

 // GET MEANINGFUL MARKET CHANGES


router.get("/", (req, res) => {

    try {

         // 1. READ PREVIOUS SNAPSHOT
 
        const snapshot =
            readSnapshot();

         // 2. CHECK ALERTS
 
        const triggeredAlerts =
            checkAlerts();

        
        // 3. READ WATCHLIST

        const watchlist =
            readWatchlist();

         // 4. GET WATCHLIST STOCKS
        

        const currentStocks =
            watchlist
                .map(
                    item =>
                        marketData[
                            item.symbol
                        ]
                )
                .filter(
                    stock => stock
                );

         // 5. ANALYZE STOCKS
 
        const changes =
            currentStocks.map((stock) => {

                const analysis =
                    calculateAttentionScore(
                        stock
                    );

                // Previous snapshot
                const previousStock =
                    snapshot.stocks[
                        stock.symbol
                    ];

                let priceChangeSinceLastCheck =
                    null;

                if (previousStock) {

                    priceChangeSinceLastCheck =
                        Number(
                            (
                                stock.price -
                                previousStock.price
                            ).toFixed(2)
                        );
                }

                return {

                    symbol:
                        stock.symbol,

                    name:
                        stock.name,

                    price:
                        stock.price,

                    change:
                        stock.change,

                    changePercent:
                        stock.changePercent,

                    previousPrice:
                        previousStock
                            ? previousStock.price
                            : null,

                    priceChangeSinceLastCheck:
                        priceChangeSinceLastCheck,

                    attentionScore:
                        analysis.score,

                    level:
                        analysis.level,

                    meaningfulChange:
                        analysis.meaningfulChange,

                    volumeRatio:
                        analysis.volumeRatio,

                    reasons:
                        analysis.reasons
                };

            });

        
        // 6. ONLY MEANINGFUL CHANGES
 
        const meaningfulChanges =
            changes.filter(
                stock =>
                    stock.meaningfulChange === true
            );

         // 7. HIGHEST ATTENTION FIRST
 
        meaningfulChanges.sort(
            (a, b) =>
                b.attentionScore -
                a.attentionScore
        );

        // 8. PREVIOUS CHECK TIME

        const previousCheckedAt =
            snapshot.lastChecked;

         // 9. SAVE CURRENT SNAPSHOT
 
        snapshot.lastChecked =
            new Date().toISOString();

        snapshot.stocks = {};

        currentStocks.forEach(
            (stock) => {

                snapshot.stocks[
                    stock.symbol
                ] = {

                    price:
                        stock.price,

                    changePercent:
                        stock.changePercent,

                    volume:
                        stock.volume,

                    volatility:
                        stock.volatility
                };

            }
        );
        saveSnapshot(snapshot);

         // 10. RESPONSE
 
        res.json({

            success: true,

            previousCheckedAt:
                previousCheckedAt,

            lastChecked:
                snapshot.lastChecked,

            triggeredAlerts:
                triggeredAlerts,

            count:
                meaningfulChanges.length,

            data:
                meaningfulChanges
        });

    } catch (error) {

        console.error(
            "Changes error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to calculate market changes"
        });
    }

});

module.exports = router;

