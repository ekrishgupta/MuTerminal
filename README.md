# μTerminal (MuTerminal)

[![BOP Protocol](https://img.shields.io/badge/Engine-BOP%20Protocol-red.svg)](https://github.com/ekrishgupta/bop)
[![Tauri](https://img.shields.io/badge/Framework-Tauri%20v2-blue.svg)](https://tauri.app/)
[![React](https://img.shields.io/badge/Frontend-React%20v19-cyan.svg)](https://react.dev/)

**MuTerminal (μT)** is a professional-grade execution environment and high-frequency aggregator for prediction markets. 

At its core, MuTerminal leverages the [BOP (Generalized Outcome Protocol)](https://github.com/ekrishgupta/bop) to provide a unified language for prediction market trading. This makes it radically easier to write, test, and deploy automated algorithms. By abstracting away venue-specific APIs, MuTerminal enables seamless cross-exchange arbitrage (e.g. Kalshi vs. Polymarket) using a single, cohesive `.bop` script.

*Coming Soon:* Premium users will have access to proprietary, Bloomberg-style fundamental data on every market, providing unparalleled institutional-grade intelligence.

---

## 🚀 Key Capabilities

- **Algorithmic Execution:** Write and instantly deploy automated trading strategies using the [BOP Protocol](https://github.com/ekrishgupta/bop).
- **Cross-Venue Arbitrage:** Exploit price discrepancies across Kalshi, Polymarket, and other venues with a unified liquidity pool.
- **Unified Liquidity Aggregator (ULA):** Real-time side-by-side order books and consolidated market depth.
- **Portfolio Manager:** High-density tracking of Net Liquidation Value, Margin Utilization, and live position PnL.
- **Alpha Monitor:** Real-time "Squawk" feed and whale-watching notifications.
- **Keyboard-First Workflow:** Full command palette (`Cmd+K`), instant Trade execution (`B`/`S`), and rapid workspace switching (`F1`-`F6`).

## 🏗 Architecture

- **Shell:** [Tauri v2](https://tauri.app/) (Rust) for secure, lightweight window management and sidecar orchestration.
- **Execution Engine:** [BOP](https://github.com/ekrishgupta/bop) (C++20) running as a high-performance sidecar process.
- **Frontend:** React 19 + TypeScript + Tailwind CSS v4.
- **IPC:** High-speed local WebSockets (127.0.0.1:8080) for streaming market depth and trade execution.

## 🛠 Project Structure

```text
MuTerminal/
├── src-tauri/              # Rust Backend (Tauri Shell)
├── src/                    # React Frontend (Vite)
│   ├── components/         # Professional UI Modules
│   ├── store/              # Zustand Terminal State
│   └── hooks/              # BOP Sidecar Bridge
├── engine/                 # BOP C++ Engine (Sidecar)
│   ├── core/               # BOP DSL & Logic
│   └── exchanges/          # Venue Adapters (Kalshi, Poly)
└── GEMINI.md               # Master Strategic Plan
```

## 🚥 Getting Started

### Prerequisites

- **Rust:** `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- **Node.js:** v18+
- **C++ Toolchain:** Clang 17+ or GCC 13+
- **System Libs:** `OpenSSL`, `CURL`, `Boost`, `CMake`

### Installation

1. **Clone the repository:**
   ```bash
   git clone --recursive https://github.com/ekrishgupta/MuTerminal.git
   cd MuTerminal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the BOP Sidecar:**
   ```bash
   cd engine && mkdir build && cd build
   cmake .. && make sidecar -j4
   ```

4. **Run the Terminal:**
   ```bash
   npm run tauri dev
   ```

## ⌨️ Global Hotkeys

| Key | Action |
| :--- | :--- |
| `Cmd + K` | Open Command Palette |
| `Cmd + L` | Focus terminal command line |
| `F1` - `F6` | Switch Workspaces (Discover, Trade, Strategies, News, Top Traders, Portfolio) |
| `B` / `S` | Instant Trade snap (Focuses execution panel, sets Buy/Sell) |
| `ESC` | Close Overlays / Reset Focus / Blur Inputs |

## ⚖️ License

Private Repository - © 2026 ekrishgupta. 
*BOP is a research-grade framework. Trade responsibly.*
