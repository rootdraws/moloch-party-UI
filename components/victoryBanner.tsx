// VictoryBanner.tsx
import React from 'react';
import styles from '../styles/Home.module.css'; // Adjust the path to your CSS file as necessary

interface VictoryBannerProps {
  isVisible: boolean;
}

const VictoryBanner: React.FC<VictoryBannerProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className={styles.congratsBanner}>
      /Please_be_excited_for_what_is_to_come
    </div>
  );
};

export default VictoryBanner;
