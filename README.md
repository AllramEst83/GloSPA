# GloSPA

**Glorified Single Page Application**

GloSPA is a lightweight Single Page Application (SPA) framework created as a refreshing alternative to the overly complicated modern frontend frameworks. Sometimes simplicity is the best solution.

## What is GloSPA?

GloSPA stands for "Glorified Single Page Application" - which is my way of saying that modern frontend frameworks have become way too complicated. Instead of wrestling with complex build tools, intricate state management, and endless configuration files, GloSPA provides a straightforward approach to building SPAs.

## Philosophy

Modern web development has become unnecessarily complex. GloSPA embraces simplicity by:

- **No Build Process**: Works directly in the browser without compilation steps
- **Minimal Dependencies**: Lightweight and focused on core functionality
- **Easy to Understand**: Clear, readable code that doesn't require extensive documentation to comprehend
- **Quick Setup**: Get started immediately without complicated project scaffolding

## Features

- **🧩 Component-based architecture** - Reusable UI components with templates and initialization
- **🛣️ Client-side routing** - Hash-based navigation with lazy loading support
- **🔐 Route Guards & RBAC** - Comprehensive authentication and role-based access control
- **⚡ Reactive data binding** - Automatic DOM updates when state changes with nested object support
- **📡 Event Bus** - Cross-component communication with wildcard listeners
- **🪶 Lightweight and fast** - ~3KB minified, minimal overhead
- **🚫 No external dependencies** - Pure vanilla JavaScript
- **🔧 No build process required** - Works directly in browsers
- **📦 CDN ready** - Available via jsDelivr for instant use
- **🎯 TypeScript friendly** - Works great with TypeScript projects

## Getting Started

### Option 1: Using jsDelivr CDN (Recommended)

Add GloSPA to your HTML file using the jsDelivr CDN:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My GloSPA App</title>
</head>
<body>
    <div id="app"></div>
    
    <!-- Include GloSPA from jsDelivr CDN -->
    <script type="module">
        import GloSPA from 'https://cdn.jsdelivr.net/npm/glospa@latest/assets/provider/gloSpa.min.js';
        
        // Create reactive state
        const store = GloSPA.createReactive({
            message: "Hello from GloSPA!"
        });
        
        // Initialize your app
        document.getElementById('app').innerHTML = '<h1>{{ message }}</h1>';
        store.__bindTemplates();
    </script>
</body>
</html>
```

### Option 2: Download and Self-Host

1. Clone or download this repository
2. Open `index.html` in your browser
3. Start building your application

That's it! No npm install, no webpack configuration, no babel setup - just open and code.

## Project Structure

```
GloSPA/
├── index.html                    # Main entry point
├── package.json                  # NPM package configuration
├── README.md                     # Documentation
├── NPM_RELEASE_GUIDE.md         # Release instructions
├── assets/
│   ├── css/
│   │   └── site.css             # Styling
│   ├── js/
│   │   └── site.js              # Main application logic
│   └── provider/
│       ├── gloSpa.js            # Core framework (development)
│       └── gloSpa.min.js        # Core framework (production)
├── components/                   # Reusable components
│   ├── Counter.js
│   └── UserCard.js
├── pages/                       # Page components
│   ├── AboutPage.js
│   └── HomePage.js
├── cdn-test.html                # CDN usage test
├── test-nested.html             # Nested reactive state test
├── debug-reactive.html          # Debugging reactive state test
└── route-rbac-guard-demo        # RBAC demo with multiple users
```
└── pages/             # Page components
    ├── AboutPage.js
    └── HomePage.js
```

## CDN Usage Examples

### Basic Setup
```html
<script type="module">
import GloSPA from 'https://cdn.jsdelivr.net/npm/glospa@latest/assets/provider/gloSpa.min.js';

const store = GloSPA.createReactive({ count: 0 });
document.body.innerHTML = '<button onclick="store.count++">{{ count }}</button>';
store.__bindTemplates();
</script>
```

### With Components
```html
<script type="module">
import GloSPA from 'https://cdn.jsdelivr.net/npm/glospa@latest/assets/provider/gloSpa.min.js';

// Register a component
GloSPA.registerComponent('counter', () => ({
  template: '<button onclick="store.count++">Count: {{ count }}</button>',
  init(store, bus, el) {
    console.log('Counter component initialized');
  }
}));

const store = GloSPA.createReactive({ count: 0 });
document.body.innerHTML = '<div data-component="counter"></div>';
store.__bindTemplates();
</script>
```

