import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Container from './layout/Container';
import Flex from './layout/Flex';
import { H1, Text } from './common/Typography';
import audiogramLogo from '../assets/images/audiogram-logo.svg';

// Animation keyframe for the frequency spectrum bars
const equalizerAnimation = keyframes`
  0% { height: 10%; }
  50% { height: 75%; }
  100% { height: 10%; }
`;

const HeaderContainer = styled.header`
  background-color: var(--color-bg-primary);
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--color-accent-tertiary);
  position: relative;
  z-index: var(--z-index-overlay);
  overflow: hidden;
`;

// Frequency Spectrum Background
const FrequencySpectrumBackground = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.1;
  pointer-events: none;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 5px;
  
  .bar {
    width: 1px;
    background-color: var(--color-text-primary);
    animation: ${equalizerAnimation} var(--duration) ease-in-out infinite;
    animation-delay: var(--delay);
    margin: 0 1px;
  }
`;

const Logo = styled.div`
  .logo-icon {
    width: 80px;
    height: 80px;
    
    @media (min-width: 768px) {
      width: 96px;
      height: 96px;
    }
  }
`;

const WelcomeMessage = styled.div`
  animation: fadeIn var(--transition-normal);
  text-transform: lowercase;
  max-width: 600px;
  
  .main-line {
    font-size: 1.25rem;
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
    margin: 0;
    letter-spacing: -0.01em;
    
    @media (min-width: 768px) {
      font-size: 1.5rem;
    }
  }
  
  .sub-line {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    letter-spacing: 0.02em;
    margin-top: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    
    @media (min-width: 768px) {
      font-size: 1rem;
    }
    
    @media (max-width: 480px) {
      font-size: 0.75rem;
    }
  }
  
  .grey {
    color: var(--color-text-secondary);
  }
  
  .cycling-text {
    transition: opacity 0.5s ease;
  }
`;

const Header = () => {
  const phrases = [
    "visualize your music's impact on the brain. what regions will you activate?",
    "explore how emotions in music activate different brain regions.",
    "see the neuroscience behind your favorite songs.",
    "discover which brain areas respond to your music.",
    "turn audio into neural activity visualization."
  ];
  
  const [currentPhrase, setCurrentPhrase] = useState(phrases[0]);
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const cycleText = () => {
      // Fade out
      setIsVisible(false);
      
      // Change text after fade out
      setTimeout(() => {
        const nextIndex = (currentIndex + 1) % phrases.length;
        setCurrentIndex(nextIndex);
        setCurrentPhrase(phrases[nextIndex]);
        
        // Fade in
        setIsVisible(true);
      }, 500);
    };
    
    // Start cycle
    const interval = setInterval(cycleText, 3000); // 2.5s display + 0.5s fade
    
    return () => clearInterval(interval);
  }, [currentIndex, phrases]);
  
  // Render frequency spectrum bars
  const renderFrequencySpectrum = () => {
    const bars = [];
    const barCount = 100; // More bars for denser visualization
    
    for (let i = 0; i < barCount; i++) {
      const duration = 1 + Math.random() * 1; // 1-2 seconds (faster animation)
      const delay = Math.random() * 1; // Shorter delay for more responsive feel
      const initialHeight = 10 + Math.random() * 65; // 10-75% initial height
      
      bars.push(
        <div 
          key={`bar-${i}`}
          className="bar"
          style={{
            height: `${initialHeight}%`,
            '--duration': `${duration}s`,
            '--delay': `${delay}s`
          }}
        />
      );
    }
    
    return bars;
  };

  return (
    <HeaderContainer>
      <FrequencySpectrumBackground>
        {renderFrequencySpectrum()}
      </FrequencySpectrumBackground>
      <Container>
        <Flex justify="space-between" align="center">
          <WelcomeMessage>
            <div className="main-line">welcome to <span className="grey">audiogram.</span></div>
            <div 
              className="sub-line cycling-text" 
              style={{ opacity: isVisible ? 1 : 0 }}
            >
              {currentPhrase}
            </div>
          </WelcomeMessage>
          <Logo>
            <img 
              src={audiogramLogo} 
              alt="Audiogram Logo" 
              className="logo-icon"
            />
          </Logo>
        </Flex>
      </Container>
    </HeaderContainer>
  );
};

export default Header;
