/**
 * useMockMarket - Neutral version for public release.
 * Returns empty market data without simulated movements.
 */
import { useEffect, useState } from "react";
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

export function useMockMarket(selectedTicker = "AWAITING_DATA") {
  const [marketData, setMarketData] = useState<MarketData>({
    bids: [],
    asks: [],
    trades: [],
    priceHistory: [],
    ticker: {
      ticker: selectedTicker,
      lastPrice: 0,
      bidPrice: 0,
      askPrice: 0,
      spread: 0,
      change24h: 0,
      changePct24h: 0,
      volume24h: 0,
      high24h: 0,
      low24h: 0,
      openInterest: 0,
    },
  });

  const { lastUpdate } = useBopBridge();

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
          id: `t-live-${Date.now()}`,
          price: lastUpdate.price || 0,
          size: lastUpdate.qty || 0,
          side: (lastUpdate.price || 0) > prev.ticker.lastPrice ? "buy" : "sell",
          time: Date.now(),
          venue: "POLY", 
        };
        const trades = [newTrade, ...prev.trades].slice(0, 60);
        return { ...prev, trades };
      });
    }
  }, [lastUpdate, selectedTicker]);

  return marketData;
}
