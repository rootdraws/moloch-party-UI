// index.tsx

// IMPORTS
import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import FundingGoal from '../components/fundingGoal';
import MemberCount from '../components/memberCount';
import HoursLeft from '../components/hoursLeft';
import TapToJoin from '../components/tapToJoin';
import HomeBanner from '../components/homeBanner';
import RewardTiers from '../components/rewardTiers';
import MainContent from '../components/mainContent';
import VictoryBanner from '../components/victoryBanner';
import { getEthersProvider, getContract } from '../utils/ethers';
import { ethers } from 'ethers';
import { getTokenTotalSupply } from '../utils/ethers';

// HOME
const Home: NextPage = () => {
  
// VARS
  const [raisedAmount, setRaisedAmount] = useState(0);
  const [goalAmount, setGoalAmount] = useState(0);
  const [stretchAmount, setStretchAmount] = useState(0);
  const [memberNumber, setMemberNumber] = useState(0);
  const [hoursLeft, setHoursLeft] = useState(0);
  const [mintRemaining, setMintRemaining] = useState(0);
  const [costToMint, setCostToMint] = useState(0);
  const [priceComm, setPriceComm] = useState(0);
  const isVictoryBannerVisible = raisedAmount >= goalAmount;

// READ | FETCH VARS
  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const provider = getEthersProvider();
        const contract = getContract(provider);

        const costToMint = await contract.costToMint();
        const priceComm = await contract.priceComm();

        setCostToMint(parseFloat(ethers.utils.formatEther(costToMint)));
        setPriceComm(parseFloat(ethers.utils.formatEther(priceComm)));

        const goalAmount = await contract.goalAmount();
        const raisedAmount = await contract.raisedAmount();
        const stretchAmount = await contract.stretchAmount();
        const mintRemaining = await contract.mintRemaining();

        setGoalAmount(parseFloat(ethers.utils.formatEther(goalAmount)));
        setRaisedAmount(parseFloat(ethers.utils.formatEther(raisedAmount)));
        setStretchAmount(parseFloat(ethers.utils.formatEther(stretchAmount)));
        setMintRemaining(parseInt(mintRemaining.toString(), 10));

        // HOURS LEFT | CAMPAIGN TIMER | UPDATED EACH MINUTE
        const startTime = await contract.startTime();
        const endTime = await contract.endTime();

        const currentTime = Math.floor(Date.now() / 1000);
        const remainingSeconds = endTime.toNumber() - currentTime;

        if (remainingSeconds > 0) {
          const remainingHours = Math.floor(remainingSeconds / 3600);
          setHoursLeft(remainingHours);
        } else {
          setHoursLeft(0);
        }
      } catch (error) {
        console.error('Error fetching contract data:', error);
      }
    };

    fetchContractData();

    const timer = setInterval(() => {
      fetchContractData();
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // ETHERSCAN API
  useEffect(() => {
    const fetchTokenTotalSupply = async () => {
      try {
        const totalSupply = await getTokenTotalSupply();
        console.log('Total supply:', totalSupply);
        setMemberNumber(parseInt(totalSupply, 10));
      } catch (error) {
        console.error('Error fetching token total supply:', error);
        setMemberNumber(0); // Set a default value or handle the error case
      }
    };

    fetchTokenTotalSupply();
  }, []);


  // CONTENT
  return (
    <div className={styles.container}>
      <Head>
        <title>moloch.party</title>
        <meta content="Artists Crowdfunding Moloch Treasuries." name="description" />
        <link href="/favicon.png?v=2" rel="icon" type="image/png" />
      </Head>

      <div className={styles.topBar}>
        <div className={styles.connectButton}><ConnectButton /></div>
      </div>

{/* TITLE */}
      <div className={styles.Title}>
        <div className={styles.cardSubtitle}>/OPTIMISTIC_LANDSCAPES</div>
      </div>

{/* KICKSTARTER UI CAMPAIGN PAGE */}
      <div className={styles.mainWrapper}>
        <div className={styles.centeredContent}>
          <main className={styles.main}>
            <div className={styles.mainWrapper}>
              <div className={styles.contentArea}>
                <div className={styles.menu}>
                  <FundingGoal raisedAmount={raisedAmount} goalAmount={goalAmount} stretchAmount={stretchAmount} />
                  <MemberCount memberNumber={memberNumber} />
                  <HoursLeft hoursLeft={hoursLeft} />
                  <TapToJoin />
                </div>
                <MainContent raisedAmount={raisedAmount} goalAmount={goalAmount} />
              </div>
            </div>
          </main>
        </div>
      </div>
      
      <HomeBanner raisedAmount={raisedAmount} goalAmount={goalAmount} />
      <VictoryBanner isVisible={isVictoryBannerVisible} />

      {/* REWARD TIERS */}
      <div className={styles.newPageA}>
        <div id="targetAnchor"></div>
      </div>
      <div className={styles.newPageB}>
        {"//MEMBERSHIP_rewards"}
      </div>

      <RewardTiers mintRemaining={mintRemaining} costToMint={costToMint} priceComm={priceComm} />

      {/* INFO: BAAL | 6551 Structures */}
      <div className={styles.newPageA}>
        <div id="targetAnchorB"></div>
      </div>
      <div className={styles.newPageB}>
        {"//ANATOMY_of_SILO"}
      </div>
    </div>
  );
};

export default Home;