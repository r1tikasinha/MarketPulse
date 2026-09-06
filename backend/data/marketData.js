function generatePriceHistory(startPrice, volatility) {

    const history = [];

    let currentPrice = startPrice;

    for (let i = 0; i < 365; i++) {

        const movement =
            Math.sin(i * 0.15) *
            volatility *
            0.005;

        currentPrice =
            currentPrice * (1 + movement);

        history.push(
            Number(currentPrice.toFixed(2))
        );
    }

    // Latest historical price = current price
    history[history.length - 1] =
        Number(startPrice.toFixed(2));

    return history;
}

 // MARKET DATA
 
const marketData = {

    RELIANCE: {

        symbol: "RELIANCE",
        name: "Reliance Industries",

        price: 1425.50,
        change: 2.35,
        changePercent: 0.82,

        volume: 8450000,
        averageVolume: 6200000,

        volatility: 1.8,

        priceHistory: generatePriceHistory(
            1425.50,
            1.8
        )
    },


    TCS: {

        symbol: "TCS",
        name: "Tata Consultancy Services",

        price: 3248.20,
        change: -18.40,
        changePercent: -0.56,

        volume: 4200000,
        averageVolume: 3900000,

        volatility: 1.2,

        priceHistory: generatePriceHistory(
            3248.20,
            1.2
        )
    },


    INFY: {

        symbol: "INFY",
        name: "Infosys",

        price: 1512.75,
        change: 31.20,
        changePercent: 2.10,

        volume: 7800000,
        averageVolume: 4100000,

        volatility: 2.4,

        priceHistory: generatePriceHistory(
            1512.75,
            2.4
        )
    },


    TATAMOTORS: {

        symbol: "TATAMOTORS",
        name: "Tata Motors",

        price: 742.20,
        change: -45.60,
        changePercent: -5.80,

        volume: 15400000,
        averageVolume: 6400000,

        volatility: 4.8,

        priceHistory: generatePriceHistory(
            742.20,
            4.8
        )
    },


    HDFCBANK: {

        symbol: "HDFCBANK",
        name: "HDFC Bank",

        price: 1984.30,
        change: 12.40,
        changePercent: 0.63,

        volume: 5300000,
        averageVolume: 4900000,

        volatility: 1.5,

        priceHistory: generatePriceHistory(
            1984.30,
            1.5
        )
    }

};


 // RANDOM NUMBER
 
function randomBetween(min, max) {

    return Math.random() *
        (max - min) +
        min;

}


 // UPDATE CURRENT MARKET DATA

function updateMarketData() {

    Object.values(marketData).forEach((stock) => {

        let movementPercent;

        // SIMULATE PRICE MOVEMENT
 
        if (stock.symbol === "TATAMOTORS") {

    movementPercent =
        randomBetween(-0.15, 0.15);

} else if (stock.symbol === "INFY") {

    movementPercent =
        randomBetween(-0.12, 0.12);

} else {

    movementPercent =
        randomBetween(-0.10, 0.10);

}


        const oldPrice =
            stock.price;


        const movement =
            movementPercent / 100;


         // UPDATE CURRENT PRICE
 
        stock.price = Number(
            (
                oldPrice *
                (1 + movement)
            ).toFixed(2)
        );


         // PRICE CHANGE
 
        stock.change = Number(
            (
                stock.price -
                oldPrice
            ).toFixed(2)
        );


         // PERCENTAGE CHANGE

        stock.changePercent =
            Number(
                movementPercent.toFixed(2)
            );


         // DO NOT MODIFY HISTORICAL DATA
 
        if (!Array.isArray(stock.priceHistory)) {

            stock.priceHistory =
                generatePriceHistory(
                    stock.price,
                    stock.volatility
                );

        }


         // SIMULATE TRADING VOLUME
 
        let volumeMultiplier;


        if (stock.symbol === "TATAMOTORS") {

            volumeMultiplier =
                randomBetween(2, 2.8);

        }

        else if (stock.symbol === "INFY") {

            volumeMultiplier =
                randomBetween(1.5, 2);

        }

        else {

            volumeMultiplier =
                randomBetween(0.8, 1.3);

        }


        stock.volume =
            Math.round(
                stock.averageVolume *
                volumeMultiplier
            );


         // SIMULATE VOLATILITY
 
        if (stock.symbol === "TATAMOTORS") {

            stock.volatility =
                Number(
                    randomBetween(
                        4,
                        5
                    ).toFixed(1)
                );

        }

        else if (stock.symbol === "INFY") {

            stock.volatility =
                Number(
                    randomBetween(
                        2.5,
                        3.5
                    ).toFixed(1)
                );

        }

        else {

            stock.volatility =
                Number(
                    randomBetween(
                        1,
                        2
                    ).toFixed(1)
                );

        }

    });

}


 // EXPORT
 
module.exports = {
    marketData,
    updateMarketData
};