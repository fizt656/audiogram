import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Header from './Header';
import MusicUploader from './MusicUploader';
import BrainVisualization from './BrainVisualization';
import EmotionAnalysis from './EmotionAnalysis';
import RegionInfo from './RegionInfo';
import Footer from './Footer';
import SplashScreen from './SplashScreen';
import Container from './layout/Container';
import Grid from './layout/Grid';
import Card from './common/Card';
import Button from './common/Button';
import { H2, Text } from './common/Typography';
import Loader from './common/Loader';
import Flex from './layout/Flex';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-bg-primary);
`;

const MainContent = styled.main`
  flex: 1;
  padding: var(--spacing-md) 0;
  display: flex;
  flex-direction: column;
`;

const ErrorMessage = styled(Card)`
  padding: var(--spacing-lg);
  border-left: 4px solid var(--color-tense);
  margin-bottom: var(--spacing-lg);
`;

const Instructions = styled(Card)`
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: var(--color-bg-secondary);
  margin-top: var(--spacing-md);
  
  h2 {
    margin-bottom: var(--spacing-sm);
    font-size: 1.25rem;
  }
  
  p {
    max-width: 600px;
    margin: 0 auto;
    font-size: 0.9rem;
  }
`;

const TabContainer = styled.div`
  margin-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-accent-tertiary);
