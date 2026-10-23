# 📈 CryptoTrack — Real-Time Crypto Dashboard

A cryptocurrency tracking web app built with **Next.js 16**, **React 19**, and **TypeScript**. It provides real-time price data, interactive candlestick charts, coin search, trending coins, market categories, and live trade feeds — all powered by the **CoinGecko API**.

---

## ✨ Features

- 🔍 **Coin Search Modal** — Instant search with trending coins shown by default, with 24h price change indicators
- 📊 **Candlestick Chart** — Interactive OHLC chart via `lightweight-charts`, supporting historical and live modes with selectable intervals (`10s` / `1min`)
- 💹 **Live Data Feed** — Polls CoinGecko every 10s or 60s for real-time price, 24h change, and recent trades
- 🏆 **Top Gainers & Losers** — Highlights the best and worst performing coins over 24h
- 🪙 **Trending Coins** — Displays CoinGecko's trending coins on the home page
- 📂 **Market Categories** — Browse coins grouped by market category with 24h change stats
- 💱 **Currency Converter** — Convert any coin amount to USD using live prices
- 🔢 **Paginated Coin List** — Browse all coins with market cap rankings and key stats
- 📱 **Responsive Design** — Mobile-friendly layout with skeleton fallbacks during data loading

---

## 🗂️ Project Structure

```
app/
├── page.tsx              # Home page (Trending, CoinOverview, Categories)
├── globals.css           # Global styles & design system (Tailwind v4)
└── coins/
    ├── page.tsx          # Full paginated coin list
    └── [id]/page.tsx     # Individual coin detail page (live chart + trades)

components/
├── home/
│   ├── CoinOverview.tsx      # Top coins overview table
│   ├── TrendingCoins.tsx     # Trending coins panel
│   └── Categories.tsx        # Market categories grid
├── CandlestickChart.tsx      # OHLC chart with period/interval controls
├── CoinHeader.tsx            # Live price header for coin detail page
├── LiveDataWrapper.tsx       # Wraps coin detail page with live polling
├── SearchModel.tsx           # Command-palette style search dialog
├── TopGainersLosers.tsx      # Gainers/Losers sidebar widget
├── Converter.tsx             # Crypto → USD converter
├── DataTable.tsx             # Generic reusable data table
├── CoinsPagination.tsx       # Pagination controls
└── Header.tsx                # Global top navigation bar

hooks/
└── useLiveCoinData.ts    # Polls CoinGecko for price, trades, and OHLCV data

lib/
└── coingecko.actions.ts  # Typed API fetcher with caching & error handling
```

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript 5 |
| UI | React 19 |
| Styling | Tailwind CSS v4 + custom design tokens |
| Charts | [lightweight-charts](https://github.com/tradingview/lightweight-charts) v5 |
| UI Components | [Base UI](https://base-ui.com), [shadcn/ui](https://ui.shadcn.com), [cmdk](https://cmdk.paco.me) |
| Icons | [lucide-react](https://lucide.dev) |
| Data Fetching | SWR + native `fetch` |
| Data Source | [CoinGecko API](https://www.coingecko.com/en/api) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- A [CoinGecko API key](https://www.coingecko.com/en/api/pricing) (free tier works)

### Installation

```bash
git clone https://github.com/your-username/crypto-trading.git
cd crypto-trading
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
COINGECKO_API_KEY=your_api_key_here
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Integration

All data is sourced from the **CoinGecko REST API**:

| Endpoint | Usage |
|---|---|
| `/coins/markets` | Coin overview list with market stats |
| `/coins/{id}` | Full coin details, tickers, and market data |
| `/coins/{id}/ohlc` | OHLC candlestick data |
| `/search/trending` | Trending coins for home page & search modal |
| `/search` | Coin search by name/symbol |
| `/coins/top_gainers_losers` | Top gainers and losers (24h) |
| `/coins/categories` | Market category breakdown |
| `/simple/price` | Live price lookup for converter |

Live data is polled at configurable intervals:
- **`1s` mode** → polls every **10 seconds**
- **`1m` mode** → polls every **60 seconds**

---

## 🧱 Build

```bash
npm run build
npm run start
```

---

## 📄 License

This project is for educational/personal use. CoinGecko data is subject to their [Terms of Service](https://www.coingecko.com/en/api_term).
