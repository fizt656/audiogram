import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import audiogramBanner from '../assets/images/audiogram_banner.png';

// Container for the splash screen
const SplashContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #191a1e;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  opacity: ${props => props.fadeOut ? 0 : 1};
  transition: opacity 0.5s ease-out;
`;

// Logo container
const LogoContainer = styled.div`
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
`;

// Logo image
const LogoImage = styled.img`
  width: 100%;
  max-width: 400px;
  height: auto;
`;

// Text for "Initializing neural audio engine..."
const InitText = styled.div`
  color: #f3f2f2;
  font-size: 14px;
  font-family: 'Roboto Mono', monospace;
  margin-bottom: 20px;
  letter-spacing: 0.5px;
`;

// Loading bar animation
const loadingAnimation = keyframes`
  0% { width: 0; }
  100% { width: 100%; }
`;

// Loading bar container
const LoadingBarContainer = styled.div`
  width: 200px;
  height: 2px;
  background-color: #333;
  border-radius: 1px;
  overflow: hidden;
`;

// Loading bar progress
const LoadingBarProgress = styled.div`
  height: 100%;
  background-color: #f3f2f2;
  animation: ${loadingAnimation} 3.5s ease-in-out forwards;
`;

const SplashScreen = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);
  
  useEffect(() => {
    // Start fade out after 3.5 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 3500);
    
    // Complete after fade out (4 seconds total)
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4000);
    
    // Clean up timers
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);
  
  return (
    <SplashContainer fadeOut={fadeOut}>
      <LogoContainer>
        <LogoImage src={audiogramBanner} alt="Audiogram Logo" />
      </LogoContainer>
      <InitText>Initializing neural audio engine...</InitText>
      <LoadingBarContainer>
        <LoadingBarProgress />
      </LoadingBarContainer>
    </SplashContainer>
  );
};

export default SplashScreen;
