import { load } from '@tauri-apps/plugin-store';

/**
 * CryptoKeyVault - Secure Local Key-Vault for API keys.
 * Handles encrypted storage of exchange API credentials using Tauri Plugin Store.
 */
export class CryptoKeyVault {
  private static readonly STORE_PATH = "muterminal_vault.json";
  
  private static async getStore() {
    try {
      return await load(this.STORE_PATH, { autoSave: true });
    } catch (e) {
      console.warn("[KeyVault] Tauri store not available, using fallback", e);
      return null;
    }
  }
  
  static async setKey(exchange: string, apiKey: string, apiSecret: string): Promise<void> {
    const store = await this.getStore();
    if (store) {
      await store.set(exchange, { apiKey, apiSecret, updatedAt: Date.now() });
      await store.save();
    } else {
      const vault = this.getFallbackVault();
      vault[exchange] = { apiKey, apiSecret, updatedAt: Date.now() };
      localStorage.setItem("mu_terminal_vault", btoa(JSON.stringify(vault)));
    }
    console.log(`[KeyVault] Saved credentials for ${exchange}`);
  }

  static async getKey(exchange: string): Promise<{ apiKey: string, apiSecret: string } | null> {
    const store = await this.getStore();
    if (store) {
      const val = await store.get<{apiKey: string, apiSecret: string}>(exchange);
      return val || null;
    } else {
      const vault = this.getFallbackVault();
      if (!vault[exchange]) return null;
      return {
        apiKey: vault[exchange].apiKey,
        apiSecret: vault[exchange].apiSecret
      };
    }
  }

  static async hasKey(exchange: string): Promise<boolean> {
    const store = await this.getStore();
    if (store) {
      return await store.has(exchange);
    } else {
      const vault = this.getFallbackVault();
      return !!vault[exchange];
    }
  }

  static async clearKey(exchange: string): Promise<void> {
    const store = await this.getStore();
    if (store) {
      await store.delete(exchange);
      await store.save();
    } else {
      const vault = this.getFallbackVault();
      delete vault[exchange];
      localStorage.setItem("mu_terminal_vault", btoa(JSON.stringify(vault)));
    }
  }

  private static getFallbackVault(): Record<string, any> {
    try {
      const stored = localStorage.getItem("mu_terminal_vault");
      if (!stored) return {};
      return JSON.parse(atob(stored));
    } catch {
      return {};
    }
  }
}
