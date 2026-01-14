"use client";

import { useState, useEffect, useRef } from "react";

// Instruments dengan Binance symbols
const INSTRUMENTS = {
  popular: [
    { symbol: "BTCUSDT", displayName: "Bitcoin (BTC)", emoji: "₿", spreadPips: 0.50 },
    { symbol: "ETHUSDT", displayName: "Ethereum (ETH)", emoji: "⟠", spreadPips: 0.20 },
    { symbol: "BNBUSDT", displayName: "BNB", emoji: "🔶", spreadPips: 0.05 },
    { symbol: "SOLUSDT", displayName: "Solana (SOL)", emoji: "◎", spreadPips: 0.02 },
    { symbol: "XRPUSDT", displayName: "Ripple (XRP)", emoji: "✕", spreadPips: 0.001 },
  ],
  crypto: [
    { symbol: "BTCUSDT", displayName: "BTC/USDT", emoji: "₿", spreadPips: 0.50 },
    { symbol: "ETHUSDT", displayName: "ETH/USDT", emoji: "⟠", spreadPips: 0.20 },
    { symbol: "BNBUSDT", displayName: "BNB/USDT", emoji: "🔶", spreadPips: 0.05 },
    { symbol: "ADAUSDT", displayName: "ADA/USDT", emoji: "🔵", spreadPips: 0.001 },
    { symbol: "DOGEUSDT", displayName: "DOGE/USDT", emoji: "🐕", spreadPips: 0.0001 },
  ],
  defi: [
    { symbol: "UNIUSDT", displayName: "Uniswap (UNI)", emoji: "🦄", spreadPips: 0.01 },
    { symbol: "AAVEUSDT", displayName: "Aave (AAVE)", emoji: "👻", spreadPips: 0.05 },
    { symbol: "LINKUSDT", displayName: "Chainlink (LINK)", emoji: "⬡", spreadPips: 0.01 },
    { symbol: "MKRUSDT", displayName: "Maker (MKR)", emoji: "Ⓜ️", spreadPips: 0.50 },
    { symbol: "SNXUSDT", displayName: "Synthetix (SNX)", emoji: "📈", spreadPips: 0.005 },
  ],
  layer1: [
    { symbol: "SOLUSDT", displayName: "Solana (SOL)", emoji: "◎", spreadPips: 0.02 },
    { symbol: "AVAXUSDT", displayName: "Avalanche (AVAX)", emoji: "🔺", spreadPips: 0.01 },
    { symbol: "DOTUSDT", displayName: "Polkadot (DOT)", emoji: "●", spreadPips: 0.005 },
    { symbol: "ATOMUSDT", displayName: "Cosmos (ATOM)", emoji: "⚛️", spreadPips: 0.005 },
    { symbol: "NEARUSDT", displayName: "NEAR Protocol", emoji: "🌐", spreadPips: 0.005 },
  ],
  memecoins: [
    { symbol: "DOGEUSDT", displayName: "Dogecoin (DOGE)", emoji: "🐕", spreadPips: 0.0001 },
    { symbol: "SHIBUSDT", displayName: "Shiba Inu (SHIB)", emoji: "🐶", spreadPips: 0.00000001 },
    { symbol: "PEPEUSDT", displayName: "Pepe (PEPE)", emoji: "🐸", spreadPips: 0.00000001 },
    { symbol: "FLOKIUSDT", displayName: "Floki (FLOKI)", emoji: "🐕‍🦺", spreadPips: 0.00000001 },
    { symbol: "WIFUSDT", displayName: "dogwifhat (WIF)", emoji: "🎩", spreadPips: 0.001 },
  ],
  stablecoins: [
    { symbol: "BTCUSDT", displayName: "BTC/USDT", emoji: "₿", spreadPips: 0.50 },
    { symbol: "ETHUSDT", displayName: "ETH/USDT", emoji: "⟠", spreadPips: 0.20 },
    { symbol: "BTCUSDC", displayName: "BTC/USDC", emoji: "₿", spreadPips: 0.50 },
    { symbol: "ETHUSDC", displayName: "ETH/USDC", emoji: "⟠", spreadPips: 0.20 },
    { symbol: "BNBUSDT", displayName: "BNB/USDT", emoji: "🔶", spreadPips: 0.05 },
  ],
};

