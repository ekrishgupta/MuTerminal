# MuTerminal: High-Frequency Prediction Protocol (μT)

MuTerminal is a professional-grade execution environment for prediction market professional traders. It bridges the gap between fragmented retail interfaces and high-speed institutional trading by leveraging the **BOP (Generalized Outcome Protocol)** as its core engine.

## 🎯 Vision & Usability
MuTerminal is designed for the **"Alpha Hunter"**: a trader who values speed, precision, and information density. Unlike standard dashboards, μT treats prediction markets like a modern L1 perpetual exchange (e.g., Hyperliquid).

### Core Philosophy
- **Keyboard-First:** Every action is mapping to a hotkey. Latency in clicking is lost alpha.
- **Information Density:** Side-by-side depth, real-time news squawks, and on-chain whale tracking.
- **Unified Liquidity:** One ticker (`MU:TRUMP`) abstracts away the underlying venue (Kalshi, Polymarket).

## 🏗 Technical Specification

### Architecture: The "Sidecar" Pattern
MuTerminal avoids the performance bottlenecks of JavaScript by offloading all heavy lifting to a C++ sidecar.
- **Tauri Shell (Rust):** Handles OS-level window management, system tray, and secure storage for API keys.
- **BOP Engine (C++20):** A standalone binary running as a Tauri Sidecar. It maintains persistent WebSockets to exchanges and executes `.bop` strategy scripts.
- **React UI (TypeScript):** A high-performance TUI-inspired interface that consumes a local WebSocket stream from the BOP Engine.

### Project Structure
```text
MuTerminal/
├── src-tauri/              # Rust Backend (Tauri)
│   ├── src/main.rs         # Sidecar orchestration & IPC
│   └── tauri.conf.json     # Security & Sidecar config
├── src/                    # React Frontend
│   ├── components/
│   │   ├── Terminal/       # The "BOP" Command Line
│   │   ├── Depth/          # Aggregated Order Books
│   │   └── Monitor/        # Whale & News feeds
│   ├── hooks/              # useBopBridge (WebSocket connection)
│   └── theme/              # Tailwind μT "Cyber-Industrial" config
├── engine/                 # BOP Engine (C++20)
│   ├── core/               # DSL & Execution logic
│   ├── exchanges/          # Kalshi/Polymarket Adapters
│   └── main.cpp            # Sidecar entry point (WS Server)
├── scripts/                # User's .bop strategies
└── GEMINI.md               # This master plan
```

## 📊 Market Context

### Competitor Landscape
| Feature | Predictefy | Hyperliquid | MuTerminal (μT) |
| :--- | :--- | :--- | :--- |
| **Asset Class** | Prediction Markets | Crypto Perps | **Prediction Markets** |
| **Execution** | Manual/Web | Pro Terminal | **DSL-Automated (BOP)** |
| **Latency** | Medium (Browser) | Low | **Ultra-Low (Native)** |
| **Custom Logic** | Limited | None | **Fully Programmable** |

### Customer Profile
1. **The Arbitrageur:** Exploits price gaps between Kalshi (Regulated/US) and Polymarket (DeFi).
2. **The Event Hedger:** Uses prediction markets to hedge real-world risk (e.g., hedging a portfolio against interest rate hikes).
3. **The Whale Follower:** Uses the built-in copy-trade functionality to mirror high-conviction movers.

## 🛠 Functional Requirements & Features

### 1. Unified Liquidity Aggregator (ULA)
- **Aggregated Order Book:** Shows the best Bid/Ask across all venues in a single depth chart.
- **Smart Routing:** When you buy 1000 shares, μT automatically splits the order between Kalshi and Polymarket to minimize slippage.

### 2. The BOP Command Line
A CLI-style input at the base of the UI that accepts BOP syntax for instant execution:
- `Buy(100) / "TRUMP_WIN" | IOC`
- `Arb("TRUMP", 0.02)` -> Starts an automated arb loop with a 2c spread.

### 3. Alpha Surveillance
- **Whale Watcher:** Real-time push notifications when top-ranked wallets execute >$10k trades.
- **News Squawk:** A low-latency text feed that highlights keywords (e.g., "POLL", "VERDICT", "RULING") and allows 1-click execution on the related ticker.

### 4. Risk Gates & Safety
- **Global Kill Switch:** One button to cancel all orders and flatten all positions.
- **Fat-Finger Guard:** Hard limits on max order size and price slippage.

## 📈 Roadmap

### Phase 1: Foundation (Current)
- [x] Initial Tauri + React + BOP Scaffold.
- [ ] Implement C++ Sidecar IPC (Tauri -> BOP communication).
- [ ] Secure Local Key-Vault for API keys.

### Phase 2: The UI Shell
- [ ] Cyber-Industrial Tailwind Theme.
- [ ] Aggregated Order Book Component (UOB).
- [ ] Real-time data streaming via local WS.

### Phase 3: Trading & Execution
- [ ] Kalshi v2 Auth implementation.
- [ ] Polymarket CLOB integration.
- [ ] First "Universal Market" trade via μT.

### Phase 4: Intelligence
- [ ] News-to-Ticker mapping.
- [ ] Whale Tracking Dashboard.
