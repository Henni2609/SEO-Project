import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import session from 'express-session';
import bcrypt from 'bcrypt';
import { SEOAnalyzer } from './analyzers/seoAnalyzer';

const app = express();
const PORT = process.env.PORT || 3001;

// Extend session data
declare module 'express-session' {
  interface SessionData {
    isAuthenticated: boolean;
  }
}

// Password hash (for password "12345")
// In production, this should be stored in a database
const PASSWORD_HASH = '$2b$10$2xM0Su7MSi5S434fmXyp0.fQJAn817SWmYPaC/yP/y82Tm3KNXFH6';

// Session configuration
app.use(session({
  secret: 'seo-analyzer-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

// Authentication middleware
const requireAuth = (req: Request, res: Response, next: Function) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
};

// Login endpoint
app.post('/api/login', async (req: Request, res: Response) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Compare password with hash
    const isValid = await bcrypt.compare(password, PASSWORD_HASH);

    if (isValid) {
      req.session.isAuthenticated = true;
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Check authentication status
app.get('/api/check-auth', (req: Request, res: Response) => {
  res.json({ isAuthenticated: !!req.session.isAuthenticated });
});

// Logout endpoint
app.post('/api/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logout successful' });
  });
});

app.post('/api/analyze', requireAuth, async (req: Request, res: Response) => {
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
