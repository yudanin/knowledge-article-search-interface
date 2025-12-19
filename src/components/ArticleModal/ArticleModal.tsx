/**
 * ArticleModal Component
 * Full article detail view in a modal/side panel
 */

import React, { useEffect, useCallback } from 'react';
import { Article } from '../../types';
import { formatDate } from '../../utils';
import styles from './ArticleModal.module.css';

interface ArticleModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  isOpen,
  onClose,
}) => {
  // Handle escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !article) return null;

  // Parse content sections (simple markdown-like parsing)
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      if (!trimmed) {
        elements.push(<br key={index} />);
      } else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        // Bold heading
        elements.push(
          <h4 key={index} className={styles.sectionHeading}>
            {trimmed.slice(2, -2)}
          </h4>
        );
      } else if (trimmed.startsWith('- ')) {
        // List item
        elements.push(
          <li key={index} className={styles.listItem}>
            {trimmed.slice(2)}
          </li>
        );
      } else {
        // Regular paragraph
        elements.push(
          <p key={index} className={styles.paragraph}>
            {trimmed}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      {/* Side Panel */}
      <div 
        className={styles.panel} 
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* Header */}
        <div className={styles.header}>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Close article"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          
          <div className={styles.headerMeta}>
            <span className={styles.category}>{article.category}</span>
            <span className={styles.divider}>•</span>
            <span className={styles.date}>Updated {formatDate(article.lastUpdated)}</span>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <h2 className={styles.title}>{article.title}</h2>
          
          {/* Tags */}
          <div className={styles.tags}>
            {article.tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>

          {/* Article body */}
          <div className={styles.body}>
            {renderContent(article.content)}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.stats}>
            <span className={styles.stat}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {article.viewCount.toLocaleString()} views
            </span>
            <span className={styles.stat}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Created {formatDate(article.createdDate)}
            </span>
          </div>
          
          <div className={styles.actions}>
            <button className={styles.actionButton}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit
            </button>
            <button className={styles.actionButton}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
