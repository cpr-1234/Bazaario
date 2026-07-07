Bazaario 

A product listing + shopping cart demo built with plain HTML, CSS, and JavaScript — no frameworks, no build step, no dependencies. 


Features


Live search across 15 products
Category filtering (Audio, Wearables, Computing, Smart Home, Photography)
Add to cart, adjust quantity, remove items — all reflected instantly
Slide-out cart drawer with subtotal, delivery fee, and total
Fully responsive, works down to mobile
Visible keyboard focus states, respects prefers-reduced-motion


Tech stack


HTML5
CSS3 (custom properties, no framework)
Vanilla JavaScript (ES6+, no libraries)
Fonts: Space Grotesk, Inter, JetBrains Mono (Google Fonts)


Project structure

Bazaario/
├── index.html    # Markup
├── style.css     # Styling
├── script.js     # Product data, cart logic, rendering
└── README.md

Running locally

No build step needed. Either:


Open index.html directly in a browser, or
Serve it locally for a cleaner experience:


bash   python3 -m http.server 8000

