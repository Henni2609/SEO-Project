import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  const handleTryIt = () => {
    navigate('/login');
  };

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="landing-container">
          <div className="nav-content">
            <div className="logo">
              <span className="logo-icon">📊</span>
              <span className="logo-text">SEO Analyzer</span>
            </div>
            <div className="nav-links">
              <a href="#features">Features</a>
              <a href="#benefits">Benefits</a>
              <button onClick={handleTryIt} className="nav-try-btn">Try it Now</button>
            </div>
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="landing-container">
          <div className="hero-content">
            <div className="hero-left">
              <div className="badge">
                <span className="badge-icon">🚀</span>
                <span>Professional SEO Analysis</span>
              </div>

              <h1 className="hero-title">
                Boost<sup>+</sup>
              </h1>

              <p className="hero-subtitle">
                Optimize Your Website's SEO Performance And Get Actionable Insights — Analyze In Seconds.
              </p>

              <div className="hero-rating">
                <div className="rating-avatar">
                  <div className="avatar-circle">📊</div>
                </div>
                <div className="rating-text">
                  <p>Comprehensive Analysis</p>
                  <div className="rating-stars">
                    <span>★ 4.9</span>
                    <span className="rating-satisfied">/ Fast & Accurate</span>
                  </div>
                </div>
              </div>

              <div className="hero-buttons">
                <button onClick={handleTryIt} className="primary-btn">
                  Try it
                </button>
                <button className="secondary-btn">
                  Our Pricing →
                </button>
              </div>
            </div>

            <div className="hero-right">
              <div className="hero-visual">
                <div className="visual-card card-1">
                  <div className="card-icon">✓</div>
                  <p>Meta Tags Optimized</p>
                </div>

                <div className="visual-card card-2">
                  <div className="card-icon">✓</div>
                  <p>Technical SEO Checked</p>
                </div>

                <div className="stats-card">
                  <p className="stats-label">— ANALYZE</p>
                  <h2 className="stats-number">100%</h2>
                  <p className="stats-text">Complete SEO Score</p>
                </div>

                <div className="product-card">
                  <div className="product-image">
                    <div className="play-button">📊</div>
                  </div>
                  <div className="product-info">
                    <h3>SEO Analysis</h3>
                    <p className="product-price">Free Tool</p>
                    <div className="product-rating">
                      <span>★ 4.9</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="brands-section">
        <div className="landing-container">
          <div className="brands-grid">
            <div className="brand-logo">Google SEO</div>
            <div className="brand-logo">Meta Tags</div>
            <div className="brand-logo">Analytics</div>
            <div className="brand-logo">PageSpeed</div>
            <div className="brand-logo">Schema.org</div>
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="landing-container">
          <h2 className="section-title">Powerful SEO Analysis Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Meta Tags Analysis</h3>
              <p>Get detailed insights on your title tags, meta descriptions, and keyword optimization.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Content Quality</h3>
              <p>Analyze heading structure, word count, and content quality metrics.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔗</div>
              <h3>Link Analysis</h3>
              <p>Review internal and external link structures for optimal SEO performance.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Technical SEO</h3>
              <p>Check HTTPS security, mobile responsiveness, and page speed metrics.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🖼️</div>
              <h3>Image Optimization</h3>
              <p>Identify images without alt text and get optimization recommendations.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Actionable Tips</h3>
              <p>Receive prioritized recommendations to improve your SEO score.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="cta-section">
        <div className="landing-container">
          <div className="cta-content">
            <h2>Ready to Boost Your SEO?</h2>
            <p>Start analyzing your website for free and get actionable insights in seconds.</p>
            <button onClick={handleTryIt} className="cta-button">
              Try it
            </button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-container">
          <p>&copy; 2025 SEO Analyzer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
