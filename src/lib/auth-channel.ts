/**
 * Cross-Tab Authentication Synchronizer (BroadcastChannel)
 *
 * Propagates auth events (LOGIN, LOGOUT, SESSION_EXPIRED) across all open browser
 * tabs so that multi-tab sessions stay synchronized without requiring manual reloads.
 */

export type AuthChannelMessage =
  | { type: "LOGIN" }
  | { type: "LOGOUT" }
  | { type: "SESSION_EXPIRED" };

const CHANNEL_NAME = "cms_auth_channel";

class AuthChannelManager {
  private channel: BroadcastChannel | null = null;

  constructor() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      this.channel = new BroadcastChannel(CHANNEL_NAME);
    }
  }

  /**
   * Broadcast an event to other browser tabs
   */
  postMessage(message: AuthChannelMessage): void {
    try {
      this.channel?.postMessage(message);
    } catch {
      // Graceful fallback if channel is closed or unsupported
    }
  }

  /**
   * Subscribe to events broadcast from other tabs
   */
  subscribe(callback: (message: AuthChannelMessage) => void): () => void {
    if (!this.channel) return () => {};

    const handler = (event: MessageEvent<AuthChannelMessage>) => {
      if (event?.data?.type) {
        callback(event.data);
      }
    };

    this.channel.addEventListener("message", handler);

    return () => {
      this.channel?.removeEventListener("message", handler);
    };
  }
}

export const authChannel = new AuthChannelManager();
