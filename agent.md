# GloSPA Framework - Agent Documentation

## Project Overview

GloSPA is a lightweight, custom Single Page Application (SPA) framework written in vanilla JavaScript. It provides a reactive component system, event-driven architecture, client-side routing, and state management without any external dependencies.

## Architecture

### Core Philosophy
- **Zero Dependencies**: Built entirely with vanilla JavaScript and Web APIs
- **Reactive State Management**: Automatic UI updates through proxy-based reactivity
- **Component-Based**: Modular component system with lazy loading
- **Event-Driven**: Centralized event bus for component communication
- **Lazy Loading**: Dynamic imports for pages and components
- **Template Binding**: Simple mustache-style template interpolation

## Project Structure

```
c:\Users\kaywi\dev\GloSPA\
├── index.html          # Main HTML entry point
├── agent.md            # This documentation file
├── assets/             # Static assets and core files
│   ├── css/            # Stylesheets
│   │   └── site.css    # Comprehensive application styles with component theming
│   ├── js/             # JavaScript files
│   │   └── site.js     # Application initialization with nested reactive store
│   └── provider/       # Framework providers
│       └── gloSpa.js   # Enhanced core framework with nested object support
├── components/         # Reusable UI components
│   ├── Counter.js      # Interactive counter component
│   └── UserCard.js     # User display/edit component
└── pages/              # Page-level components
    ├── HomePage.js     # Home page implementation
    └── AboutPage.js    # About page implementation
```

## Core Framework Components (`assets/provider/gloSpa.js`)

### EventBus Class
- **Purpose**: Centralized event management system
- **Features**: 
  - Standard event subscription (`on`, `off`, `once`)
  - Event emission with custom data (`emit`)
  - Wildcard listeners for all events (`onAny`, `offAny`)
- **Implementation**: Uses DOM CustomEvent API with a hidden DOM element as event target

### Reactive State System
- **Function**: `createReactive(state)`
- **Purpose**: Creates reactive state objects that automatically update bound DOM elements
- **Features**:
  - Proxy-based reactivity (intercepts property changes)
  - **Nested Object Support**: Full support for deeply nested object structures
  - **Dot Notation Binding**: Template binding with `{{object.property}}` and `{{object.nested.property}}` syntax
  - **Deep Reactivity**: Changes to any nested property trigger UI updates
  - **Dynamic Object Addition**: Add new nested objects at runtime
  - DOM text node updates on state changes
  - TreeWalker API for efficient DOM traversal

#### Nested Object Examples
```javascript
// Create nested reactive state
const store = GloSPA.createReactive({
  user: {
    name: "Alice",
    profile: {
      avatar: "👤",
      preferences: {
        theme: "dark",
        language: "en"
      }
    }
  }
});

// Template usage with dot notation
// {{user.name}} → "Alice"
// {{user.profile.avatar}} → "👤" 
// {{user.profile.preferences.theme}} → "dark"

// Reactive updates
store.user.name = "Bob";  // UI automatically updates
store.user.profile.preferences.theme = "light";  // Nested updates work too

// Add new nested objects dynamically
store.newUser = { name: "Charlie", age: 30 };
```

### Component System
- **Registration**: `registerComponent(name, componentFunction)`
- **Rendering**: `renderComponents(root, store, bus)`
- **Features**:
  - Component registration and reuse
  - Automatic component discovery via `data-component` attributes
  - Template rendering and state binding
  - Component initialization with store and bus access

### Router System
- **Function**: `initRouter(routes, store)`
- **Features**:
  - Hash-based routing (`#home`, `#about`)
  - Lazy loading of page modules
  - Loading states during route transitions
  - 404 handling for unknown routes
  - Async component initialization

## Application Architecture (`assets/js/site.js`)

### Global State
```javascript
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
```
- **Nested Reactive Objects**: Supports deeply nested object structures
- **Dot Notation Access**: Use `{{user.name}}`, `{{user.profile.theme}}`, `{{user.profile.preferences.language}}`
- **Automatic UI Updates**: Changes to any nested property trigger reactive updates
- **Shared Across Components**: All nested objects are shared between pages and components

### Route Configuration
```javascript
const routes = {
  home: () => import("./pages/HomePage.js"),
  about: () => import("./pages/AboutPage.js")
};
```
- Lazy-loaded page modules
- Dynamic imports for code splitting
- Route-to-module mapping

### Debug System
- **Global Event Listener**: Captures and logs all emitted events to console
- **Nested Object Debugging**: Detailed logging for nested property changes
- **Console Output**: Real-time state change monitoring
- **Debug Test Files**: 
  - `debug-reactive.html`: Isolated reactive binding test page
  - `test-nested.html`: Comprehensive nested object demo
