# μTerminal (MuTerminal)

[![BOP Protocol](https://img.shields.io/badge/Engine-BOP%20Protocol-red.svg)](https://github.com/ekrishgupta/bop)
[![Tauri](https://img.shields.io/badge/Framework-Tauri%20v2-blue.svg)](https://tauri.app/)
[![React](https://img.shields.io/badge/Frontend-React%20v19-cyan.svg)](https://react.dev/)

**MuTerminal (μT)** is a professional-grade execution environment and high-frequency aggregator for prediction markets. Built for "Alpha Hunters," it combines a low-latency C++20 trading engine with a high-density, keyboard-first industrial interface.

---

## 🚀 Key Features

- **Unified Liquidity Aggregator (ULA):** Real-time side-by-side order books for Kalshi, Polymarket, and other major venues.
- **BOP DSL Integration:** Execute complex, programmed trading strategies using the *Generalized Outcome Protocol* directly from the terminal command line.
- **Cyber-Industrial UI:** A high-density, TUI-inspired dashboard optimized for information awareness and sub-millisecond reaction times.
- **Alpha Monitor:** Real-time "Squawk" feed and whale-watching notifications for institutional-grade market intelligence.
- **Keyboard-First Workflow:** Full command palette (`Cmd+K`) and rapid view-switching (`Alt+1-7`) for mouse-less operation.

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
| `Cmd + K` | Open Command Palette / Focus μT_CMD |
| `Alt + 1` | Switch to **Discovery** |
| `Alt + 2` | Switch to **Trade** |
| `Alt + 3` | Switch to **News Feed** |
| `Alt + 4` | Switch to **Analytics** |
| `Alt + 5` | Switch to **Top Traders** |
| `ESC` | Close Overlays / Reset Focus |

## ⚖️ License

Private Repository - © 2026 ekrishgupta. 
*BOP is a research-grade framework. Trade responsibly.*
