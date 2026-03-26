# test-task-simple-book-catalog
https://test-task-simple-book-catalog.vercel.app/

# Task
https://drive.google.com/file/d/1RBRcuH-_oAvtjem5Xs0c4NXZ8I38aYyH/view


# File Structure
```
test-task-simple-book-catalog/
├── public/               # Static assets (e.g., favicon) served directly
├── src/
│   ├── css/              # Global CSS files
│   ├── icons/            # SVG icons (book.svg, heart.svg, search.svg)
│   ├── js/               # JavaScript source files
│   │   ├── api/          # API communication modules (searchBooks, getCoverById)
│   │   ├── modules/      # Feature modules
│   │   │   ├── book/     # Book-related rendering (catalogRenderer, favouritesRenderer, coverHandler ...)
│   │   │   ├── navbar/   # Navigation and search UI
│   │   │   ├── theme/    # Theme toggling logic
│   │   ├── store/        # State management (favourites, localStorage)
│   │   ├── utils/        # Utility functions (escapeHtml, waitForElement)
│   │   ├── initApp.js    # Application initializer
│   │   └── main.js       # Entry point
│   └── pages/            # HTML templates imported as raw strings (navbar, footer, card, etc.)
├── index.html            # Main HTML file
├── vite.config.js        # Vite configuration
├── package.json          # Dependencies and scripts
└── README.md             # This documentation
```

# How to run the app

1. Clone the repository:
   ```bash
   git clone git@github.com:CapitainFan/test-task-simple-book-catalog.git
   cd test-task-simple-book-catalog
2. Install dependencies:
   ```bash
   npm install
3. Run development server:
   ```bash
   npm run dev
   ```
   - The app will be available at http://localhost:5173

4. Build for production:
   ```bash
   npm run build
   ```
   - The output will be placed in the dist/ folder.

5. Preview production build:
    ```bash
   npm run preview
   ```