type Category = keyof typeof INSTRUMENTS;

interface PriceData {
  bid: number;
  ask: number;
  spread: number;
  change: "up" | "down" | "none";
}

const TABS: { key: Category; label: string }[] = [
  { key: "popular", label: "Popular" },
  { key: "crypto", label: "Crypto" },
  { key: "defi", label: "DeFi" },
  { key: "layer1", label: "Layer 1" },
  { key: "memecoins", label: "Memecoins" },
  { key: "stablecoins", label: "Stablecoins" },
];

export default function TradingQuotes() {
  const [activeTab, setActiveTab] = useState<Category>("popular");
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [status, setStatus] = useState<"connecting" | "live" | "disconnected">("connecting");
  const wsRef = useRef<WebSocket | null>(null);
  const prevPricesRef = useRef<Record<string, number>>({});

  const currentInstruments = INSTRUMENTS[activeTab];

  // Format price display
  const formatPrice = (price: number): string => {
    if (!price || isNaN(price)) return "—";
    
    // Format berdasarkan besaran harga
    if (price >= 10000) return price.toFixed(2);
    if (price >= 100) return price.toFixed(2);
    if (price >= 1) return price.toFixed(4);
    if (price >= 0.01) return price.toFixed(6);
    return price.toFixed(8);
  };

  // Format spread
  const formatSpread = (spread: number): string => {
    if (!spread || isNaN(spread)) return "—";
    if (spread >= 1) return spread.toFixed(2);
    if (spread >= 0.01) return spread.toFixed(4);
    return spread.toFixed(8);
  };

  // WebSocket connection
  useEffect(() => {
    // Buat streams untuk semua symbols di tab aktif
    const streams = currentInstruments
      .map((i) => `${i.symbol.toLowerCase()}@aggTrade`)
      .join("/");

    console.log("Connecting to streams:", streams);

    // Gunakan combined stream URL
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/stream?streams=${streams}`
    );
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setStatus("live");
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // Combined stream format: { stream: "btcusdt@aggTrade", data: {...} }
        const data = message.data;
        
        if (data && data.e === "aggTrade" && data.s && data.p) {
          const symbol = data.s; // e.g., "BTCUSDT"
          const price = parseFloat(data.p);
          
          // Cari instrument yang cocok
          const inst = currentInstruments.find((i) => i.symbol === symbol);
          if (!inst) return;

          // Tentukan perubahan harga
          const prev = prevPricesRef.current[symbol];
          const change: "up" | "down" | "none" = prev
            ? price > prev ? "up" : price < prev ? "down" : "none"
            : "none";
          prevPricesRef.current[symbol] = price;

          // Hitung bid/ask dengan spread
          const halfSpread = inst.spreadPips / 2;
          setPrices((p) => ({
            ...p,
            [symbol]: {
              bid: price - halfSpread,
              ask: price + halfSpread,
              spread: inst.spreadPips,
              change,
            },
          }));
        }
      } catch (e) {
        console.error("WS parse error:", e);
      }
    };

    ws.onerror = (e) => {
      console.log("WebSocket error:", e);
      setStatus("disconnected");
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      setStatus("disconnected");
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [activeTab, currentInstruments]);

  return (
    <section className="trading-quotes-section">
      <div className="trading-quotes-container">
        {/* Header */}
        <div className="trading-header">
          <h2 className="trading-title">Live Market Prices</h2>
          <p className="trading-subtitle">Real-time cryptocurrency prices via Binance WebSocket</p>
        </div>

        {/* Tabs */}
        <div className="trading-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`trading-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status */}
        <div className="connection-status">
          <span className={`status-dot ${status}`} />
          <span className="status-text">
            {status === "connecting"
              ? "Connecting..."
              : status === "live"
              ? "Live (Binance WebSocket)"
              : "Disconnected"}
          </span>
        </div>

        {/* Table */}
        <div className="trading-table-wrapper">
          <table className="trading-table">
            <thead>
              <tr>
                <th>Instrument</th>
                <th className="text-center">Bid</th>
                <th className="text-center">Ask</th>
                <th className="text-center">Spread</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentInstruments.map((inst) => {
                const data = prices[inst.symbol];
                return (
                  <tr key={inst.symbol}>
                    <td>
                      <div className="instrument-cell">
                        <span className="emoji">{inst.emoji}</span>
                        <span className="name">{inst.displayName}</span>
                      </div>
                    </td>
                    <td className={`price-cell ${data?.change === "down" ? "down" : ""}`}>
                      {data ? formatPrice(data.bid) : "—"}
                    </td>
                    <td className={`price-cell ${data?.change === "up" ? "up" : ""}`}>
                      {data ? formatPrice(data.ask) : "—"}
                    </td>
                    <td className="spread-cell">
                      {data ? formatSpread(data.spread) : "—"}
                    </td>
                    <td className="action-cell">
                      <button className="trade-btn">Trade</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .trading-quotes-section {
          padding: 3rem 2rem;
          background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
        }
        .trading-quotes-container {
          max-width: 1100px;
          margin: 0 auto;
        }
        .trading-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .trading-title {
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.5rem 0;
        }
        .trading-subtitle {
          color: #94a3b8;
          font-size: 0.95rem;
          margin: 0;
        }
        .trading-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .trading-tab {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          border: 1px solid #334155;
          background: transparent;
          color: #94a3b8;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .trading-tab:hover {
          background: #1e293b;
          color: #fff;
        }
        .trading-tab.active {
          background: #3b82f6;
          color: #fff;
          border-color: #3b82f6;
        }
        .connection-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        .status-dot.connecting {
          background: #f59e0b;
        }
        .status-dot.live {
          background: #10b981;
        }
        .status-dot.disconnected {
          background: #ef4444;
          animation: none;
        }
        .status-text {
          font-size: 0.75rem;
          color: #94a3b8;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .trading-table-wrapper {
          border: 1px solid #334155;
          border-radius: 12px;
          overflow: hidden;
          background: #1e293b;
        }
        .trading-table {
          width: 100%;
          border-collapse: collapse;
        }
        .trading-table thead {
          background: #0f172a;
        }
        .trading-table th {
          padding: 1rem 1.5rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 500;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .trading-table th.text-center {
          text-align: center;
        }
        .trading-table tbody tr {
          border-top: 1px solid #334155;
          transition: background 0.15s;
        }
        .trading-table tbody tr:hover {
          background: #334155;
        }
        .trading-table td {
          padding: 1rem 1.5rem;
        }
        .instrument-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .emoji {
          font-size: 1.5rem;
        }
        .name {
          font-weight: 600;
          color: #fff;
        }
        .price-cell {
          text-align: center;
          font-weight: 500;
          font-variant-numeric: tabular-nums;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
          transition: all 0.3s;
          color: #e2e8f0;
        }
        .price-cell.up {
          color: #10b981;
          background: rgba(16, 185, 129, 0.15);
        }
        .price-cell.down {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.15);
        }
        .spread-cell {
          text-align: center;
          color: #64748b;
          font-variant-numeric: tabular-nums;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
        }
        .action-cell {
          text-align: right;
        }
        .trade-btn {
          padding: 0.5rem 1.5rem;
          background: #3b82f6;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .trade-btn:hover {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        @media (max-width: 768px) {
          .trading-quotes-section {
            padding: 1.5rem 1rem;
          }
          .trading-title {
            font-size: 1.5rem;
          }
          .trading-table th,
          .trading-table td {
            padding: 0.75rem;
          }
          .trade-btn {
            padding: 0.4rem 1rem;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </section>
  );
}
