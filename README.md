# GitHub Repository Search App

A modern, responsive web application for searching GitHub repositories using the GitHub Search API.

## Features

- **Search Repositories**: Search through millions of GitHub repositories
- **Pagination**: Navigate through search results with an intuitive pagination system
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Search**: Instant search results with loading states
- **Repository Details**: View key information including:
  - Repository name and owner
  - Description
  - Star count
  - Fork count
  - Primary programming language
  - Last update date

## Technologies Used

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe code
- **Vite**: Fast build tool and dev server
- **GitHub REST API**: Official GitHub Search API
- **CSS3**: Modern styling with gradients, animations, and responsive design

## Getting Started

### Prerequisites

- Node.js (version 20.19+ or 22.12+)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd github-search-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Usage

1. Enter a search term in the search box (e.g., "react", "typescript", "machine learning")
2. Click the "Search" button or press Enter
3. Browse through the results
4. Use the pagination controls at the bottom to navigate through pages
5. Click on any repository name or owner to visit their GitHub page

## API Information

This app uses the [GitHub Search API](https://docs.github.com/en/rest/reference/search) which allows:
- 60 requests per hour for unauthenticated requests
- 5,000 requests per hour for authenticated requests

Results are sorted by stars in descending order, showing the most popular repositories first.

## Project Structure

```
github-search-app/
├── src/
│   ├── App.tsx          # Main application component
│   ├── App.css          # Application styles
│   ├── types.ts         # TypeScript type definitions
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── package.json         # Project dependencies
└── vite.config.ts       # Vite configuration
```

## Features Implemented

### Search Functionality
- Real-time search with the GitHub API
- Error handling for failed requests
- Loading states during API calls
- Empty state when no results are found

### Pagination
- Page navigation with Previous/Next buttons
- Direct page number navigation
- Ellipsis for large page ranges
- Shows current page and total pages
- Smooth scroll to top on page change

### UI/UX
- Clean, modern design with gradient accents
- Hover effects on cards and buttons
- Responsive grid layout
- Dark/light mode support
- Loading spinner animation
- Error messages with clear feedback

## License

This project is open source and available under the MIT License.
