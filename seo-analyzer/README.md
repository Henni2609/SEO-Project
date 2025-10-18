# SEO Analyzer

A comprehensive web-based SEO analysis tool that evaluates website performance and provides actionable recommendations for improving search engine rankings.

## Features

- **Instant SEO Scoring**: Get a 0-100 score based on multiple SEO factors
- **Detailed Analysis**: Comprehensive evaluation across 6 key categories:
  - Meta Tags (title, description, keywords)
  - Heading Structure (H1-H6 hierarchy)
  - Content Quality (word count, readability)
  - Technical SEO (HTTPS, mobile optimization)
  - Image Optimization (alt tags, counts)
  - Link Analysis (internal/external links)
- **Actionable Recommendations**: Prioritized list of improvements with impact assessment
- **Beautiful UI**: Clean, modern interface with gradient design
- **Technical Details**: In-depth metrics and statistics

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Axios for API calls
- CSS3 with gradient designs

### Backend
- Node.js with Express
- TypeScript
- Cheerio for HTML parsing
- Axios for web scraping

## Installation

### Prerequisites
- Node.js 16+ and npm installed

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The backend API will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Enter a website URL (e.g., `https://example.com`)
3. Click "Analyze" button
4. View your comprehensive SEO analysis results including:
   - Overall SEO score
   - Category-specific scores and issues
   - Prioritized recommendations
   - Technical details and metrics

## API Endpoints

### `POST /api/analyze`
Analyzes a given URL and returns SEO metrics.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "score": 75,
  "categories": {
    "metaTags": { "score": 16, "maxScore": 20, "issues": [] },
    "headings": { "score": 15, "maxScore": 15, "issues": [] },
    ...
  },
  "recommendations": [...],
  "details": {...}
}
```

### `GET /api/health`
Health check endpoint.

## SEO Scoring Algorithm

The scoring algorithm evaluates multiple factors:

- **Meta Tags (20 points)**: Title tag length and quality, meta description, keywords
- **Headings (15 points)**: H1 tag presence and uniqueness, H2-H6 structure
- **Content (20 points)**: Word count, content quality
- **Technical SEO (15 points)**: HTTPS usage, mobile viewport
- **Images (15 points)**: Alt tag coverage, image optimization
- **Links (15 points)**: Internal and external link balance

Total possible score: 100 points

## Future Enhancements

- PDF export functionality
- Historical tracking over time
- Keyword density analysis
- Competitor comparison
- Backlink analysis
- Page speed insights
- Bulk URL analysis
- Custom scoring weights

## License

MIT License

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
