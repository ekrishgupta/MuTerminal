/**
 * useMockMarket - Simulates live order book, trades, and market data.
 * Provides realistic-looking streaming data without an actual BOP engine connection.
 */
import { useEffect, useRef, useState, useCallback } from "react";
import { useBopBridge } from "./useBopBridge";

export interface DepthLevel {
  price: number;
  size: number;
  total: number;
}

export interface Trade {
  id: string;
  price: number;
  size: number;
  side: "buy" | "sell";
  time: number;
  venue: "POLY" | "KALSHI" | "PI";
}

export interface TickerSnapshot {
  ticker: string;
  lastPrice: number;
  bidPrice: number;
  askPrice: number;
  spread: number;
  change24h: number;
  changePct24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  openInterest: number;
}

export interface MarketData {
  bids: DepthLevel[];
  asks: DepthLevel[];
  trades: Trade[];
  ticker: TickerSnapshot;
  priceHistory: number[];
}

function gaussianRandom(mean: number, stdDev: number): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return mean + stdDev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function generateOrderBook(midPrice: number, levels = 20): { bids: DepthLevel[], asks: DepthLevel[] } {
  const tickSize = 0.001;
  const bids: DepthLevel[] = [];
  const asks: DepthLevel[] = [];
  let bidTotal = 0;
  let askTotal = 0;

  for (let i = 0; i < levels; i++) {
    const bidPrice = parseFloat((midPrice - (i + 1) * tickSize * (1 + Math.random() * 0.5)).toFixed(3));
    const askPrice = parseFloat((midPrice + (i + 1) * tickSize * (1 + Math.random() * 0.5)).toFixed(3));
    const bidSize = Math.round(gaussianRandom(800, 600) * (1 - i * 0.03));
    const askSize = Math.round(gaussianRandom(800, 600) * (1 - i * 0.03));
    bidTotal += Math.max(bidSize, 50);
    askTotal += Math.max(askSize, 50);
    bids.push({ price: Math.max(0.001, bidPrice), size: Math.max(bidSize, 50), total: bidTotal });
    asks.push({ price: Math.min(0.999, askPrice), size: Math.max(askSize, 50), total: askTotal });
  }

  return { bids, asks };
}

const VENUES: Array<"POLY" | "KALSHI" | "PI"> = ["POLY", "KALSHI", "PI"];

export function useMockMarket(selectedTicker = "TRUMP_WIN_2026") {
  const midPriceRef = useRef(0.612);
  const [marketData, setMarketData] = useState<MarketData>(() => {
    const { bids, asks } = generateOrderBook(midPriceRef.current);
    return {
      bids,
      asks,
      trades: [],
      priceHistory: [
        0.58, 0.585, 0.59, 0.588, 0.592, 0.598, 0.601, 0.605,
        0.608, 0.606, 0.610, 0.609, 0.612
      ],
      ticker: {
        ticker: selectedTicker,
        lastPrice: 0.612,
        bidPrice: 0.611,
        askPrice: 0.613,
        spread: 0.002,
        change24h: 0.024,
        changePct24h: 4.08,
        volume24h: 4_132_000,
        high24h: 0.628,
        low24h: 0.581,
        openInterest: 668_432_192,
      },
    };
  });

  const tradeIdRef = useRef(0);

  const tick = useCallback(() => {
    const drift = (Math.random() - 0.495) * 0.0008;
    midPriceRef.current = Math.min(0.98, Math.max(0.02, midPriceRef.current + drift));
    const mid = midPriceRef.current;

    const { bids, asks } = generateOrderBook(mid);

    const tradeSide = drift > 0 ? "buy" : "sell";
    const tradePrice = tradeSide === "buy" ? asks[0].price : bids[0].price;
    const tradeSize = Math.round(gaussianRandom(200, 150));
    const newTrade: Trade = {
      id: `t-${++tradeIdRef.current}`,
      price: tradePrice,
      size: Math.max(tradeSize, 10),
      side: tradeSide,
      time: Date.now(),
      venue: VENUES[Math.floor(Math.random() * VENUES.length)],
    };

    setMarketData((prev) => {
      const trades = [newTrade, ...prev.trades].slice(0, 60);
      const priceHistory = [...prev.priceHistory, parseFloat(mid.toFixed(3))].slice(-80);
      const ticker: TickerSnapshot = {
        ...prev.ticker,
        lastPrice: parseFloat(mid.toFixed(3)),
        bidPrice: bids[0].price,
        askPrice: asks[0].price,
        spread: parseFloat((asks[0].price - bids[0].price).toFixed(3)),
        change24h: parseFloat((mid - 0.588).toFixed(3)),
        changePct24h: parseFloat(((mid - 0.588) / 0.588 * 100).toFixed(2)),
        volume24h: prev.ticker.volume24h + Math.round(Math.random() * 5000),
      };
      return { bids, asks, trades, ticker, priceHistory };
    });
  }, []);

  const { isConnected, lastUpdate } = useBopBridge();

  useEffect(() => {
    if (!lastUpdate) return;
    
    if (lastUpdate.type === 'depth' && lastUpdate.ticker === selectedTicker) {
      setMarketData(prev => {
        let bidTotal = 0;
        const bids = (lastUpdate.bids || []).map(([p, q]) => {
          bidTotal += q;
          return { price: p, size: q, total: bidTotal };
        });
        
        let askTotal = 0;
        const asks = (lastUpdate.asks || []).map(([p, q]) => {
          askTotal += q;
          return { price: p, size: q, total: askTotal };
        });

        const newTicker = { ...prev.ticker };
        if (bids.length > 0 && asks.length > 0) {
          newTicker.bidPrice = bids[0].price;
          newTicker.askPrice = asks[0].price;
          newTicker.spread = parseFloat((asks[0].price - bids[0].price).toFixed(3));
          newTicker.lastPrice = parseFloat(((bids[0].price + asks[0].price) / 2).toFixed(3));
        }

        return { ...prev, bids, asks, ticker: newTicker };
      });
    } else if (lastUpdate.type === 'trade' && lastUpdate.ticker === selectedTicker) {
      setMarketData(prev => {
        const newTrade: Trade = {
          id: `t-live-${++tradeIdRef.current}`,
          price: lastUpdate.price || 0,
          size: lastUpdate.qty || 0,
          side: (lastUpdate.price || 0) > prev.ticker.lastPrice ? "buy" : "sell",
          time: Date.now(),
          venue: "POLY", // Fallback, could be extracted if sidecar provides it
        };
        const trades = [newTrade, ...prev.trades].slice(0, 60);
        return { ...prev, trades };
      });
    }
  }, [lastUpdate, selectedTicker]);

  useEffect(() => {
    // Only run mock generator if we aren't connected to the live sidecar
    if (isConnected) return;
    
    const intervalId = setInterval(tick, 600);
    return () => clearInterval(intervalId);
  }, [tick, isConnected]);

  return marketData;
}
