import * as cheerio from 'cheerio';
import { SEOAnalysisResult, CategoryScore, Recommendation, SEODetails } from '../types';

export class SEOAnalyzer {
  private $: cheerio.CheerioAPI;
  private url: string;
  private html: string;

  constructor(url: string, html: string) {
    this.url = url;
    this.html = html;
    this.$ = cheerio.load(html);
  }

  public analyze(): SEOAnalysisResult {
    const details = this.extractDetails();
    const categories = {
      metaTags: this.analyzeMetaTags(details),
      headings: this.analyzeHeadings(details),
      content: this.analyzeContent(details),
      technical: this.analyzeTechnical(details),
      images: this.analyzeImages(details),
      links: this.analyzeLinks(details),
    };

    const totalScore = this.calculateTotalScore(categories);
    const recommendations = this.generateRecommendations(categories, details);

    return {
      url: this.url,
      score: totalScore,
      categories,
      recommendations,
      details,
    };
  }

  private extractDetails(): SEODetails {
    const title = this.$('title').text();
    const description = this.$('meta[name="description"]').attr('content');
    const keywords = this.$('meta[name="keywords"]').attr('content');

    const h1Count = this.$('h1').length;
    const h2Count = this.$('h2').length;

    const bodyText = this.$('body').text();
    const wordCount = bodyText.split(/\s+/).filter(word => word.length > 0).length;

    const images = this.$('img');
    const imageCount = images.length;
    const imagesWithoutAlt = images.filter((_, el) => !this.$(el).attr('alt')).length;

    const links = this.$('a[href]');
    const internalLinks = links.filter((_, el) => {
      const href = this.$(el).attr('href') || '';
      return href.startsWith('/') || href.includes(new URL(this.url).hostname);
    }).length;
    const externalLinks = links.length - internalLinks;

    const hasHttps = this.url.startsWith('https://');

    return {
      title,
      description,
      keywords,
      h1Count,
      h2Count,
      wordCount,
      imageCount,
      imagesWithoutAlt,
      internalLinks,
      externalLinks,
      hasHttps,
    };
  }

  private analyzeMetaTags(details: SEODetails): CategoryScore {
    let score = 0;
    const maxScore = 20;
    const issues: string[] = [];

    // Title tag (8 points)
    if (details.title && details.title.length > 0) {
      if (details.title.length >= 30 && details.title.length <= 60) {
        score += 8;
      } else if (details.title.length > 0) {
        score += 4;
        if (details.title.length < 30) {
          issues.push('Title tag is too short (recommended: 30-60 characters)');
        } else {
          issues.push('Title tag is too long (recommended: 30-60 characters)');
        }
      }
    } else {
      issues.push('Missing title tag');
    }

    // Meta description (8 points)
    if (details.description && details.description.length > 0) {
      if (details.description.length >= 120 && details.description.length <= 160) {
        score += 8;
      } else if (details.description.length > 0) {
        score += 4;
        if (details.description.length < 120) {
          issues.push('Meta description is too short (recommended: 120-160 characters)');
        } else {
          issues.push('Meta description is too long (recommended: 120-160 characters)');
        }
      }
    } else {
      issues.push('Missing meta description');
    }

    // Meta keywords (4 points - less important now)
    if (details.keywords && details.keywords.length > 0) {
      score += 4;
    } else {
      issues.push('Missing meta keywords (optional but helpful)');
    }

    return { score, maxScore, issues };
  }

