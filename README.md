# MarketPulse – Smart Market Watchlist

MarketPulse is a smart market watchlist designed to help investors quickly understand what actually changed in the stocks they care about.
Traditional stock dashboards show large amounts of market data, but they often make users search through every price movement to find what matters. MarketPulse solves this problem by focusing on meaningful changes since the user's last check.

## Features

* **Smart Watchlist** — Add and remove stocks that you want to monitor.
* **Since You Last Checked** — Compare the current market state with the previous snapshot and highlight meaningful movements.
* **Attention Score **— Each stock receives a score from 0–10 based on multiple signals such as price movement, trading volume and volatility.
* **Meaningful Change Detection** — Instead of highlighting every small price fluctuation, MarketPulse prioritizes significant market activity.
* **Market Intelligence** — Explains why a stock deserves attention, such as large price movement, unusual trading volume or high volatility.
* **Smart Alerts** — Create price, volume and attention-score alerts and automatically identify when their conditions are triggered.
* **Market Overview **— View important stocks and their latest market signals in one place.
* **Stock Details** — View individual stock information, price movement and market intelligence.
* **Auto Refresh:** Automatically refresh watchlist data at configurable intervals.
* **Persistent Watchlist & Alerts** — Watchlist and alert configurations are stored so they remain available after restarting the application.
  
## What Makes MarketPulse Different?
The main idea behind MarketPulse is “Don't just show me the market. Tell me what changed.”
The system combines multiple signals instead of relying only on price movement. For example, a stock with a large price drop, unusually high trading volume and high volatility receives a higher Attention Score and is surfaced as a priority.
This helps users move from raw market data → meaningful insight → action more quickly.

## How It Works
MarketPulse continuously evaluates the stocks in the user's watchlist.
The change engine considers:
* Price movement
* Trading volume compared with average volume
* Volatility
These signals are combined into an Attention Score from 0–10.
Stocks with higher scores are prioritized as more important changes.

##  Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| Vite | Development and build tool |
| Node.js | Backend runtime |
| Express.js | REST API development |
| Recharts | Data visualization |
| LocalStorage | Client-side preference storage |
| JavaScript | Application logic |

## Project Structure

```text
MarketPulse/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   ├── package.json
│   └── index.html
│
├── backend/
│   ├── server.js
│   └── package.json
│
└── README.md
```


## Backend API Endpoints

The Express backend provides the following APIs:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/watchlist` | Retrieve watchlist stocks |
| GET | `/api/market/:symbol` | Retrieve details for a particular stock |
| GET | `/api/changes` | Retrieve changes since the previous check |

Backend runs locally on port `5000`.

## 📊 Example Market Insights

| Stock | Price Change | Attention Score |
|---|---:|---:|
| TATAMOTORS | -5.8% | 10 |
| INFY | +2.1% | 5 |

These are illustrative project data examples.

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/r1tikasinha/MarketPulse.git
cd MarketPulse
```

### 2. Install Dependencies

Navigate to the frontend and backend directories and install dependencies:

```bash
npm install
```

### 3. Start the Backend

```bash
npm start
```

### 4. Start the Frontend

```bash
npm run dev
```

### 5. Open the Application

vercel LINK - https://market-pulse-eta-ten.vercel.app/

## Key Learning Outcomes

- Building full-stack applications using React and Node.js.
- Developing REST APIs using Express.js.
- Managing and tracking dynamic application data.
- Implementing market change detection and prioritization logic.
- Visualizing financial data using Recharts.
- Handling stale and conflicting data scenarios.
- Managing frontend preferences using LocalStorage.

##  Author

**Ritika Sinha**

GitHub: [@r1tikasinha](https://github.com/r1tikasinha)

vercel LINK - https://market-pulse-eta-ten.vercel.app/

## 1. Dashboard
The Dashboard provides an overall summary of the stock market watchlist. It highlights important stock movements, price changes, attention scores, and market updates. Users can quickly identify which stocks need their attention.

<img width="1509" height="916" alt="Screenshot 2026-11-18 at 5 49 01 PM" src="https://github.com/user-attachments/assets/afb2ce5a-48e8-47cb-a110-4b4a19fb9479" />

## 2. Watchlist
The Watchlist displays the stocks selected by the user. It provides important information such as stock name, current price, percentage change, and market movement, helping users monitor their selected stocks in one place.

<img width="1519" height="923" alt="Screenshot 2026-11-18 at 6 04 49 PM" src="https://github.com/user-attachments/assets/34293cc5-581d-4ab8-886c-de7da36129fa" />

## 3. Markets
The Markets page provides stock-related information and market insights. Users can explore stock performance, compare price movements, and view detailed information about individual stocks.

<img width="1514" height="914" alt="Screenshot 2026-11-18 at 6 05 16 PM" src="https://github.com/user-attachments/assets/ee12a643-d73c-456b-b35c-3d5a814da44c" />

<img width="1519" height="916" alt="Screenshot 2026-11-18 at 6 05 37 PM" src="https://github.com/user-attachments/assets/19308278-5067-40a7-9316-20f30e82a4c7" />

<img width="1518" height="917" alt="Screenshot 2026-11-18 at 6 05 40 PM" src="https://github.com/user-attachments/assets/1bcb8c3e-4b0b-401d-8fd3-8acc9f39c47f" />

## 4. What Changed
This page focuses on identifying meaningful changes since the user's last check. It highlights stocks with significant price movements and displays details such as percentage change, volume ratio, volatility, and attention score.

For example:
- TATAMOTORS: Price decreased by 5.8%, with an attention score of 10.
- INFY: Price increased by 2.1%, with an attention score of 5.

<img width="1517" height="920" alt="Screenshot 2026-11-18 at 6 05 49 PM" src="https://github.com/user-attachments/assets/7378ed6e-dc91-4749-a131-a45875c8b949" />

## 5. Alerts
The Alerts page is intended to highlight important stock movements that may require user attention. It can help users identify critical changes and interesting market activities without manually checking every stock.

<img width="1508" height="916" alt="Screenshot 2026-11-18 at 6 05 52 PM" src="https://github.com/user-attachments/assets/89f5728b-f255-4c28-b502-3260432cf0c8" />





