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

- Component-based architecture
- Client-side routing
- Reactive data binding
- Lightweight and fast
- No external dependencies
- Works with vanilla JavaScript

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
├── index.html          # Main entry point
├── assets/
│   ├── css/
│   │   └── site.css    # Styling
│   ├── js/
│   │   └── site.js     # Main application logic
│   └── provider/
│       └── gloSpa.js   # Core framework code
├── components/         # Reusable components
│   ├── Counter.js
│   └── UserCard.js
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

## NPM Installation

You can also install GloSPA via npm:

```bash
npm install glospa
```

Then import it in your project:

```javascript
import GloSPA from 'glospa';
```

## Why GloSPA?

Because sometimes you just want to build something without dealing with:
- Complex build pipelines
- Package.json dependency hell
- Framework-specific syntax and patterns
- Hours of configuration before writing your first line of actual code

GloSPA lets you focus on what matters: building your application.

---

*"Simplicity is the ultimate sophistication." - Leonardo da Vinci*