### With Routing
```html
<script type="module">
import GloSPA from 'https://cdn.jsdelivr.net/npm/glospa@latest/assets/provider/gloSpa.min.js';

const routes = {
  home: { template: '<h1>Home Page</h1>' },
  about: { template: '<h1>About Page</h1>' }
};

const store = GloSPA.createReactive({});
GloSPA.initRouter(routes, store);
</script>
```

### With Route Guards (Authentication)
```html
<script type="module">
import GloSPA from 'https://cdn.jsdelivr.net/npm/glospa@latest/assets/provider/gloSpa.min.js';

const store = GloSPA.createReactive({
  user: { isLoggedIn: false }
});

// Authentication guard function
function authGuard(store, bus) {
  return store.user.isLoggedIn;
}

const routes = {
  home: { template: '<h1>Home (Public)</h1>' },
  login: { template: '<h1>Login Page</h1>' },
  dashboard: { template: '<h1>Protected Dashboard</h1>' }
};

// Initialize router with guards
GloSPA.initRouter(routes, store, {
  authGuard: authGuard,
  loginRoute: 'login',
  publicRoutes: ['home', 'login']
});
</script>
```

### With RBAC (Role-Based Access Control)
```html
<script type="module">
import GloSPA from 'https://cdn.jsdelivr.net/npm/glospa@latest/assets/provider/gloSpa.min.js';

const store = GloSPA.createReactive({
  user: { 
    isLoggedIn: false,
    roles: ['user', 'manager'] // User's roles
  }
});

// Authentication check
function authGuard(store, bus) {
  return store.user.isLoggedIn;
}

// Role provider
function roleGuard(store, bus) {
  return store.user.roles || [];
}

// Define which roles can access which routes
const routeRoles = {
  'dashboard': ['user'],              // Requires 'user' role
  'admin': ['admin'],                 // Requires 'admin' role  
  'reports': ['manager', 'admin']     // Requires 'manager' OR 'admin'
};

const routes = {
  home: { template: '<h1>Home</h1>' },
  login: { template: '<h1>Login</h1>' },
  dashboard: { template: '<h1>User Dashboard</h1>' },
  admin: { template: '<h1>Admin Panel</h1>' },
  reports: { template: '<h1>Reports</h1>' },
  unauthorized: { template: '<h1>Access Denied</h1>' }
};

// Initialize router with RBAC
GloSPA.initRouter(routes, store, {
  authGuard: authGuard,
  roleGuard: roleGuard,
  routeRoles: routeRoles,
  loginRoute: 'login',
  unauthorizedRoute: 'unauthorized',
  publicRoutes: ['home', 'login', 'unauthorized']
});
</script>
```

## NPM Installation

You can also install GloSPA via npm:

```bash
npm install glospa
```

Then import it in your project:

```javascript
import GloSPA from 'glospa';
```

## 🎮 Demo Files

GloSPA comes with several demo files to help you understand and test the features:

### **🧪 `cdn-test.html`**
Basic CDN integration test with reactive state, components, and event bus examples.

### **🔐 `route-guards-demo.html`** 
Authentication demo showing:
- Login/logout functionality
- Protected and public routes
- Automatic redirects after login
- Route guard event handling

### **👥 `rbac-demo.html`** 
Comprehensive RBAC demo featuring:
- **5 different user types** with varying role combinations
- **6 protected routes** with different role requirements
- **Real-time role-based access control**
- **Interactive user switching** for testing

**Test Users:**
- 👨‍💼 **John Admin** - `admin`, `manager`, `user` (full access)
- 👩‍💼 **Jane Manager** - `manager`, `user` (no admin access)  
- 👤 **Bob User** - `user` only (limited access)
- 💳 **Alice Billing** - `billing`, `user` (billing + basic access)
- 👻 **Guest** - no roles (very limited access)

Simply open any demo file in your browser to see GloSPA in action!

## Route Guards & RBAC

GloSPA includes built-in route guards for authentication and comprehensive Role-Based Access Control (RBAC).

### Basic Route Protection

```javascript
// Define an authentication check function
function authGuard(store, bus) {
  // Return true if user is authenticated, false otherwise
  return store.user.isLoggedIn && store.user.token;
}

// Initialize router with guards
GloSPA.initRouter(routes, store, {
  authGuard: authGuard,           // Function to check authentication
  loginRoute: 'login',            // Route to redirect to when auth fails
  publicRoutes: ['home', 'login'] // Routes that don't require auth
});
```

### Role-Based Access Control (RBAC)

