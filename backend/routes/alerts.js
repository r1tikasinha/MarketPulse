const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const filePath = path.join(
    __dirname,
    "../data/alerts.json"
);

const {
    marketData
} = require("../data/marketData");

const {
    calculateAttentionScore
} = require("../analysis/changeEngine");

 // READ ALERTS

function readAlerts() {
    return JSON.parse(
        fs.readFileSync(
            filePath,
            "utf-8"
        )
    );
}


 // SAVE ALERTS
 
function saveAlerts(alerts) {
    fs.writeFileSync(
        filePath,
        JSON.stringify(
            alerts,
            null,
            2
        )
    );
}

 // CHECK ALERT CONDITION

function isAlertTriggered(alert) {

    const stock =
        marketData[alert.symbol];

    if (!stock) {
        return false;
    }

    // PRICE ALERT

    if (alert.type === "price") {

        if (
            alert.condition === "above"
        ) {
            return (
                stock.price >=
                Number(alert.value)
            );
        }

        if (
            alert.condition === "below"
        ) {
            return (
                stock.price <=
                Number(alert.value)
            );
        }
    }


     // VOLUME ALERT
 
    if (alert.type === "volume") {

        const volumeRatio =
            stock.volume /
            stock.averageVolume;

        return (
            volumeRatio >=
            Number(alert.value)
        );
    }


     // ATTENTION ALERT
 
    if (alert.type === "attention") {

        const analysis =
            calculateAttentionScore(
                stock
            );

        return (
            analysis.score >=
            Number(alert.value)
        );
    }


    return false;
}

// GET ALL ALERTS
// GET /api/alerts
 
router.get("/", (req, res) => {

    try {

        const alerts =
            readAlerts();

        res.json({
            success: true,
            count: alerts.length,
            data: alerts
        });

    } catch (error) {

        console.error(
            "Load alerts error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to load alerts"
        });
    }
});


 // CREATE ALERT
// POST /api/alerts


router.post("/", (req, res) => {

    try {

        const {
            symbol,
            type,
            condition,
            value
        } = req.body;


        // Validate required fields

        if (
            !symbol ||
            !type ||
            value === undefined ||
            value === ""
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Symbol, type and value are required"
            });
        }


        // Validate stock

        const stockSymbol =
            symbol.toUpperCase();

        if (
            !marketData[stockSymbol]
        ) {

            return res.status(404).json({
                success: false,
                message:
                    "Stock not found"
            });
        }


        // Validate alert type

        const validTypes = [
            "price",
            "volume",
            "attention"
        ];

        if (
            !validTypes.includes(type)
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid alert type"
            });
        }


        // Price alert needs condition

        if (
            type === "price" &&
            !["above", "below"].includes(
                condition
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Price alert condition must be above or below"
            });
        }


        const numericValue =
            Number(value);

        if (
            !Number.isFinite(
                numericValue
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Value must be a valid number"
            });
        }


        const alerts =
            readAlerts();


        // Create alert

        const newAlert = {

            id: Date.now(),

            symbol:
                stockSymbol,

            type,

            condition:
                type === "price"
                    ? condition
                    : null,

            value:
                numericValue,

            status:
                "active",

            createdAt:
                new Date().toISOString(),

            triggeredAt:
                null
        };


        alerts.push(
            newAlert
        );

        saveAlerts(
            alerts
        );


        res.status(201).json({

            success: true,

            message:
                "Alert created successfully",

            data:
                newAlert
        });

    } catch (error) {

        console.error(
            "Create alert error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to create alert"
        });
    }
});


 // CHECK AND TRIGGER ALERTS
// POST /api/alerts/check
 
router.post("/check", (req, res) => {

    try {

        const alerts =
            readAlerts();

        let triggeredCount = 0;


        const updatedAlerts =
            alerts.map((alert) => {

                // Already triggered
                if (
                    alert.status ===
                    "triggered"
                ) {
                    return alert;
                }


                const triggered =
                    isAlertTriggered(
                        alert
                    );


                if (triggered) {

                    triggeredCount++;

                    return {

                        ...alert,

                        status:
                            "triggered",

                        triggeredAt:
                            new Date().toISOString()
                    };
                }


                return alert;
            });


        saveAlerts(
            updatedAlerts
        );


        res.json({

            success: true,

            message:
                "Alert check completed",

            triggeredCount,

            data:
                updatedAlerts
        });

    } catch (error) {

        console.error(
            "Check alerts error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to check alerts"
        });
    }
});


 // DELETE ALERT
// DELETE /api/alerts/:id
 
router.delete("/:id", (req, res) => {

    try {

        const id =
            Number(req.params.id);

        const alerts =
            readAlerts();


        const exists =
            alerts.find(
                alert =>
                    alert.id === id
            );


        if (!exists) {

            return res.status(404).json({
                success: false,
                message:
                    "Alert not found"
            });
        }


        const updatedAlerts =
            alerts.filter(
                alert =>
                    alert.id !== id
            );


        saveAlerts(
            updatedAlerts
        );


        res.json({

            success: true,

            message:
                "Alert deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete alert error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to delete alert"
        });
    }
});


module.exports = router;