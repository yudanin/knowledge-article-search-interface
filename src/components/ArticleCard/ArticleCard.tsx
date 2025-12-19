/**
 * ArticleCard Component
 * Displays article preview in search results
 */

import React, { memo } from 'react';
import { Article } from '../../types';
import { formatDate, truncateText, getRelevanceLabel } from '../../utils';
import styles from './ArticleCard.module.css';

interface ArticleCardProps {
  article: Article;
  onClick: (article: Article) => void;
  searchQuery?: string;
}

// Highlight matching text in title/content
const highlightText = (text: string, query: string): React.ReactNode => {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, i) => 
    regex.test(part) ? (
      <mark key={i} className={styles.highlight}>{part}</mark>
    ) : (
      part
    )
  );
};

export const ArticleCard: React.FC<ArticleCardProps> = memo(({ 
  article, 
  onClick, 
  searchQuery = '' 
}) => {
  const relevanceLabel = getRelevanceLabel(article.relevanceScore);
  const previewText = truncateText(article.content, 200);

  return (
    <article 
      className={styles.card}
      onClick={() => onClick(article)}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(article)}
      role="button"
      aria-label={`View article: ${article.title}`}
    >
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.category}>{article.category}</span>
        <span className={`${styles.relevance} ${styles[relevanceLabel.toLowerCase()]}`}>
          {Math.round(article.relevanceScore * 100)}% match
        </span>
      </div>

      {/* Title */}
      <h3 className={styles.title}>
        {highlightText(article.title, searchQuery)}
      </h3>

      {/* Preview */}
      <p className={styles.preview}>
        {highlightText(previewText, searchQuery)}
      </p>

      {/* Tags */}
      <div className={styles.tags}>
        {article.tags.slice(0, 4).map(tag => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
        {article.tags.length > 4 && (
          <span className={styles.tagMore}>+{article.tags.length - 4}</span>
        )}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <span className={styles.date}>
          Updated {formatDate(article.lastUpdated)}
        </span>
        <span className={styles.views}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {article.viewCount.toLocaleString()} views
        </span>
      </div>
    </article>
  );
});

ArticleCard.displayName = 'ArticleCard';