- **Event Tracing**: Track event flow between components and pages
- **State Inspection**: Live monitoring of reactive store changes

## Component Architecture

### Component Structure
All components follow a consistent pattern:

```javascript
export default function ComponentName() {
  return {
    template: `<div>HTML template with {{bindings}}</div>`,
    init(store, bus, root) {
      // Component initialization logic
      // Event listeners, API calls, etc.
    }
  };
}
```

### Component Features
- **Template Property**: HTML string with reactive bindings
- **Init Function**: Receives store (reactive state), bus (event system), and root (DOM element)
- **Event Handling**: Direct DOM event listeners and bus events
- **State Access**: Full access to global reactive store

### Example Components

#### Counter Component (`components/Counter.js`)
- Displays counter data from nested `store.counter` object
- Uses `{{counter.value}}`, `{{counter.step}}`, `{{counter.label}}` bindings
- Multiple action buttons (increment, decrement, reset, change step)
- Emits detailed `counter:changed` events with action information
- Demonstrates nested object property manipulation

#### UserCard Component (`components/UserCard.js`)
- Displays user profile from deeply nested `store.user` object
- Shows `{{user.name}}`, `{{user.role}}`, `{{user.profile.avatar}}`
- Accesses preferences: `{{user.profile.preferences.language}}`
- Multiple interactive buttons for different nested properties
- Emits specific events: `user:changed`, `user:role-changed`, `user:theme-changed`
- Demonstrates 3-level deep object reactivity

## Page Architecture

### Page Structure
Pages are similar to components but serve as route targets:

```javascript
export default {
  template: `<div>Page content with {{bindings}} and <div data-component="ComponentName"></div></div>`,
  async init(store, bus) {
    // Lazy load and register components
    // Set up page-specific event listeners
  }
};
```

### Page Features
- **Template Property**: HTML with component placeholders
- **Async Init**: Supports asynchronous initialization
- **Component Loading**: Dynamic import and registration of needed components
- **Event Subscription**: Page-level event handling

### Example Pages

#### HomePage (`pages/HomePage.js`)
- **Enhanced Interactive Demo**: Comprehensive showcase of nested reactive objects
- **Welcome Section**: Dynamic user greeting with `{{user.name}}`, role, and theme display
- **Counter Component**: Embedded interactive counter with nested object bindings
- **App Controls Section**: Interactive buttons to update app-level properties:
  - Update Version (cycles through versions)
  - Toggle Status (active ↔ maintenance)
  - Change Title (cycles through different titles)
- **User Controls Section**: Interactive buttons for nested user properties:
  - Change Name (cycles through multiple names)
  - Toggle Theme (dark ↔ light)
  - Change Language (cycles through language codes)
  - Toggle Notifications (true ↔ false)
- **Live State Display**: Real-time display of current nested object values
- **Event Handling**: Comprehensive event listeners for all nested object changes
- **Template Binding Demo**: Multiple levels of nested property binding
- **Console Logging**: Debug output for all state changes

#### AboutPage (`pages/AboutPage.js`)
- **Comprehensive User Profile**: Deep nested object display and interaction
- **Multiple Components**: Embeds both UserCard and Counter components
- **Nested Object Breakdown**: Complete display of all nested properties:
  - User profile object with 3-level nesting
  - Counter object properties
  - App object properties
- **Event Listening**: Monitors user-related, role, theme, and notification changes
- **Interactive Components**: Full UserCard functionality with nested property updates
- **State Demonstration**: Shows shared state between components and pages

## Development Patterns

### Adding New Components

1. **Create Component File**: `components/NewComponent.js`
```javascript
export default function NewComponent() {
  return {
    template: `<div>{{someState}} <button id="actionBtn">Action</button></div>`,
    init(store, bus, root) {
      root.querySelector("#actionBtn").onclick = () => {
        // Handle user interaction
        store.someState = "updated";
        bus.emit("custom:event", { data: "value" });
      };
    }
  };
}
```

2. **Register in Page**: Import and register in page init
```javascript
if (!GloSPA.hasComponent("NewComponent")) {
  const mod = await import("../components/NewComponent.js");
  GloSPA.registerComponent("NewComponent", mod.default);
}
```

3. **Use in Template**: Add to page or component template
```html
<div data-component="NewComponent"></div>
```

### Adding New Pages

