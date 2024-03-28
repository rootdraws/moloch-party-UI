import React from 'react';
import styles from '../styles/Home.module.css'; // Ensure this path is correct.

interface FundingGoalProps {
  raisedAmount: number;
  goalAmount: number;
  stretchAmount: number; // Total goal including stretch.
}

const FundingGoal = ({ raisedAmount, goalAmount, stretchAmount }: FundingGoalProps) => {
  const fundingPercentage = Math.min(100, (raisedAmount / goalAmount) * 100);
  let stretchFundingPercentage = 0;

  if (raisedAmount > goalAmount) {
    const stretchGoalExcess = raisedAmount - goalAmount;
    const stretchGoalTotal = stretchAmount - goalAmount;
    stretchFundingPercentage = (stretchGoalExcess / stretchGoalTotal) * 100;
    stretchFundingPercentage = Math.min(100, stretchFundingPercentage);
  }

  return (
    <div className={styles.fundingCard}>
      <div className={styles.fundingMeterContainer}>
        <div className={styles.fundingMeter} style={{ width: `${fundingPercentage}%` }}></div>
      </div>

      {raisedAmount > goalAmount && (
        <div className={styles.bonusMeterContainer}>
          <div className={styles.bonusMeter} style={{ width: `${stretchFundingPercentage}%` }}></div>
        </div>
      )}

      <div className={styles.goalRaised}>Ξ {raisedAmount.toFixed(2)}</div>
      {raisedAmount >= goalAmount ? (
        <>
          <div className={styles.goalAmount}>[Bonus deposited as DAO owned VELO-USDC LP]</div>
        </>
      ) : (
        <div className={styles.goalAmount}>pledged of Ξ{goalAmount} goal</div>
      )}
    </div>
  );
};

export default FundingGoal;
