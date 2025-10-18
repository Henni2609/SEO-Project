import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Login from './Login';

interface SEOAnalysisResult {
  url: string;
  score: number;
  categories: {
    metaTags: CategoryScore;
    headings: CategoryScore;
    content: CategoryScore;
    technical: CategoryScore;
    images: CategoryScore;
    links: CategoryScore;
  };
  recommendations: Recommendation[];
  details: SEODetails;
}

interface CategoryScore {
  score: number;
  maxScore: number;
  issues: string[];
}

interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  category: string;
  issue: string;
  suggestion: string;
  impact: string;
}

interface SEODetails {
  title?: string;
  description?: string;
  keywords?: string;
  h1Count: number;
  h2Count: number;
  wordCount: number;
  imageCount: number;
  imagesWithoutAlt: number;
  internalLinks: number;
  externalLinks: number;
  hasHttps: boolean;
  loadTime?: number;
}

const API_URL = 'http://localhost:3001/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<SEOAnalysisResult | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_URL}/check-auth`, {
          withCredentials: true
        });
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (err) {
        console.error('Auth check failed:', err);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  const validateUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/analyze`, { url }, {
        withCredentials: true
      });
      setResult(response.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        setIsAuthenticated(false);
      } else {
        setError(err.response?.data?.error || 'Failed to analyze website. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setUrl('');
    setResult(null);
    setError('');
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, {
        withCredentials: true
      });
      setIsAuthenticated(false);
      setResult(null);
      setUrl('');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const getCategoryLabel = (key: string): string => {
    const labels: { [key: string]: string } = {
      metaTags: 'Meta Tags',
      headings: 'Headings',
      content: 'Content',
      technical: 'Technical SEO',
      images: 'Images',
      links: 'Links',
    };
    return labels[key] || key;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#84cc16'; // Light green
    if (score >= 40) return '#f59e0b'; // Orange
    if (score >= 20) return '#f97316'; // Dark orange
    return '#ef4444'; // Red
  };

  const toggleCard = (key: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const getCategoryTips = (key: string): string[] => {
    const tips: { [key: string]: string[] } = {
      metaTags: [
        'Keep title tags between 30-60 characters',
        'Meta descriptions should be 120-160 characters',
        'Include target keywords naturally',
        'Make titles unique and compelling',
        'Avoid keyword stuffing'
      ],
      headings: [
        'Use only one H1 tag per page',
        'H1 should describe the main topic',
        'Use H2-H6 to create content hierarchy',
        'Include keywords in headings naturally',
        'Keep headings descriptive and clear'
      ],
      content: [
        'Aim for at least 300 words of quality content',
        'Write for humans, not just search engines',
        'Use short paragraphs for readability',
        'Include relevant keywords naturally',
        'Update content regularly'
      ],
      technical: [
        'Always use HTTPS for security',
        'Add viewport meta tag for mobile',
        'Optimize page load speed',
        'Ensure mobile responsiveness',
        'Fix broken links and errors'
      ],
      images: [
        'Add descriptive alt text to all images',
        'Keep file sizes optimized',
        'Use appropriate image formats',
        'Include keywords in alt text when relevant',
        'Compress images without losing quality'
      ],
      links: [
        'Include 3-5 internal links per page',
        'Link to authoritative external sources',
        'Use descriptive anchor text',
        'Avoid excessive linking',
        'Check for broken links regularly'
      ]
    };
    return tips[key] || [];
  };

  if (authLoading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>SEO Analyzer</h1>
              <p>Analyze your website's SEO and get actionable recommendations</p>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </header>

        {!result && (
          <section className="input-section">
            <form onSubmit={handleAnalyze} className="input-form">
              <div className="input-wrapper">
                <label htmlFor="url">Website URL</label>
                <input
                  id="url"
                  type="text"
                  className={`url-input ${error ? 'error' : ''}`}
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                />
                {error && <div className="error-message">{error}</div>}
              </div>
              <button
                type="submit"
                className="analyze-btn"
                disabled={loading}
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </form>
          </section>
        )}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Analyzing your website...</p>
          </div>
        )}

        {result && !loading && (
          <section className="results">
            <div className="results-header">
              <h2>Analysis Results</h2>
              <button className="new-analysis-btn" onClick={handleNewAnalysis}>
                New Analysis
              </button>
            </div>

            <div className="url-display">Analyzed URL: {result.url}</div>

            <div className="score-section">
              <div className="score-circle">
                <svg className="score-ring" width="200" height="200">
                  <circle
                    className="score-ring-bg"
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="12"
                  />
                  <circle
                    className="score-ring-progress"
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke={getScoreColor(result.score)}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(result.score / 100) * 534} 534`}
                    transform="rotate(-90 100 100)"
                  />
                </svg>
                <div className="score-number">{result.score}</div>
              </div>
              <div className="score-label">Overall SEO Score</div>
            </div>

            <div className="categories-grid">
              {Object.entries(result.categories).map(([key, category], index) => {
                const isExpanded = expandedCards.has(key);
                const tips = getCategoryTips(key);

                return (
                  <div
                    key={key}
                    className={`category-card ${isExpanded ? 'expanded' : ''}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => toggleCard(key)}
                  >
                    <div className="category-header">
                      <span className="category-name">{getCategoryLabel(key)}</span>
                      <span className="category-score">
                        {category.score}/{category.maxScore}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(category.score / category.maxScore) * 100}%`,
                        }}
                      ></div>
                    </div>
                    {category.issues.length > 0 && (
                      <ul className="category-issues">
                        {category.issues.map((issue, idx) => (
                          <li key={idx}>{issue}</li>
                        ))}
                      </ul>
                    )}
                    {category.issues.length === 0 && (
                      <p style={{ fontSize: '14px', color: '#10b981', fontWeight: 600 }}>
                        Looking good!
                      </p>
                    )}

                    {isExpanded && tips.length > 0 && (
                      <div className="category-tips">
                        <h4>💡 Best Practices:</h4>
                        <ul>
                          {tips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="expand-indicator">
                      {isExpanded ? '▼ Click to collapse' : '▶ Click for tips'}
                    </div>
                  </div>
                );
              })}
            </div>

            {result.recommendations.length > 0 && (
              <div className="recommendations-section">
                <h3>Recommendations</h3>
                {result.recommendations.map((rec, idx) => (
                  <div key={idx} className={`recommendation-card ${rec.priority}`}>
                    <div className="recommendation-header">
                      <span className="recommendation-category">{rec.category}</span>
                      <span className={`priority-badge ${rec.priority}`}>
                        {rec.priority}
                      </span>
                    </div>
                    <div className="recommendation-issue">{rec.issue}</div>
                    <div className="recommendation-suggestion">{rec.suggestion}</div>
                    <div className="recommendation-impact">Impact: {rec.impact}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="details-section">
              <h3>Technical Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <div className="detail-label">Title Length</div>
                  <div className="detail-value">
                    {result.details.title?.length || 0} chars
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Description Length</div>
                  <div className="detail-value">
                    {result.details.description?.length || 0} chars
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Word Count</div>
                  <div className="detail-value">{result.details.wordCount}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">H1 Tags</div>
                  <div className="detail-value">{result.details.h1Count}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">H2 Tags</div>
                  <div className="detail-value">{result.details.h2Count}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Images</div>
                  <div className="detail-value">{result.details.imageCount}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Images w/o Alt</div>
                  <div className="detail-value">
                    {result.details.imagesWithoutAlt}
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Internal Links</div>
                  <div className="detail-value">{result.details.internalLinks}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">External Links</div>
                  <div className="detail-value">{result.details.externalLinks}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">HTTPS</div>
                  <div className="detail-value">
                    {result.details.hasHttps ? 'Yes' : 'No'}
                  </div>
                </div>
                {result.details.loadTime && (
                  <div className="detail-item">
                    <div className="detail-label">Load Time</div>
                    <div className="detail-value">{result.details.loadTime}ms</div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
