import GloSPA from "../assets/provider/gloSpa.js";

export default {
  template: `
    <div class="about-page">
      <header>
        <h1>About {{app.title}}</h1>
        <p>Learn about our nested reactive system</p>
      </header>
      
      <section class="user-section">
        <h2>User Profile Management</h2>
        <p>Current user: <strong>{{user.name}}</strong> ({{user.role}})</p>
        <div data-component="UserCard"></div>
      </section>
      
      <section class="counter-section">
        <h2>Counter Demo</h2>
        <p>The same counter instance from the Home page:</p>
        <div data-component="Counter"></div>
      </section>
      
      <section class="nested-demo">
        <h2>Nested Object Examples</h2>
        <div class="nested-values">
          <h3>User Profile Object:</h3>
          <ul>
            <li>Name: {{user.name}}</li>
            <li>Role: {{user.role}}</li>
            <li>Avatar: {{user.profile.avatar}}</li>
            <li>Theme: {{user.profile.theme}}</li>
            <li>Language: {{user.profile.preferences.language}}</li>
            <li>Notifications: {{user.profile.preferences.notifications}}</li>
          </ul>
          
          <h3>Counter Object:</h3>
          <ul>
            <li>Value: {{counter.value}}</li>
            <li>Step: {{counter.step}}</li>
            <li>Label: {{counter.label}}</li>
          </ul>
          
          <h3>App Object:</h3>
          <ul>
            <li>Title: {{app.title}}</li>
            <li>Version: {{app.version}}</li>
            <li>Status: {{app.status}}</li>
          </ul>
        </div>
      </section>
    </div>
  `,
  async init(store, bus) {
    if (!GloSPA.hasComponent("UserCard")) {
      const mod = await import("../components/UserCard.js");
      GloSPA.registerComponent("UserCard", mod.default);
    }
    if (!GloSPA.hasComponent("Counter")) {
      const mod = await import("../components/Counter.js");
      GloSPA.registerComponent("Counter", mod.default);
    }
    
    // Listen to all user-related events
    bus.on("user:changed", (e) => {
      console.log("AboutPage saw user change:", e.detail);
    });
    
    bus.on("user:role-changed", (e) => {
      console.log("AboutPage saw role change:", e.detail);
    });
    
    bus.on("user:theme-changed", (e) => {
      console.log("AboutPage saw theme change:", e.detail);
    });
    
    bus.on("user:notifications-changed", (e) => {
      console.log("AboutPage saw notifications change:", e.detail);
    });
  }
};
