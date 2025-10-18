# SEO Analyzer - Quick Start Guide

## Overview

This SEO Analyzer is a full-stack web application that analyzes websites for SEO performance and provides actionable recommendations.

## What's Included

1. **Frontend** (React + TypeScript) - Port 5173
2. **Backend API** (Node.js + Express + TypeScript) - Port 5000
3. **Test Page Server** (Simple HTTP Server) - Port 8000

## Running the Application

### Option 1: Manual Start (Recommended for Development)

#### Terminal 1 - Test Page Server
```bash
cd /Users/hendrik/Code/SEO\ Analyzer\ Project/seo-analyzer
node test-server.js
```

#### Terminal 2 - Backend API
```bash
cd /Users/hendrik/Code/SEO\ Analyzer\ Project/seo-analyzer/backend
npm run dev
```

#### Terminal 3 - Frontend
```bash
cd /Users/hendrik/Code/SEO\ Analyzer\ Project/seo-analyzer/frontend
npm run dev
```

### Option 2: Quick Start Script
```bash
cd /Users/hendrik/Code/SEO\ Analyzer\ Project/seo-analyzer
./start-all.sh
```

## How to Use

1. **Open the application**: Navigate to `http://localhost:5173` in your browser

2. **Test with localhost**: Enter `http://localhost:8000` in the URL field and click "Analyze"

3. **Test with any website**: Enter any public website URL (e.g., `https://example.com`)

4. **View results**:
   - Overall SEO Score (0-100)
   - Category breakdowns (Meta Tags, Headings, Content, Technical, Images, Links)
   - Prioritized recommendations
   - Technical details

## Testing with the Included Test Page

The `test-page.html` file is a sample webpage designed to demonstrate the SEO analyzer's capabilities. It includes:

- Optimized meta tags
- Proper heading structure
- Quality content (300+ words)
- Images with alt tags
- Internal and external links
- Mobile viewport meta tag

Access it at: `http://localhost:8000/`

## Project Structure

```
seo-analyzer/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── App.tsx    # Main application component
│   │   ├── App.css    # Styling
│   │   └── index.css  # Global styles
│   └── package.json
│
├── backend/            # Node.js backend API
│   ├── src/
│   │   ├── server.ts           # Express server
│   │   ├── analyzers/
│   │   │   └── seoAnalyzer.ts  # SEO analysis logic
│   │   └── types/
│   │       └── index.ts        # TypeScript interfaces
│   └── package.json
│
├── test-page.html      # Sample page for testing
├── test-server.js      # Simple HTTP server for test page
├── start-all.sh        # Startup script
└── README.md           # Documentation
```

## API Endpoints

### `POST /api/analyze`
Analyzes a URL and returns SEO metrics.

**Request:**
```json
{
  "url": "http://localhost:8000"
}
```

**Response:**
```json
{
  "url": "http://localhost:8000",
  "score": 85,
  "categories": {...},
  "recommendations": [...],
  "details": {...}
}
```

### `GET /api/health`
Health check endpoint.

## Features Demonstrated

### Meta Tags Analysis
- Title tag presence and length (30-60 chars optimal)
- Meta description presence and length (120-160 chars optimal)
- Meta keywords (optional)

### Heading Structure
- H1 tag uniqueness (should have exactly one)
- H2-H6 tags for content hierarchy

### Content Quality
- Word count (minimum 300 words recommended)
- Content structure

### Technical SEO
- HTTPS usage
- Mobile viewport meta tag

### Image Optimization
- Alt tags on all images
- Image count

### Link Analysis
- Internal links (3-15 optimal)
- External links to authoritative sources

## Scoring System

- **Meta Tags**: 20 points
- **Headings**: 15 points
- **Content**: 20 points
- **Technical SEO**: 15 points
- **Images**: 15 points
- **Links**: 15 points

**Total**: 100 points

## Recommendations

The analyzer provides prioritized recommendations:
- **High Priority**: Critical issues affecting SEO
- **Medium Priority**: Important improvements
- **Low Priority**: Nice-to-have optimizations

## Troubleshooting

### Backend won't start
```bash
cd backend
npm install
npm run dev
```

### Frontend won't start
```bash
cd frontend
npm install
npm run dev
```

### Can't analyze localhost URLs
Make sure the test server is running on port 8000:
```bash
node test-server.js
```

### CORS errors
The backend is configured to accept requests from any origin for development.

## Next Steps

1. Try analyzing your own website
2. Compare scores between different pages
3. Implement recommended improvements
4. Re-analyze to see score improvements

## Production Deployment

For production deployment:

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Build the backend:
```bash
cd backend
npm run build
```

3. Serve the built files and configure environment variables accordingly.

## Support

For issues or questions, check the README.md file or review the source code in the respective directories.