`;

const TabButton = styled.button`
  background: none;
  border: none;
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: 1rem;
  font-weight: var(--font-weight-medium);
  color: ${props => props.active ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)'};
  border-bottom: 3px solid ${props => props.active ? 'var(--color-accent-primary)' : 'transparent'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all var(--transition-fast);
  
  &:hover {
    color: ${props => props.disabled ? 'var(--color-text-secondary)' : 'var(--color-accent-primary)'};
  }
  
  &:focus {
    outline: none;
  }
`;

const TabContent = styled.div`
  display: ${props => props.active ? 'block' : 'none'};
`;

// Styled component for the global audio element
const GlobalAudio = styled.audio`
  display: none;
`;

// Animation keyframe for the frequency spectrum bars
const equalizerAnimation = keyframes`
  0% { height: 10%; }
  50% { height: 75%; }
  100% { height: 10%; }
`;

// Styled component for the loading overlay
const LoadingOverlay = styled(Card)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: var(--spacing-lg);
  background-color: var(--color-bg-primary);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
`;

// Frequency Spectrum Background for loading overlay
const FrequencySpectrumBackground = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
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

// Styled component for the loading message with fade transition
const LoadingMessageContainer = styled.div`
  margin-top: var(--spacing-lg);
  min-height: 48px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FadingMessage = styled.div`
  text-align: center;
  transition: opacity 0.3s ease;
  opacity: ${props => props.visible ? 1 : 0};
  padding: 0 var(--spacing-md);
  width: 100%;
`;

// Success message animation
const slideIn = keyframes`
  0% { transform: translateY(-20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const SuccessMessage = styled(Card)`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--color-bg-primary);
  border-left: 4px solid var(--color-accent-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: ${slideIn} 0.5s ease forwards;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  margin-left: var(--spacing-md);
  line-height: 1;
  
  &:hover {
    color: var(--color-text-primary);
  }
`;

const SuccessIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--color-accent-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
`;

const loadingMessages = [
  "Mapping sound waves to neural pathways...",
  "Identifying emotional patterns in your music...",
  "Analyzing harmonic structures and brain responses...",
  "Connecting musical elements to brain regions...",
  "Discovering the neural signature of your music...",
  "Processing frequency distributions...",
  "Evaluating rhythmic patterns and brain activity...",
  "Calculating emotional resonance profiles...",
  "Unlocking the brain's response to your music...",
  "Translating audio frequencies to neural activity...",
  "Decoding the emotional language of your music...",
  "Revealing how your music speaks to the brain...",
  "Exploring the neural landscape of your sound...",
  "Building your unique audio-neural profile...",
  "Connecting rhythm patterns to brain regions..."
];

const App = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  
  // Audio state
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);
  
  // Loading message state - simplified
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0]);
  const [isMessageVisible, setIsMessageVisible] = useState(true);
  
  // Use a ref to track the current index to avoid dependency issues
  const messageIndexRef = useRef(0);
  
  // Constants for transition timing
  const FADE_DURATION = 300; // 300ms for fade transition
  const MESSAGE_DURATION = 2500; // 2.5s per message as requested

  // Cycle through loading messages with smooth transitions
  useEffect(() => {
    if (!isLoading) return;
    
    // Initialize with first message
    messageIndexRef.current = 0;
    setCurrentLoadingMessage(loadingMessages[0]);
    setIsMessageVisible(true);
    
    // Function to handle the message change cycle
    const cycleMessage = () => {
      // Fade out
      setIsMessageVisible(false);
      
      // Wait for fade out, then change message and fade in
      const fadeTimeout = setTimeout(() => {
        // Update index
        messageIndexRef.current = (messageIndexRef.current + 1) % loadingMessages.length;
        
        // Set new message
        setCurrentLoadingMessage(loadingMessages[messageIndexRef.current]);
        
        // Fade in
        setIsMessageVisible(true);
      }, FADE_DURATION);
      
      return fadeTimeout;
    };
    
    // Set up the interval for cycling messages
    const interval = setInterval(() => {
      const fadeTimeout = cycleMessage();
      
      // Clean up the timeout if the interval is cleared
      return () => clearTimeout(fadeTimeout);
    }, MESSAGE_DURATION);
    
    // Clean up on unmount or when isLoading changes
    return () => clearInterval(interval);
  }, [isLoading]); // Only depend on isLoading state
  
  // Play audio when analysis starts
  useEffect(() => {
    if (isLoading && audioRef.current && audioUrl) {
      // Set volume to a reasonable level
      audioRef.current.volume = 0.5;
      audioRef.current.currentTime = 0; // Start from beginning
      // Try to play the audio and log any errors
      audioRef.current.play()
        .then(() => console.log('Audio playback started in App component'))
        .catch(e => console.error('Audio playback failed in App component:', e));
    }
  }, [isLoading, audioUrl]);

// No longer auto-hiding success message - user will dismiss it manually

  const handleAnalysisComplete = (data) => {
    console.log('Analysis complete, received data:', data);
    setIsLoading(false);
    setAnalysisData(data);
    setError(null);
    
    // Show success message
    setShowSuccess(true);
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
  };
  
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
    <React.Fragment>
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}
      <AppContainer>
        <Header />
        
        <MainContent>
          <Container>
            {error && (
              <ErrorMessage variant="outlined">
                <H2>Error</H2>
                <Text>{error}</Text>
              </ErrorMessage>
            )}
            
            <TabContainer>
              <Flex>
                <TabButton 
                  active={activeTab === 'upload'} 
                  onClick={() => setActiveTab('upload')}
                >
                  Upload Music
                </TabButton>
                
                <TabButton 
                  active={activeTab === 'analysis'} 
                  onClick={() => setActiveTab('analysis')}
                  disabled={!analysisData}
                >
                  Emotion Analysis
                </TabButton>
                
                <TabButton 
                  active={activeTab === 'visualization'} 
                  onClick={() => setActiveTab('visualization')}
                  disabled={!analysisData}
                >
                  Brain Visualization
                </TabButton>
              </Flex>
            </TabContainer>
            
            {/* Global audio element that stays mounted */}
            {audioUrl && (
              <GlobalAudio 
                ref={audioRef}
                src={audioUrl} 
                preload="auto"
                loop
              />
            )}
            
            {/* Always render the TabContent, but conditionally show loading overlay */}
            <TabContent active={activeTab === 'upload'}>
              <MusicUploader 
                onAnalysisStart={() => {
                  setIsLoading(true);
                }}
                onAnalysisComplete={(data) => {
                  handleAnalysisComplete(data);
                  setActiveTab('analysis');
                }}
                onError={handleError}
                setAudioUrl={setAudioUrl}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
              
              {!analysisData && !isLoading && (
                <Instructions>
                  <H2>Upload a music file to begin</H2>
                  <Text>
                    audiogram will analyze your music and show you how it might
                    activate different regions of the brain based on the emotional content.
                  </Text>
                </Instructions>
              )}
            </TabContent>
            
            <TabContent active={activeTab === 'visualization'}>
              {analysisData && (
                <BrainVisualization 
                  brainData={analysisData.brain_views ? analysisData.brain_views.axial : analysisData.brain_data}
                  onRegionSelect={handleRegionSelect}
                  isLoading={isLoading}
                />
              )}
              
              {selectedRegion && (
                <RegionInfo 
                  region={selectedRegion}
                  onClose={() => setSelectedRegion(null)}
                />
              )}
            </TabContent>
            
            <TabContent active={activeTab === 'analysis'}>
              {analysisData && (
                <EmotionAnalysis 
                  emotionData={analysisData.emotions}
                  isLoading={isLoading}
                />
              )}
            </TabContent>
            
            {/* Loading overlay */}
            {isLoading && (
              <LoadingOverlay variant="flat">
                {/* Frequency spectrum background animation */}
                <FrequencySpectrumBackground>
                  {renderFrequencySpectrum()}
                </FrequencySpectrumBackground>
                
                {/* Content */}
                <Flex align="center" justify="center" direction="column" gap="var(--spacing-lg)" style={{ position: 'relative', zIndex: 1 }}>
                  <Loader.Spinner size="48px" />
                  
                  <LoadingMessageContainer>
                    <FadingMessage visible={isMessageVisible}>
                      <Text style={{ textAlign: 'center', fontWeight: 'var(--font-weight-medium)' }}>
                        {currentLoadingMessage}
                      </Text>
                    </FadingMessage>
                  </LoadingMessageContainer>
                </Flex>
              </LoadingOverlay>
            )}
            
            {/* Success message */}
            {showSuccess && (
              <SuccessMessage>
                <SuccessIcon>✓</SuccessIcon>
                <div>
                  <Text style={{ fontWeight: 'var(--font-weight-medium)' }}>
                    Analysis complete!
                  </Text>
                  <Text size="sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Explore the results in the Emotion Analysis and Brain Visualization tabs.
                  </Text>
                </div>
                <CloseButton onClick={() => setShowSuccess(false)}>×</CloseButton>
              </SuccessMessage>
            )}
          </Container>
        </MainContent>
        
        <Footer />
      </AppContainer>
    </React.Fragment>
  );
};

export default App;
