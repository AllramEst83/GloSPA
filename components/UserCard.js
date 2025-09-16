export default function UserCard() {
  return {
    template: `
      <div class="user-card">
        <div class="user-header">
          <span class="avatar">{{user.profile.avatar}}</span>
          <h3>Hello {{user.name}}</h3>
          <span class="role">({{user.role}})</span>
        </div>
        <div class="user-details">
          <p>Theme: {{user.profile.theme}}</p>
          <p>Language: {{user.profile.preferences.language}}</p>
          <p>Notifications: {{user.profile.preferences.notifications}}</p>
        </div>
        <div class="user-actions">
          <button id="renameBtn">Change User</button>
          <button id="toggleRoleBtn">Toggle Role</button>
          <button id="toggleThemeBtn">Toggle Theme</button>
          <button id="toggleNotificationsBtn">Toggle Notifications</button>
        </div>
      </div>
    `,
    init(store, bus, root) {
      root.querySelector("#renameBtn").onclick = () => {
        const names = ["Alice", "Bob", "Charlie", "Diana"];
        const currentIndex = names.indexOf(store.user.name);
        const nextIndex = (currentIndex + 1) % names.length;
        store.user.name = names[nextIndex];
        bus.emit("user:changed", { 
          name: store.user.name, 
          action: "rename" 
        });
      };
      
      root.querySelector("#toggleRoleBtn").onclick = () => {
        store.user.role = store.user.role === "admin" ? "user" : "admin";
        bus.emit("user:role-changed", store.user.role);
      };
      
      root.querySelector("#toggleThemeBtn").onclick = () => {
        store.user.profile.theme = store.user.profile.theme === "dark" ? "light" : "dark";
        bus.emit("user:theme-changed", store.user.profile.theme);
      };
      
      root.querySelector("#toggleNotificationsBtn").onclick = () => {
        store.user.profile.preferences.notifications = !store.user.profile.preferences.notifications;
        bus.emit("user:notifications-changed", store.user.profile.preferences.notifications);
      };
    }
  };
}
