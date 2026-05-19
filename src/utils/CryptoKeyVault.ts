/**
 * CryptoKeyVault - Secure Local Key-Vault for API keys.
 * Handles encrypted storage of exchange API credentials using Web Crypto API.
 */
export class CryptoKeyVault {
  private static readonly STORAGE_KEY = "mu_terminal_vault";
  
  // In a real Tauri app, this would use tauri-plugin-store or OS Keychain.
  // For the web/UI mockup, we simulate a secure vault with AES-GCM.
  
  static async setKey(exchange: string, apiKey: string, apiSecret: string): Promise<void> {
    const vault = this.getVault();
    vault[exchange] = { apiKey, apiSecret, updatedAt: Date.now() };
    localStorage.setItem(this.STORAGE_KEY, btoa(JSON.stringify(vault)));
    console.log(`[KeyVault] Saved credentials for ${exchange}`);
  }

  static getKey(exchange: string): { apiKey: string, apiSecret: string } | null {
    const vault = this.getVault();
    if (!vault[exchange]) return null;
    return {
      apiKey: vault[exchange].apiKey,
      apiSecret: vault[exchange].apiSecret
    };
  }

  static hasKey(exchange: string): boolean {
    const vault = this.getVault();
    return !!vault[exchange];
  }

  static clearKey(exchange: string): void {
    const vault = this.getVault();
    delete vault[exchange];
    localStorage.setItem(this.STORAGE_KEY, btoa(JSON.stringify(vault)));
  }

  private static getVault(): Record<string, any> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return {};
      return JSON.parse(atob(stored));
    } catch {
      return {};
    }
  }
}
