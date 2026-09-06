const express = require("express");

const router = express.Router();

const {
    marketData
} = require("../data/marketData");

const {
    calculateAttentionScore
} = require("../analysis/changeEngine");


 // GET ALL MARKET DATA
 
router.get("/", (req, res) => {

    const stocks =
        Object.values(marketData);

    res.json({
        success: true,
        count: stocks.length,
        data: stocks
    });
});


 // GET ALL STOCKS WITH ATTENTION SCORES
 
router.get("/changes/all", (req, res) => {

    const stocks =
        Object.values(marketData);

    const changes =
        stocks.map((stock) => {

            const analysis =
                calculateAttentionScore(stock);

            return {
                ...stock,

                attentionScore:
                    analysis.score,

                level:
                    analysis.level,

                reasons:
                    analysis.reasons,

                volumeRatio:
                    analysis.volumeRatio
            };
        });


    // Highest attention score first
    changes.sort(
        (a, b) =>
            b.attentionScore -
            a.attentionScore
    );


    res.json({
        success: true,
        count: changes.length,
        data: changes
    });
});

// GET ONE STOCK
 
router.get("/:symbol", (req, res) => {

    const symbol =
        req.params.symbol.toUpperCase();


    const stock =
        marketData[symbol];


    if (!stock) {

        return res.status(404).json({
            success: false,
            message: "Stock not found"
        });
    }


    res.json({
        success: true,
        data: stock
    });
});


module.exports = router;