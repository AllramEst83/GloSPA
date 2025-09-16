import GloSPA from "../assets/provider/gloSpa.js";

export default {
  template: `
    <div class="home-page">
      <header>
        <h1>{{app.title}}</h1>
        <p class="version">Version {{app.version}} - Status: {{app.status}}</p>
      </header>
      
      <section class="welcome">
        <h2>Welcome {{user.name}}!</h2>
        <p>You are logged in as: <strong>{{user.role}}</strong></p>
        <p>Current theme: {{user.profile.theme}}</p>
      </section>
      
      <section class="demo">
        <h2>Interactive Counter Demo</h2>
        <p>This demonstrates nested reactive objects in action:</p>
        <div data-component="Counter"></div>
      </section>
      
      <section class="app-controls">
        <h2>App Control Demo</h2>
        <p>Update app-level properties:</p>
        <div class="control-buttons">
          <button id="updateVersionBtn">Update Version</button>
          <button id="toggleStatusBtn">Toggle Status</button>
          <button id="changeTitleBtn">Change Title</button>
        </div>
      </section>
      
      <section class="user-controls">
        <h2>User Control Demo</h2>
        <p>Update nested user properties:</p>
        <div class="control-buttons">
          <button id="changeNameBtn">Change Name</button>
          <button id="toggleThemeBtn">Toggle Theme</button>
          <button id="changeLanguageBtn">Change Language</button>
          <button id="toggleNotificationsBtn">Toggle Notifications</button>
        </div>
      </section>
      
      <section class="state-display">
        <h3>Current State Values:</h3>
        <ul>
          <li>Counter Value: {{counter.value}}</li>
          <li>Counter Step: {{counter.step}}</li>
          <li>User Name: {{user.name}}</li>
          <li>User Theme: {{user.profile.theme}}</li>
          <li>Language: {{user.profile.preferences.language}}</li>
        </ul>
      </section>
    </div>
  `,
  async init(store, bus) {
    if (!GloSPA.hasComponent("Counter")) {
      const mod = await import("../components/Counter.js");
      GloSPA.registerComponent("Counter", mod.default);
    }
    
    // Ensure bindings are updated after component loading
    setTimeout(() => {
      store.__bindTemplates(document.getElementById("app"));
    }, 100);
    
    // App control buttons
    const setupButton = (id, handler) => {
      const btn = document.getElementById(id);
      if (btn) btn.onclick = handler;
    };
    
    setupButton("updateVersionBtn", () => {
      const versions = ["2.0", "2.1", "2.2", "3.0"];
      const currentIndex = versions.indexOf(store.app.version);
      const nextIndex = (currentIndex + 1) % versions.length;
      store.app.version = versions[nextIndex];
      bus.emit("app:version-changed", store.app.version);
    });
    
    setupButton("toggleStatusBtn", () => {
      store.app.status = store.app.status === "active" ? "maintenance" : "active";
      bus.emit("app:status-changed", store.app.status);
    });
    
    setupButton("changeTitleBtn", () => {
      const titles = ["GloSPA Demo", "My Awesome App", "Reactive Framework", "GloSPA v2"];
      const currentIndex = titles.indexOf(store.app.title);
      const nextIndex = (currentIndex + 1) % titles.length;
      store.app.title = titles[nextIndex];
      bus.emit("app:title-changed", store.app.title);
    });
    
    // User control buttons
    setupButton("changeNameBtn", () => {
      const names = ["Alice", "Bob", "Charlie", "Diana", "Eve"];
      const currentIndex = names.indexOf(store.user.name);
      const nextIndex = (currentIndex + 1) % names.length;
      store.user.name = names[nextIndex];
      bus.emit("user:name-changed", store.user.name);
    });
    
    setupButton("toggleThemeBtn", () => {
      store.user.profile.theme = store.user.profile.theme === "dark" ? "light" : "dark";
      bus.emit("user:theme-changed", store.user.profile.theme);
    });
    
    setupButton("changeLanguageBtn", () => {
      const languages = ["en", "es", "fr", "de", "ja"];
      const currentIndex = languages.indexOf(store.user.profile.preferences.language);
      const nextIndex = (currentIndex + 1) % languages.length;
      store.user.profile.preferences.language = languages[nextIndex];
      bus.emit("user:language-changed", store.user.profile.preferences.language);
    });
    
    setupButton("toggleNotificationsBtn", () => {
      store.user.profile.preferences.notifications = !store.user.profile.preferences.notifications;
      bus.emit("user:notifications-changed", store.user.profile.preferences.notifications);
    });
    
    // Listen to nested object changes
    bus.on("counter:changed", (e) => {
      console.log("HomePage saw counter change:", e.detail);
    });
    
    bus.on("counter:step-changed", (e) => {
      console.log("HomePage saw step change:", e.detail);
    });
    
    bus.on("app:version-changed", (e) => {
      console.log("HomePage saw app version change:", e.detail);
    });
    
    bus.on("user:name-changed", (e) => {
      console.log("HomePage saw user name change:", e.detail);
    });
  }
};
