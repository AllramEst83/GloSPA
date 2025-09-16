import GloSPA from "../provider/gloSpa.js";

// Global store with nested objects
const store = GloSPA.createReactive({ 
  counter: {
    value: 0,
    step: 1,
    label: "Click Counter"
  },
  user: {
    name: "Alice",
    role: "admin",
    profile: {
      avatar: "👤",
      theme: "dark",
      preferences: {
        language: "en",
        notifications: true
      }
    }
  },
  app: {
    title: "GloSPA Demo",
    version: "2.0",
    status: "active"
  }
});

// Lazy routes
const routes = {
  home: () => import("../../pages/HomePage.js"),
  about: () => import("../../pages/AboutPage.js")
};

// Debug
GloSPA.bus.onAny((event, detail) => {
  console.log("[DEBUG]", event, detail);
});

// Init app
GloSPA.initRouter(routes, store);
