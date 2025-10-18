export interface SEOAnalysisResult {
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

export interface CategoryScore {
  score: number;
  maxScore: number;
  issues: string[];
}

export interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  category: string;
  issue: string;
  suggestion: string;
  impact: string;
}

export interface SEODetails {
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
  mobileOptimized?: boolean;
}