1. **Create Page File**: `pages/NewPage.js`
```javascript
import GloSPA from "../assets/provider/gloSpa.js";

export default {
  template: `
    <h1>New Page</h1>
    <p>Content with {{state}}</p>
    <div data-component="SomeComponent"></div>
  `,
  async init(store, bus) {
    // Load required components
    if (!GloSPA.hasComponent("SomeComponent")) {
      const mod = await import("../components/SomeComponent.js");
      GloSPA.registerComponent("SomeComponent", mod.default);
    }
    
    // Set up page-specific logic
    bus.on("some:event", (e) => {
      console.log("Page received event:", e.detail);
    });
  }
};
```

2. **Add Route**: Update routes in `assets/js/site.js`
```javascript
const routes = {
  home: () => import("./pages/HomePage.js"),
  about: () => import("./pages/AboutPage.js"),
  newpage: () => import("./pages/NewPage.js")
};
```

3. **Add Navigation**: Update HTML navigation in `index.html`
```html
<nav>
  <a href="#home">Home</a> |
  <a href="#about">About</a> |
  <a href="#newpage">New Page</a>
</nav>
```

### State Management Patterns

#### Adding New State Properties
```javascript
// In assets/js/site.js, extend the store with nested objects
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
  newFeature: {
    enabled: true,
    settings: {
      mode: "advanced",
      options: { autoSave: true }
    }
  }
});
```

#### Reactive Updates with Nested Objects
```javascript
// Update simple properties
store.user.name = "Bob";
store.counter.value = 10;

// Update nested properties
store.user.profile.theme = "light";
store.user.profile.preferences.language = "es";
store.user.profile.preferences.notifications = false;

// Update deeply nested properties
store.newFeature.settings.options.autoSave = false;

// Add new nested objects dynamically
store.user.profile.social = {
  twitter: "@username",
  github: "username"
};

// UI automatically updates where these are bound:
// {{user.name}}, {{user.profile.theme}}, {{user.profile.social.twitter}}
```

#### Nested Object State Listening
```javascript
// Components can listen for nested object changes via events
bus.on("user:changed", (e) => {
  console.log("User changed:", e.detail);
});

bus.on("user:theme-changed", (e) => {
  console.log("Theme changed to:", e.detail);
});

bus.on("counter:changed", (e) => {
  console.log("Counter action:", e.detail.action, "Value:", e.detail.value);
});
```

### Event System Patterns

#### Custom Events
```javascript
// Emit custom events with data
bus.emit("user:login", { userId: 123, username: "john" });
bus.emit("data:loaded", { items: [...] });
bus.emit("error:occurred", { message: "Something went wrong" });
```

#### Event Handling
```javascript
// Listen for specific events
bus.on("user:login", (e) => {
  const { userId, username } = e.detail;
  // Handle login logic
});

// One-time event listeners
bus.once("data:loaded", (e) => {
  // Handle initial data load
});

// Listen to all events (debugging)
bus.onAny((eventName, detail) => {
  console.log(`Event: ${eventName}`, detail);
});
```

### Template Binding Patterns

#### Simple Binding
```html
<p>Hello {{user.name}}</p>
<span>Count: {{counter.value}}</span>
<span>Theme: {{user.profile.theme}}</span>
```

#### Nested Object Binding
```html
<div class="user-info">
  <h2>{{user.name}} ({{user.role}})</h2>
  <p>Avatar: {{user.profile.avatar}}</p>
  <p>Theme: {{user.profile.theme}}</p>
  <p>Language: {{user.profile.preferences.language}}</p>
  <p>Notifications: {{user.profile.preferences.notifications}}</p>
</div>
```

#### Complex Templates with Multiple Nested Objects
```html
<div class="dashboard">
  <header>
    <h1>{{app.title}} v{{app.version}}</h1>
    <span class="status">{{app.status}}</span>
  </header>
  
  <section class="user-section">
    <span>{{user.profile.avatar}}</span>
    <span>{{user.name}}</span>
    <small>({{user.role}})</small>
  </section>
  
  <section class="counter-section">
    <h3>{{counter.label}}</h3>
    <p>Value: {{counter.value}} | Step: {{counter.step}}</p>
  </section>
  
  <div data-component="UserProfile"></div>
  <div data-component="Counter"></div>
</div>
```

## Interactive Demo Features

### Live Reactive Testing
The GloSPA demo includes comprehensive interactive features to demonstrate nested object reactivity:

#### **App-Level Controls** (HomePage)
- **Version Cycling**: Updates `{{app.version}}` through multiple versions (2.0 → 2.1 → 2.2 → 3.0)
- **Status Toggle**: Switches `{{app.status}}` between "active" and "maintenance"
- **Title Rotation**: Changes `{{app.title}}` through various demo titles
- **Real-Time Updates**: All changes immediately reflect in bound templates

