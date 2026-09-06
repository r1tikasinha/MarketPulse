const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const filePath = path.join(
    __dirname,
    "../data/watchlist.json"
);


 // READ WATCHLIST
 
function readWatchlist() {

    const data =
        fs.readFileSync(
            filePath,
            "utf-8"
        );

    return JSON.parse(data);
}

// SAVE WATCHLIST

function saveWatchlist(watchlist) {

    fs.writeFileSync(
        filePath,
        JSON.stringify(
            watchlist,
            null,
            2
        )
    );
}

// GET WATCHLIST
 
router.get("/", (req, res) => {

    try {

        const watchlist =
            readWatchlist();

        res.json({
            success: true,
            count: watchlist.length,
            data: watchlist
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Unable to read watchlist"
        });
    }
});

// ADD STOCK


router.post("/", (req, res) => {

    try {

        const {
            symbol,
            name,
            exchange
        } = req.body;


        if (!symbol || !name) {

            return res.status(400).json({
                success: false,
                message:
                    "Symbol and name are required"
            });
        }


        const watchlist =
            readWatchlist();


        const exists =
            watchlist.find(
                stock =>
                    stock.symbol.toUpperCase() ===
                    symbol.toUpperCase()
            );


        if (exists) {

            return res.status(409).json({
                success: false,
                message:
                    "Stock already exists in watchlist"
            });
        }


        const newStock = {

            id:
                Date.now(),

            symbol:
                symbol.toUpperCase(),

            name:
                name,

            exchange:
                exchange || "NSE"
        };


        watchlist.push(newStock);

        saveWatchlist(watchlist);


        res.status(201).json({

            success: true,

            message:
                "Stock added successfully",

            data:
                newStock
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Unable to add stock"
        });
    }
});



// DELETE STOCK
 
router.delete("/:id", (req, res) => {

    try {

        const id =
            Number(req.params.id);


        const watchlist =
            readWatchlist();


        const stockExists =
            watchlist.find(
                stock =>
                    stock.id === id
            );


        if (!stockExists) {

            return res.status(404).json({
                success: false,
                message:
                    "Stock not found"
            });
        }


        const updatedWatchlist =
            watchlist.filter(
                stock =>
                    stock.id !== id
            );


        saveWatchlist(
            updatedWatchlist
        );


        res.json({

            success: true,

            message:
                "Stock removed successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Unable to remove stock"
        });
    }
});


module.exports = router;