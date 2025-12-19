/**
 * Loading and Error State Components
 */

import React from 'react';
import styles from './StateComponents.module.css';

// Loading Spinner
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => (
  <div className={`${styles.spinner} ${styles[size]}`} role="status" aria-label="Loading">
    <div className={styles.spinnerRing} />
  </div>
);

// Loading Skeleton for article cards
export const ArticleSkeleton: React.FC = () => (
  <div className={styles.skeleton} aria-hidden="true">
    <div className={styles.skeletonHeader}>
      <div className={styles.skeletonBadge} />
      <div className={styles.skeletonBadge} />
    </div>
    <div className={styles.skeletonTitle} />
    <div className={styles.skeletonText} />
    <div className={styles.skeletonText} style={{ width: '80%' }} />
    <div className={styles.skeletonTags}>
      <div className={styles.skeletonTag} />
      <div className={styles.skeletonTag} />
      <div className={styles.skeletonTag} />
    </div>
    <div className={styles.skeletonFooter}>
      <div className={styles.skeletonMeta} />
      <div className={styles.skeletonMeta} />
    </div>
  </div>
);

// Multiple skeletons for loading state
export const LoadingResults: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className={styles.loadingResults}>
    {Array.from({ length: count }).map((_, i) => (
      <ArticleSkeleton key={i} />
    ))}
  </div>
);

// Error message component
interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
}) => (
  <div className={styles.error} role="alert">
    <div className={styles.errorIcon}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <h3 className={styles.errorTitle}>{title}</h3>
    <p className={styles.errorMessage}>{message}</p>
    {onRetry && (
      <button onClick={onRetry} className={styles.retryButton}>
        Try Again
      </button>
    )}
  </div>
);

// Empty state component
interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No results found',
  message = 'Try adjusting your search or filters',
  icon,
}) => (
  <div className={styles.empty}>
    <div className={styles.emptyIcon}>
      {icon || (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
          <path d="M8 11h6" />
        </svg>
      )}
    </div>
    <h3 className={styles.emptyTitle}>{title}</h3>
    <p className={styles.emptyMessage}>{message}</p>
  </div>
);
