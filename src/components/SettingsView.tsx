import { useState, useEffect } from "react";
import { Save, Lock, Server } from "lucide-react";
import { CryptoKeyVault } from "../utils/CryptoKeyVault";

export function SettingsView() {
  const [polyKey, setPolyKey] = useState("");
  const [polySecret, setPolySecret] = useState("");
  const [kalshiKey, setKalshiKey] = useState("");
  const [kalshiSecret, setKalshiSecret] = useState("");
  
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    // Load existing keys
    CryptoKeyVault.getKey("POLY").then(k => {
      if (k) {
        setPolyKey(k.apiKey);
        setPolySecret(k.apiSecret);
      }
    });
    CryptoKeyVault.getKey("KALSHI").then(k => {
      if (k) {
        setKalshiKey(k.apiKey);
        setKalshiSecret(k.apiSecret);
      }
    });
  }, []);

  const handleSave = async (exchange: string, key: string, secret: string) => {
    if (!key || !secret) return;
    await CryptoKeyVault.setKey(exchange, key, secret);
    setStatus(`Saved ${exchange} credentials securely to OS Keychain`);
    window.dispatchEvent(new CustomEvent("mu-refresh-keys"));
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <div className="flex-1 flex flex-col p-8 overflow-y-auto bg-[var(--color-mu-bg)] items-center">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        
        <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: "var(--color-mu-border)" }}>
          <Server size={24} style={{ color: "var(--color-mu-cyan)" }} />
          <h1 className="text-2xl font-black uppercase tracking-widest" style={{ color: "var(--color-mu-text-bright)" }}>
            Engine Configuration
          </h1>
        </div>

        {status && (
          <div className="px-4 py-2 rounded text-[11px] font-black uppercase tracking-widest text-center" 
               style={{ background: "rgba(44,182,125,0.1)", color: "var(--color-mu-green)", border: "1px solid rgba(44,182,125,0.2)" }}>
            {status}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Lock size={14} style={{ color: "var(--color-mu-purple)" }} />
            <span className="mu-heading">Exchange API Credentials</span>
          </div>
          <p className="text-[11px] font-mono leading-relaxed" style={{ color: "var(--color-mu-text-dim)" }}>
            MuTerminal uses <span className="font-bold text-[var(--color-mu-text)]">tauri-plugin-store</span> to securely encrypt and store API credentials directly in your native OS Keychain. Keys are NEVER sent to our servers and are only passed to the local C++ Sidecar over secure IPC.
          </p>

          <div className="grid grid-cols-2 gap-6 mt-4">
            {/* Polymarket */}
            <div className="mu-panel p-5 flex flex-col gap-4 border-t-2" style={{ borderTopColor: "var(--color-mu-cyan)" }}>
              <div className="flex items-center justify-between">
                <span className="font-black uppercase tracking-widest" style={{ color: "var(--color-mu-text-bright)" }}>Polymarket (CLOB)</span>
                <span className="text-[9px] px-2 py-0.5 rounded font-bold" style={{ background: "var(--color-mu-surface-high)", color: "var(--color-mu-text-dim)" }}>DEFI</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="mu-label">Wallet Private Key / API Key</label>
                <input 
                  type="password"
                  value={polyKey}
                  onChange={e => setPolyKey(e.target.value)}
                  className="bg-black px-3 py-2 rounded text-[12px] font-mono border outline-none"
                  style={{ borderColor: "var(--color-mu-border)", color: "var(--color-mu-text)" }}
                  placeholder="0x..."
                />
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="mu-label">API Secret / Passphrase</label>
                <input 
                  type="password"
                  value={polySecret}
                  onChange={e => setPolySecret(e.target.value)}
                  className="bg-black px-3 py-2 rounded text-[12px] font-mono border outline-none"
                  style={{ borderColor: "var(--color-mu-border)", color: "var(--color-mu-text)" }}
                  placeholder="Secret passphrase..."
                />
              </div>

              <button 
                onClick={() => handleSave("POLY", polyKey, polySecret)}
                className="mt-2 flex items-center justify-center gap-2 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-[var(--color-mu-surface-high)]"
                style={{ border: "1px solid var(--color-mu-border)", color: "var(--color-mu-cyan)" }}
              >
                <Save size={12} /> Save Poly Keys
              </button>
            </div>

            {/* Kalshi */}
            <div className="mu-panel p-5 flex flex-col gap-4 border-t-2" style={{ borderTopColor: "var(--color-mu-green)" }}>
              <div className="flex items-center justify-between">
                <span className="font-black uppercase tracking-widest" style={{ color: "var(--color-mu-text-bright)" }}>Kalshi (V2)</span>
                <span className="text-[9px] px-2 py-0.5 rounded font-bold" style={{ background: "var(--color-mu-surface-high)", color: "var(--color-mu-text-dim)" }}>REGULATED</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="mu-label">API Key</label>
                <input 
                  type="password"
                  value={kalshiKey}
                  onChange={e => setKalshiKey(e.target.value)}
                  className="bg-black px-3 py-2 rounded text-[12px] font-mono border outline-none"
                  style={{ borderColor: "var(--color-mu-border)", color: "var(--color-mu-text)" }}
                  placeholder="Kalshi API Key..."
                />
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="mu-label">Private Key</label>
                <input 
                  type="password"
                  value={kalshiSecret}
                  onChange={e => setKalshiSecret(e.target.value)}
                  className="bg-black px-3 py-2 rounded text-[12px] font-mono border outline-none"
                  style={{ borderColor: "var(--color-mu-border)", color: "var(--color-mu-text)" }}
                  placeholder="PEM Private Key..."
                />
              </div>

              <button 
                onClick={() => handleSave("KALSHI", kalshiKey, kalshiSecret)}
                className="mt-2 flex items-center justify-center gap-2 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-[var(--color-mu-surface-high)]"
                style={{ border: "1px solid var(--color-mu-border)", color: "var(--color-mu-green)" }}
              >
                <Save size={12} /> Save Kalshi Keys
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