  private analyzeHeadings(details: SEODetails): CategoryScore {
    let score = 0;
    const maxScore = 15;
    const issues: string[] = [];

    // H1 tag (10 points)
    if (details.h1Count === 1) {
      score += 10;
    } else if (details.h1Count === 0) {
      issues.push('Missing H1 tag');
    } else {
      score += 5;
      issues.push(`Multiple H1 tags found (${details.h1Count}). Use only one H1 per page.`);
    }

    // H2 tags (5 points)
    if (details.h2Count >= 2 && details.h2Count <= 6) {
      score += 5;
    } else if (details.h2Count === 0) {
      issues.push('No H2 tags found. Use H2-H6 for content structure.');
    } else if (details.h2Count > 6) {
      score += 3;
      issues.push('Consider consolidating content - many H2 tags detected.');
    } else {
      score += 3;
    }

    return { score, maxScore, issues };
  }

  private analyzeContent(details: SEODetails): CategoryScore {
    let score = 0;
    const maxScore = 20;
    const issues: string[] = [];

    // Word count (20 points)
    if (details.wordCount >= 300 && details.wordCount <= 2500) {
      score += 20;
    } else if (details.wordCount >= 150 && details.wordCount < 300) {
      score += 10;
      issues.push('Content is short. Aim for at least 300 words for better SEO.');
    } else if (details.wordCount > 2500) {
      score += 15;
      issues.push('Very long content. Consider breaking into multiple pages.');
    } else {
      score += 5;
      issues.push('Insufficient content. Add more relevant text (minimum 300 words recommended).');
    }

    return { score, maxScore, issues };
  }

  private analyzeTechnical(details: SEODetails): CategoryScore {
    let score = 0;
    const maxScore = 15;
    const issues: string[] = [];

    // HTTPS (10 points)
    if (details.hasHttps) {
      score += 10;
    } else {
      issues.push('Site is not using HTTPS. Security is a ranking factor.');
    }

    // Mobile optimization check (5 points)
    const viewport = this.$('meta[name="viewport"]').attr('content');
    if (viewport) {
      score += 5;
    } else {
      issues.push('Missing viewport meta tag for mobile optimization.');
    }

    return { score, maxScore, issues };
  }

  private analyzeImages(details: SEODetails): CategoryScore {
    let score = 0;
    const maxScore = 15;
    const issues: string[] = [];

    if (details.imageCount === 0) {
      score += 10;
      issues.push('No images found. Consider adding relevant images for better engagement.');
    } else {
      // Alt tags (15 points)
      const altPercentage = ((details.imageCount - details.imagesWithoutAlt) / details.imageCount) * 100;

      if (altPercentage === 100) {
        score += 15;
      } else if (altPercentage >= 80) {
        score += 12;
        issues.push(`${details.imagesWithoutAlt} images missing alt tags.`);
      } else if (altPercentage >= 50) {
        score += 8;
        issues.push(`${details.imagesWithoutAlt} images missing alt tags. Add descriptive alt text.`);
      } else {
        score += 4;
        issues.push(`Most images (${details.imagesWithoutAlt}/${details.imageCount}) missing alt tags.`);
      }
    }

    return { score, maxScore, issues };
  }

  private analyzeLinks(details: SEODetails): CategoryScore {
    let score = 0;
    const maxScore = 15;
    const issues: string[] = [];

    // Internal links (8 points)
    if (details.internalLinks >= 3 && details.internalLinks <= 15) {
      score += 8;
    } else if (details.internalLinks === 0) {
      issues.push('No internal links found. Add links to other pages on your site.');
    } else if (details.internalLinks > 15) {
      score += 6;
      issues.push('Many internal links detected. Ensure they add value.');
    } else {
      score += 4;
      issues.push('Few internal links. Add more links to related content.');
    }

    // External links (7 points)
    if (details.externalLinks >= 1 && details.externalLinks <= 10) {
      score += 7;
    } else if (details.externalLinks === 0) {
      score += 5;
      issues.push('No external links. Consider linking to authoritative sources.');
    } else {
      score += 5;
      issues.push('Many external links. Ensure they are relevant and add value.');
    }

    return { score, maxScore, issues };
  }

