function calculateAttentionScore(stock) {
    let score = 0;
    const reasons = [];

    const changePercent = Number(stock.changePercent) || 0;
    const volume = Number(stock.volume) || 0;
    const averageVolume = Number(stock.averageVolume) || 0;
    const volatility = Number(stock.volatility) || 0;

    const absChange = Math.abs(changePercent);


    // 1. PRICE MOVEMENT

    if (absChange >= 5) {
        score += 4;
        reasons.push("Large price movement");
    } else if (absChange >= 3) {
        score += 3;
        reasons.push("Significant price movement");
    } else if (absChange >= 1.5) {
        score += 2;
        reasons.push("Noticeable price movement");
    }

     // 2. VOLUME ANOMALY
 
    const volumeRatio =
        averageVolume > 0
            ? volume / averageVolume
            : 0;

    if (volumeRatio >= 2) {
        score += 3;
        reasons.push("Unusual trading volume");
    } else if (volumeRatio >= 1.5) {
        score += 2;
        reasons.push("Above-average trading volume");
    } else if (volumeRatio >= 1.2) {
        score += 1;
        reasons.push("Trading volume is elevated");
    }

     // 3. VOLATILITY
 
    if (volatility >= 4) {
        score += 3;
        reasons.push("High volatility");
    } else if (volatility >= 2.5) {
        score += 2;
        reasons.push("Elevated volatility");
    } else if (volatility >= 1.5) {
        score += 1;
    }

     // MAXIMUM SCORE
 
    score = Math.min(score, 10);

     // ATTENTION LEVEL
 
    let level;

    if (score >= 8) {
        level = "critical";
    } else if (score >= 6) {
        level = "important";
    } else if (score >= 3) {
        level = "interesting";
    } else {
        level = "normal";
    }

     // MEANINGFUL CHANGE
 
    const meaningfulChange =
        absChange >= 1.5 ||
        volumeRatio >= 1.5 ||
        volatility >= 2.5;

     // FINAL RESULT
 
    return {
        score: Number(score.toFixed(1)),
        level,
        meaningfulChange,
        reasons,
        volumeRatio: Number(volumeRatio.toFixed(2))
    };
}

module.exports = {
    calculateAttentionScore
};