#### **User Profile Controls** (HomePage)
- **Name Cycling**: Updates `{{user.name}}` through multiple user names
- **Theme Toggle**: Switches `{{user.profile.theme}}` between "dark" and "light"
- **Language Selection**: Cycles `{{user.profile.preferences.language}}` through language codes
- **Notification Toggle**: Switches `{{user.profile.preferences.notifications}}` boolean value
- **Deep Nesting Demo**: Shows 3-level deep reactive updates

#### **Component Integration**
- **Counter Component**: Interactive increment/decrement with step control
- **UserCard Component**: Multi-button interface for nested property updates
- **Shared State**: Demonstrates state sharing between pages and components
- **Event Emission**: Each interaction emits detailed events with change information

#### **Debug and Development Tools**
- **Console Logging**: All state changes logged to browser console
- **Event Tracing**: Detailed event flow monitoring
- **Live State Display**: Current values shown in real-time sections
- **Isolated Testing**: `debug-reactive.html` for focused reactive testing

### Styling and UI
- **Modern Design**: Clean, professional interface with gradient headers
- **Component Styling**: Distinct visual styling for different component types
- **Interactive Feedback**: Hover effects and visual state indicators
- **Responsive Layout**: Flexible grid system for different screen sizes
- **Button Grouping**: Organized control sections with clear visual hierarchy

## Best Practices

### Component Design
- **Single Responsibility**: Each component should have one clear purpose
- **Reusability**: Design components to be reusable across pages
- **State Isolation**: Use global store for shared state, local variables for component-specific state
- **Event Naming**: Use descriptive event names with namespaces (e.g., `user:login`, `data:loaded`)

### Performance Considerations
- **Lazy Loading**: Only load components when needed
- **Event Cleanup**: Remove event listeners when components are destroyed (if implementing cleanup)
- **Template Efficiency**: Keep templates simple and avoid complex logic in bindings

### Development Workflow
- **Component First**: Build and test components in isolation
- **Progressive Enhancement**: Start with basic functionality, add features incrementally
- **Event-Driven Communication**: Use the event bus for loose coupling between components
- **State Centralization**: Keep shared state in the global store

### Error Handling
- **Graceful Degradation**: Handle missing components and routes
- **Error Events**: Emit error events for centralized error handling
- **Fallback Content**: Provide fallback content for failed loads

## API Reference

### GloSPA Object
- `bus: EventBus` - Global event bus instance
- `createReactive(state)` - Create reactive state object
- `initRouter(routes, store)` - Initialize router with routes
- `registerComponent(name, fn)` - Register component globally
- `hasComponent(name)` - Check if component is registered

### EventBus Methods
- `on(event, callback)` - Subscribe to event
- `off(event, callback)` - Unsubscribe from event
- `once(event, callback)` - Subscribe to event once
- `emit(event, detail)` - Emit event with data
- `onAny(callback)` - Listen to all events
- `offAny(callback)` - Stop listening to all events

### Enhanced Reactive Store
- **Direct Property Access**: Access nested properties with dot notation (`store.user.profile.theme`)
- **Nested Object Assignment**: Assign to any level (`store.user.profile.preferences.language = "es"`)
- **Dynamic Object Addition**: Add new nested objects at runtime (`store.newObject = { nested: { data: "value" } }`)
- **Multi-Level Reactivity**: Support for unlimited nesting depth with full reactivity
- **Template Binding**: Use `{{object.property}}` or `{{object.nested.deep.property}}` in templates
- **Automatic UI Updates**: All nested property changes trigger reactive updates via Proxy system
- **Deep Reactivity**: Changes at any nesting level automatically update all bound templates
- **Cross-Component State**: Shared reactive state between pages, components, and templates
- **Event Integration**: Property changes can trigger custom events for component communication
- **Debug Support**: Built-in logging and monitoring for development and troubleshooting
- **`__bindTemplates(root)`** - Internal method for template binding (supports nested properties)

### Component Interface
```javascript
{
  template: "HTML string with {{bindings}}",
  init(store, bus, root) { /* initialization logic */ }
}
```

### Page Interface
```javascript
{
  template: "HTML string with {{bindings}} and components",
  async init(store, bus) { /* async initialization logic */ }
}
```

## Extension Points

### Custom Components
- Create specialized UI components
- Implement complex interactions
- Add third-party integrations

### Enhanced Routing
- Add route parameters
- Implement nested routes
- Add route guards/middleware

### State Management
- Add state persistence (localStorage)
- Implement state history/undo
- Add computed properties

### Developer Tools
- Add debugging components
- Implement development-only features
- Add performance monitoring

This framework provides a solid foundation for building small to medium-sized SPAs with modern JavaScript patterns while maintaining simplicity and avoiding external dependencies.