  private calculateTotalScore(categories: any): number {
    const totalMax = Object.values(categories).reduce((sum: number, cat: any) => sum + cat.maxScore, 0);
    const totalScore = Object.values(categories).reduce((sum: number, cat: any) => sum + cat.score, 0);
    return Math.round((totalScore / totalMax) * 100);
  }

  private generateRecommendations(categories: any, details: SEODetails): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Analyze each category and generate recommendations
    if (categories.metaTags.score < categories.metaTags.maxScore * 0.7) {
      if (!details.title || details.title.length === 0) {
        recommendations.push({
          priority: 'high',
          category: 'Meta Tags',
          issue: 'Missing title tag',
          suggestion: 'Add a unique, descriptive title tag (30-60 characters) that includes your primary keyword',
          impact: 'Critical for search rankings and click-through rates',
        });
      } else if (details.title.length < 30 || details.title.length > 60) {
        recommendations.push({
          priority: 'high',
          category: 'Meta Tags',
          issue: 'Title tag length not optimal',
          suggestion: 'Adjust your title to 30-60 characters for optimal display in search results',
          impact: 'Improves click-through rate from search results',
        });
      }

      if (!details.description || details.description.length === 0) {
        recommendations.push({
          priority: 'high',
          category: 'Meta Tags',
          issue: 'Missing meta description',
          suggestion: 'Add a compelling meta description (120-160 characters) that includes target keywords',
          impact: 'Significantly affects click-through rates from search results',
        });
      }
    }

    if (categories.headings.score < categories.headings.maxScore * 0.7) {
      if (details.h1Count === 0) {
        recommendations.push({
          priority: 'high',
          category: 'Headings',
          issue: 'No H1 tag found',
          suggestion: 'Add exactly one H1 tag that clearly describes the page content',
          impact: 'H1 tags are crucial for SEO and page structure',
        });
      } else if (details.h1Count > 1) {
        recommendations.push({
          priority: 'medium',
          category: 'Headings',
          issue: 'Multiple H1 tags detected',
          suggestion: 'Use only one H1 tag per page and use H2-H6 for subheadings',
          impact: 'Improves content hierarchy and SEO',
        });
      }

      if (details.h2Count === 0) {
        recommendations.push({
          priority: 'medium',
          category: 'Headings',
          issue: 'No H2 tags found',
          suggestion: 'Add H2-H6 tags to structure your content into logical sections',
          impact: 'Improves readability and helps search engines understand content structure',
        });
      }
    }

    if (categories.content.score < categories.content.maxScore * 0.7) {
      if (details.wordCount < 300) {
        recommendations.push({
          priority: 'high',
          category: 'Content',
          issue: 'Insufficient content',
          suggestion: 'Expand your content to at least 300-500 words with relevant, valuable information',
          impact: 'More content gives search engines more context and ranking opportunities',
        });
      }
    }

    if (categories.technical.score < categories.technical.maxScore * 0.7) {
      if (!details.hasHttps) {
        recommendations.push({
          priority: 'high',
          category: 'Technical',
          issue: 'Not using HTTPS',
          suggestion: 'Install an SSL certificate to enable HTTPS',
          impact: 'Security is a confirmed Google ranking factor',
        });
      }
    }

    if (categories.images.score < categories.images.maxScore * 0.7) {
      if (details.imagesWithoutAlt > 0) {
        recommendations.push({
          priority: 'medium',
          category: 'Images',
          issue: `${details.imagesWithoutAlt} images missing alt text`,
          suggestion: 'Add descriptive alt text to all images for accessibility and SEO',
          impact: 'Helps search engines understand image content and improves accessibility',
        });
      }
    }

    if (categories.links.score < categories.links.maxScore * 0.7) {
      if (details.internalLinks < 3) {
        recommendations.push({
          priority: 'medium',
          category: 'Links',
          issue: 'Few internal links',
          suggestion: 'Add 3-5 internal links to related pages on your site',
          impact: 'Helps with site navigation and distributes page authority',
        });
      }
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }
}
