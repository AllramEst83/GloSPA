// gloSpa.js - A lightweight SPA framework with reactive state management
const GloSPA = (() => {
  
  /**
   * EventBus - Custom event system for component communication
   * Uses a hidden DOM element as the event target for native event handling
   */
  class EventBus {
    constructor() {
      // Use a detached DOM element as event target for native event handling
      this.target = document.createElement("span");
      // Store listeners that respond to any event (wildcard listeners)
      this.wildcardListeners = [];
    }
    
    /** Register event listener for specific event */
    on(event, cb) { this.target.addEventListener(event, cb); }
    
    /** Remove event listener for specific event */
    off(event, cb) { this.target.removeEventListener(event, cb); }
    
    /** Register one-time event listener that auto-removes after first trigger */
    once(event, cb) {
      const wrapper = (e) => { cb(e); this.off(event, wrapper); };
      this.on(event, wrapper);
    }
    
    /** Emit custom event with optional data payload */
    emit(event, detail = null) {
      const evt = new CustomEvent(event, { detail });
      this.target.dispatchEvent(evt);
      // Also notify wildcard listeners
      this.wildcardListeners.forEach((cb) => cb(event, detail));
    }
    
    /** Add wildcard listener that receives all events */
    onAny(cb) { this.wildcardListeners.push(cb); }
    
    /** Remove wildcard listener */
    offAny(cb) { this.wildcardListeners = this.wildcardListeners.filter(fn => fn !== cb); }
  }

  /**
   * createReactive - Creates a reactive state object with template binding
   * @param {Object} state - Initial state object
   * @returns {Proxy} - Reactive proxy that updates DOM when state changes
   */
  function createReactive(state) {
    // Track which DOM nodes are bound to which state properties
    const bindings = new Map();

    /**
     * Get nested property value using dot notation (e.g., "user.profile.name")
     * @param {Object} obj - Object to traverse
     * @param {string} path - Dot-separated property path
     * @returns {any} - Property value or undefined
     */
    function getNestedValue(obj, path) {
      return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    /**
     * Set nested property value using dot notation, creating objects as needed
     * @param {Object} obj - Object to modify
     * @param {string} path - Dot-separated property path
     * @param {any} value - Value to set
     */
    function setNestedValue(obj, path, value) {
      const keys = path.split('.');
      const lastKey = keys.pop();
      // Navigate/create nested objects
      const target = keys.reduce((current, key) => {
        if (!(key in current)) current[key] = {};
        return current[key];
      }, obj);
      target[lastKey] = value;
    }

    /**
     * Scan DOM for template bindings and register them for updates
     * Finds {{ property.path }} patterns in text nodes and tracks them
     * @param {Element} root - DOM element to scan (default: document)
     */
    function bindTemplates(root = document) {
      // Walk through all text nodes in the DOM tree
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const original = node.textContent;

        // Find all {{ property }} patterns in text content
        const matches = original.match(/{{\s*([\w.]+)\s*}}/g);
        if (matches) {
          matches.forEach((raw) => {
            // Extract property path from {{ path }}
            const key = raw.replace(/[{}]/g, "").trim();
            // Register this node as bound to this property
            if (!bindings.has(key)) bindings.set(key, []);
            bindings.get(key).push({ node, original });
            // Replace template with current value
            const value = getNestedValue(state, key);
            node.textContent = original.replace(raw, value ?? "");
          });
        }
      }
    }

    /**
     * Create a reactive proxy that automatically updates DOM when properties change
     * @param {Object} obj - Object to make reactive
     * @param {string} path - Current property path for nested objects
     * @returns {Proxy} - Reactive proxy object
     */
    function createNestedProxy(obj, path = '') {
      return new Proxy(obj, {
        set(target, key, value) {
          const fullPath = path ? `${path}.${key}` : key;
          
          // Set the value on the target object
          target[key] = value;
          
          // Update all DOM nodes bound to this specific property path
          if (bindings.has(fullPath)) {
            bindings.get(fullPath).forEach(({ node, original }) => {
              node.textContent = original.replace(/{{\s*([\w.]+)\s*}}/g, (_, k) => {
                return getNestedValue(state, k) ?? "";
              });
            });
          }
          
          // Update any bindings that use related property paths
          // This handles both parent and child property updates
          bindings.forEach((nodeList, bindingKey) => {
            if (bindingKey.startsWith(fullPath) || fullPath.startsWith(bindingKey.split('.')[0])) {
              nodeList.forEach(({ node, original }) => {
                node.textContent = original.replace(/{{\s*([\w.]+)\s*}}/g, (_, k) => {
                  return getNestedValue(state, k) ?? "";
                });
              });
            }
          });
          
          return true;
        },
        
        get(target, key) {
          const value = target[key];
          // If accessing a nested object, return a reactive proxy for it too
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            const fullPath = path ? `${path}.${key}` : key;
            return createNestedProxy(value, fullPath);
          }
          return value;
        }
      });
    }

    /**
     * Recursively make all nested objects in the state reactive
     * @param {Object} obj - Object to process
     * @param {string} path - Current path in the object tree
     */
    function makeReactive(obj, path = '') {
      for (const [key, value] of Object.entries(obj)) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          const fullPath = path ? `${path}.${key}` : key;
          obj[key] = createNestedProxy(value, fullPath);
          makeReactive(value, fullPath);
        }
      }
    }

    // Make the initial state object reactive
    makeReactive(state);
    
    // Create the main reactive proxy with additional utility methods
    const proxy = createNestedProxy(state);
    // Expose template binding function for manual re-binding
    proxy.__bindTemplates = bindTemplates;
    // Expose setter for programmatic state updates with proper reactivity
    proxy.__set = (path, value) => {
      setNestedValue(state, path, value);
      // Trigger reactivity by updating through the proxy
      const keys = path.split('.');
      let current = proxy;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
    };
    return proxy;
  }


  /**
   * Component registration and rendering system
   * Allows registering reusable UI components with templates and initialization logic
   */
  
  // Registry to store all registered components
  const components = {};
  
  /**
   * Register a new component with the framework
   * @param {string} name - Component name to use in data-component attribute
   * @param {Function} compFn - Function that returns component definition {template, init}
   */
  function registerComponent(name, compFn) {
    components[name] = compFn;
  }
  
  /**
   * Find and render all components in the given DOM tree
   * Looks for elements with data-component attribute and renders registered components
   * @param {Element} root - DOM element to search for components
   * @param {Proxy} store - Reactive state store to pass to components
   * @param {EventBus} bus - Event bus for component communication
   */
  function renderComponents(root, store, bus) {
    root.querySelectorAll("[data-component]").forEach((el) => {
      const name = el.getAttribute("data-component");
      const comp = components[name]?.(); // Execute component function to get definition
      if (!comp) return;
      
      // Inject component template into DOM element
      el.innerHTML = comp.template;
      // Bind any {{ }} templates in the component
      store.__bindTemplates(el);
      // Run component initialization if provided
      if (comp.init) comp.init(store, bus, el);
    });
  }

  /**
   * Single Page Application router with hash-based navigation and lazy loading
   * Supports both static page objects and dynamic import functions for code splitting
   * @param {Object} routes - Map of route names to page components or import functions
   * @param {Proxy} store - Reactive state store to pass to pages
   */
  async function initRouter(routes, store) {
    /**
     * Load and render the current route based on URL hash
     * Handles lazy loading, loading states, and page initialization
     */
    async function loadRoute() {
      // Get current route from URL hash, default to "home"
      const path = location.hash.slice(1) || "home";
      let comp = routes[path];

      // Show 404 if route not found
      if (!comp) {
        document.getElementById("app").innerHTML = "<h1>404</h1>";
        return;
      }

      // Display loading state while page loads
      document.getElementById("app").innerHTML = "<p>Loading...</p>";

      // Handle lazy loading - if route is a function, call it to get the module
      if (typeof comp === "function") {
        const mod = await comp(); // Dynamic import
        comp = mod.default; // Extract default export
      }

      // Render the page template
      document.getElementById("app").innerHTML = comp.template;
      // Bind reactive templates in the page
      store.__bindTemplates(document.getElementById("app"));
      // Render any components within the page
      renderComponents(document.getElementById("app"), store, GloSPA.bus);

      // Run page initialization if provided (supports async)
      if (comp.init) {
        await comp.init(store, GloSPA.bus);
      }
    }

    // Listen for hash changes to handle navigation
    window.addEventListener("hashchange", loadRoute);
    // Load initial route
    loadRoute();
  }

  /**
   * GloSPA - Main framework object with public API
   * Provides a complete SPA framework with reactive state, routing, and components
   */
  return {
    // Global event bus instance for cross-component communication
    bus: new EventBus(),
    
    // Create reactive state store with template binding
    createReactive,
    
    // Initialize hash-based router with lazy loading support
    initRouter,
    
    // Register reusable UI components
    registerComponent,
    
    // Check if a component is registered (useful for conditional rendering)
    hasComponent: (name) => !!components[name]
  };
})();

export default GloSPA;
