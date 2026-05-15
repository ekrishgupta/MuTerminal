import { create } from 'zustand';

export type AppView = 'Discover' | 'Trade' | 'Strategies' | 'News' | 'Analytics' | 'Top Traders' | 'Arbitrage' | 'Portfolio';

interface TerminalState {
  activeView: AppView;
  selectedMarket: string | null;
  marketFilter: string;
  isCommandPaletteOpen: boolean;
  
  // Actions
  setActiveView: (view: AppView) => void;
  setSelectedMarket: (market: string | null) => void;
  setMarketFilter: (filter: string) => void;
  toggleCommandPalette: () => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
  activeView: 'Trade', // Default to Trade for pro feel
  selectedMarket: 'MU:TRUMP_WIN_2024',
  marketFilter: 'Aggregator',
  isCommandPaletteOpen: false,

  setActiveView: (view) => set({ activeView: view }),
  setSelectedMarket: (market) => set({ selectedMarket: market }),
  setMarketFilter: (filter) => set({ marketFilter: filter }),
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
}));