```javascript
// Role provider function - returns user's roles
function roleGuard(store, bus) {
  return store.user.roles || []; // Return array of user's roles
}

// Define role requirements for routes
const routeRoles = {
  'dashboard': ['user'],                    // Requires 'user' role
  'admin': ['admin'],                       // Requires 'admin' role
  'reports': ['manager', 'admin'],          // Requires 'manager' OR 'admin'
  'billing': ['billing', 'admin']           // Requires 'billing' OR 'admin'
};

// Initialize router with RBAC
GloSPA.initRouter(routes, store, {
  authGuard: authGuard,
  roleGuard: roleGuard,
  routeRoles: routeRoles,
  loginRoute: 'login',
  unauthorizedRoute: 'unauthorized',        // Redirect when roles insufficient
  publicRoutes: ['home', 'login', 'unauthorized']
});
```

### RBAC Utility Functions

After initializing the router, use these functions to check permissions:

```javascript
// Check if user has specific role
const hasAdmin = await GloSPA.rbac.hasRole('admin');

// Check if user has any of the specified roles
const hasAccess = await GloSPA.rbac.hasAnyRole(['manager', 'admin']);

// Check if user has all specified roles
const hasAllRoles = await GloSPA.rbac.hasAllRoles(['user', 'verified']);

// Check if user can access a specific route
const canAccessAdmin = await GloSPA.rbac.canAccess('admin');

// Get current user's roles
const userRoles = await GloSPA.rbac.getUserRoles();
```

### Advanced Authentication Guard

```javascript
// More sophisticated auth guard with API validation
async function authGuard(store, bus) {
  if (!store.user.token) return false;
  
  try {
    // Validate token with backend API
    const response = await fetch('/api/validate-token', {
      headers: { 'Authorization': `Bearer ${store.user.token}` }
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}
```

### RBAC Events

Listen for RBAC events to handle access control flows:

```javascript
// Listen for login required events
GloSPA.bus.on('login-required', (e) => {
  console.log(`Login required to access: ${e.detail.intendedRoute}`);
});

// Listen for access denied events (insufficient roles)
GloSPA.bus.on('access-denied', (e) => {
  console.log(`Access denied to ${e.detail.route}`);
  console.log(`User roles: ${e.detail.userRoles}`);
  console.log(`Required roles: ${e.detail.requiredRoles}`);
});

// Listen for successful login to redirect
GloSPA.bus.on('login-success', () => {
  console.log('Login successful, redirecting...');
});
```

### Navigation Methods

```javascript
// Programmatic navigation
GloSPA.navigateTo('dashboard');

// Navigate to originally intended route (after login)
GloSPA.navigateToIntended();
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `authGuard` | Function | `() => true` | Function that returns true if authenticated |
| `roleGuard` | Function | `() => []` | Function that returns array of user roles |
| `routeRoles` | Object | `{}` | Map of route names to required roles array |
| `loginRoute` | String | `"login"` | Route to redirect to when auth fails |
| `unauthorizedRoute` | String | `"unauthorized"` | Route to redirect to when roles insufficient |
| `publicRoutes` | Array | `["login", "home", "unauthorized"]` | Routes that don't require authentication |

### Complete RBAC Example

See `rbac-demo.html` for a complete working example with:
- Multiple user types with different roles
- Protected routes with various role requirements  
- Real-time permission checking
- Access denied handling
- RBAC utility function demonstrations

## 🚀 Quick Start

1. **Try the demos**: Open `rbac-demo.html` in your browser
2. **Use via CDN**: Copy the CDN example above into an HTML file
3. **Install via NPM**: `npm install glospa` for project integration
4. **Clone repository**: Download for full examples and source code

## 📖 Documentation

- **Route Guards**: See `route-guards-demo.html` for authentication examples
- **RBAC**: See `rbac-demo.html` for role-based access control
- **Components**: Check `/components` folder for reusable component examples
- **Release Guide**: See `NPM_RELEASE_GUIDE.md` for publishing instructions

## 🌐 CDN Links

- **Latest**: `https://cdn.jsdelivr.net/npm/glospa@latest/assets/provider/gloSpa.min.js`
- **Specific version**: `https://cdn.jsdelivr.net/npm/glospa@1.0.0/assets/provider/gloSpa.min.js`
- **Development**: `https://cdn.jsdelivr.net/npm/glospa@latest/assets/provider/gloSpa.js`

## Why GloSPA?

Because sometimes you just want to build something without dealing with:
- Complex build pipelines
- Package.json dependency hell  
- Framework-specific syntax and patterns
- Hours of configuration before writing your first line of actual code

GloSPA lets you focus on what matters: **building your application**.

## 📊 Stats

- **Size**: ~3KB minified
- **Dependencies**: Zero
- **Browser Support**: Modern browsers (ES6+)
- **License**: MIT

---

*"Simplicity is the ultimate sophistication." - Leonardo da Vinci*