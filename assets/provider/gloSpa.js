// gloSpa.js
const GloSPA = (() => {
  // --- EventBus ---
  class EventBus {
    constructor() {
      this.target = document.createElement("span");
      this.wildcardListeners = [];
    }
    on(event, cb) { this.target.addEventListener(event, cb); }
    off(event, cb) { this.target.removeEventListener(event, cb); }
    once(event, cb) {
      const wrapper = (e) => { cb(e); this.off(event, wrapper); };
      this.on(event, wrapper);
    }
    emit(event, detail = null) {
      const evt = new CustomEvent(event, { detail });
      this.target.dispatchEvent(evt);
      this.wildcardListeners.forEach((cb) => cb(event, detail));
    }
    onAny(cb) { this.wildcardListeners.push(cb); }
    offAny(cb) { this.wildcardListeners = this.wildcardListeners.filter(fn => fn !== cb); }
  }

  // --- Reactive store + tiny templating ---
  function createReactive(state) {
    const bindings = new Map();

    // Helper function to get nested property value
    function getNestedValue(obj, path) {
      return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    // Helper function to set nested property value
    function setNestedValue(obj, path, value) {
      const keys = path.split('.');
      const lastKey = keys.pop();
      const target = keys.reduce((current, key) => {
        if (!(key in current)) current[key] = {};
        return current[key];
      }, obj);
      target[lastKey] = value;
    }

    function bindTemplates(root = document) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const original = node.textContent;

        const matches = original.match(/{{\s*([\w.]+)\s*}}/g);
        if (matches) {
          matches.forEach((raw) => {
            const key = raw.replace(/[{}]/g, "").trim();
            if (!bindings.has(key)) bindings.set(key, []);
            bindings.get(key).push({ node, original });
            const value = getNestedValue(state, key);
            node.textContent = original.replace(raw, value ?? "");
          });
        }
      }
    }

    // Function to create reactive proxy for nested objects
    function createNestedProxy(obj, path = '') {
      return new Proxy(obj, {
        set(target, key, value) {
          const fullPath = path ? `${path}.${key}` : key;
          
          // Set the value
          target[key] = value;
          
          // Update bindings for this specific path
          if (bindings.has(fullPath)) {
            bindings.get(fullPath).forEach(({ node, original }) => {
              node.textContent = original.replace(/{{\s*([\w.]+)\s*}}/g, (_, k) => {
                return getNestedValue(state, k) ?? "";
              });
            });
          }
          
          // Also update any bindings that use parent paths
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
          // If the value is an object, return a reactive proxy for it
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            const fullPath = path ? `${path}.${key}` : key;
            return createNestedProxy(value, fullPath);
          }
          return value;
        }
      });
    }

    // Initialize nested objects as reactive
    function makeReactive(obj, path = '') {
      for (const [key, value] of Object.entries(obj)) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          const fullPath = path ? `${path}.${key}` : key;
          obj[key] = createNestedProxy(value, fullPath);
          makeReactive(value, fullPath);
        }
      }
    }

    // Make initial state reactive
    makeReactive(state);
    
    const proxy = createNestedProxy(state);
    proxy.__bindTemplates = bindTemplates;
    return proxy;
  }


  // --- Component system ---
  const components = {};
  function registerComponent(name, compFn) {
    components[name] = compFn;
  }
  function renderComponents(root, store, bus) {
    root.querySelectorAll("[data-component]").forEach((el) => {
      const name = el.getAttribute("data-component");
      const comp = components[name]?.();
      if (!comp) return;
      el.innerHTML = comp.template;
      store.__bindTemplates(el);
      if (comp.init) comp.init(store, bus, el);
    });
  }

  // --- Router with lazy & loading ---
  async function initRouter(routes, store) {
    async function loadRoute() {
      const path = location.hash.slice(1) || "home";
      let comp = routes[path];

      if (!comp) {
        document.getElementById("app").innerHTML = "<h1>404</h1>";
        return;
      }

      // Show loading state
      document.getElementById("app").innerHTML = "<p>Loading...</p>";

      // Lazy load if comp is a function
      if (typeof comp === "function") {
        const mod = await comp();
        comp = mod.default;
      }

      // Render page
      document.getElementById("app").innerHTML = comp.template;
      store.__bindTemplates(document.getElementById("app"));
      renderComponents(document.getElementById("app"), store, GloSPA.bus);

      if (comp.init) {
        await comp.init(store, GloSPA.bus); // allow async init
      }
    }

    window.addEventListener("hashchange", loadRoute);
    loadRoute();
  }

  return {
    bus: new EventBus(),
    createReactive,
    initRouter,
    registerComponent,
    hasComponent: (name) => !!components[name]
  };
})();

export default GloSPA;
