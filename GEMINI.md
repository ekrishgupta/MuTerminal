# MuTerminal: High-Frequency Prediction Protocol

MuTerminal is a professional-grade terminal for prediction market aggregation, arbitrage, and execution, powered by the **BOP (Generalized Outcome Protocol)**.

## 🏗 Architecture
- **Desktop Application:** Built with **Tauri (Rust) + React (TypeScript)**.
- **Backend Engine:** C++20 (BOP Core) - Located in `engine/`. Runs as a high-performance sidecar or linked via FFI.
- **Frontend:** React + Vite + Tailwind (Industrial/Cyber-Terminal Aesthetic).
- **Communication:** Tauri Commands (JSON/MessagePack) + Local WebSockets for streaming data from the BOP engine.

## 🚀 Why Tauri?
- **Performance:** Native Rust backend with a lighter footprint than Electron.
- **Security:** Rust's memory safety and Tauri's scoped isolation.
- **Sidecars:** Native support for running the C++ BOP engine as a managed subprocess.

## 📁 Project Structure
- `/src-tauri`: Rust backend and Tauri configuration.
- `/src`: React frontend (Vite).
- `/engine`: C++ BOP framework.
- `/scripts`: User-defined `.bop` strategy scripts.

## 🚀 Roadmap

### Phase 1: The "Mu" Foundation
- [x] Create project structure and `GEMINI.md`.
- [x] Scaffold Tauri + React (Vite) boilerplate.
- [ ] Link `bop` as a core engine dependency.

### Phase 2: Aggregated Liquidity (The Terminal)
- [ ] Build the **Unified Order Book (UOB)**.
- [ ] Implement the **"Mu-Command" Palette**.

### Phase 3: BOP Execution & Automation
- [ ] Integrate a **Script Runner** for `.bop` files.
- [ ] Implement **"Whale Tracker"** for alpha monitoring.
