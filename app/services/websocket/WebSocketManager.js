import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const WS_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-production-domain.com/ws" // Replace with your actual production URL
    : "http://localhost:8080/ws";

class WebSocketManager {
  constructor() {
    this.client = null;
    this.subscriptions = new Map();
    this.connectionStatus = "disconnected";
  }

  connect() {
    return new Promise((resolve, reject) => {
      console.log("Attempting to connect to WebSocket...");
      const socket = new SockJS(WS_URL);
      this.client = Stomp.over(socket);

      this.client.connect(
        {},
        () => {
          console.log("WebSocket connection established successfully");
          this.connectionStatus = "connected";
          this.resubscribe();
          resolve();
        },
        (error) => {
          console.error("WebSocket connection error:", error);
          this.connectionStatus = "error";
          reject(error);
        }
      );
    });
  }

  subscribe(destination, callback) {
    console.log(`Attempting to subscribe to ${destination}`);
    if (!this.client) {
      console.error("WebSocket not connected. Unable to subscribe.");
      return;
    }

    if (this.subscriptions.has(destination)) {
      console.log(`Already subscribed to ${destination}. Skipping.`);
      return;
    }

    const subscription = this.client.subscribe(destination, (message) => {
      console.log(`Received message from ${destination}:`, message.body);
      const payload = JSON.parse(message.body);
      callback(payload);
    });
    this.subscriptions.set(destination, { subscription, callback });
    console.log(`Successfully subscribed to ${destination}`);
  }

  unsubscribe(destination) {
    if (this.subscriptions.has(destination)) {
      console.log(`Unsubscribing from ${destination}`);
      this.subscriptions.get(destination).subscription.unsubscribe();
      this.subscriptions.delete(destination);
    }
  }

  resubscribe() {
    for (const [destination, { callback }] of this.subscriptions.entries()) {
      this.subscribe(destination, callback);
    }
  }

  disconnect() {
    if (this.client) {
      this.client.disconnect();
    }
    this.subscriptions.clear();
  }
}

export const webSocketManager = new WebSocketManager();
