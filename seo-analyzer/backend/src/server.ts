import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import { SEOAnalyzer } from './analyzers/seoAnalyzer';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL format
    let validUrl: URL;
    try {
      validUrl = new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Fetch the webpage
    const startTime = Date.now();
    const response = await axios.get(validUrl.toString(), {
      headers: {
        'User-Agent': 'SEO-Analyzer-Bot/1.0 (Educational Purpose)',
      },
      timeout: 10000,
      maxRedirects: 5,
    });
    const loadTime = Date.now() - startTime;

    // Analyze the HTML
    const analyzer = new SEOAnalyzer(validUrl.toString(), response.data);
    const result = analyzer.analyze();

    // Add load time to result
    result.details.loadTime = loadTime;

    res.json(result);
  } catch (error: any) {
    console.error('Analysis error:', error.message);

    if (error.code === 'ENOTFOUND') {
      return res.status(404).json({ error: 'Website not found' });
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return res.status(408).json({ error: 'Request timeout - website took too long to respond' });
    }

    res.status(500).json({
      error: 'Failed to analyze website',
      message: error.message
    });
  }
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'SEO Analyzer API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
