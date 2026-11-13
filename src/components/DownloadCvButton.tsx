import React from 'react';
import styles from '../styles/DownloadCvButton.module.css';

interface DownloadCvButtonProps {
  cvUrl?: string;
}

export const DownloadCvButton: React.FC<DownloadCvButtonProps> = ({ cvUrl = '/cv.pdf' }) => {
  return (
    <a
      href={cvUrl}
      download
      className={styles.downloadBtn}
      aria-label="Unduh CV"
      title="Unduh CV (PDF)"
    >
      <span className={styles.desktopText}>Unduh CV</span>
      <span className={styles.mobileText}>CV</span>
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </svg>
    </a>
  );
};

