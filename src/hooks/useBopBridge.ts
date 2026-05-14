import { useEffect, useState, useCallback, useRef } from 'react';

export interface MarketUpdate {
  type: 'depth' | 'trade' | 'status';
  ticker: string;
  bids?: [number, number][];
  asks?: [number, number][];
  price?: number;
  qty?: number;
  msg?: string;
}

export const useBopBridge = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<MarketUpdate | null>(null);
  const ws = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    console.log('[BOP Bridge] Connecting to 127.0.0.1:8080...');
    const socket = new WebSocket('ws://127.0.0.1:8080');

    socket.onopen = () => {
      console.log('[BOP Bridge] Connected');
      setIsConnected(true);
    };

    socket.onclose = () => {
      console.log('[BOP Bridge] Disconnected. Retrying in 2s...');
      setIsConnected(false);
      setTimeout(connect, 2000);
    };

    socket.onmessage = (event) => {
      try {
        const data: MarketUpdate = JSON.parse(event.data);
        setLastUpdate(data);
      } catch (err) {
        console.error('[BOP Bridge] Failed to parse message:', err);
      }
    };

    ws.current = socket;
  }, []);

  useEffect(() => {
    connect();
    return () => {
      ws.current?.close();
    };
  }, [connect]);

  const sendCommand = useCallback((cmd: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(cmd);
    }
  }, []);

  return { isConnected, lastUpdate, sendCommand };
};
