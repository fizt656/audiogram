import React from 'react';
import styled, { keyframes } from 'styled-components';

// Spinner animation
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// Pulse animation
const pulse = keyframes`
  0% { transform: scale(0.8); opacity: 0.3; }
  50% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(0.8); opacity: 0.3; }
`;

// Fade animation
const fade = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
`;

// Spinner Loader
const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const SpinnerCircle = styled.div`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border: 2px solid transparent;
  border-top-color: ${props => props.color || 'var(--color-accent-primary)'};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const SpinnerText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;

export const Spinner = ({ size, color, text, ...props }) => (
  <SpinnerContainer {...props}>
    <SpinnerCircle size={size} color={color} />
    {text && <SpinnerText>{text}</SpinnerText>}
  </SpinnerContainer>
);

// Dots Loader
const DotsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const DotsWrapper = styled.div`
  display: flex;
  gap: 6px;
`;

const Dot = styled.div`
  width: ${props => props.size || '8px'};
  height: ${props => props.size || '8px'};
  background-color: ${props => props.color || 'var(--color-accent-primary)'};
  border-radius: 50%;
  animation: ${pulse} 1.5s ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
`;

const DotsText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;

export const Dots = ({ size, color, text, ...props }) => (
  <DotsContainer {...props}>
    <DotsWrapper>
      <Dot size={size} color={color} delay="0s" />
      <Dot size={size} color={color} delay="0.2s" />
      <Dot size={size} color={color} delay="0.4s" />
    </DotsWrapper>
    {text && <DotsText>{text}</DotsText>}
  </DotsContainer>
);

// Progress Bar Loader
const ProgressContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 4px;
  background-color: var(--color-bg-tertiary);
  border-radius: var(--border-radius-circle);
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${props => `${props.value}%`};
  background-color: ${props => props.color || 'var(--color-accent-primary)'};
  border-radius: var(--border-radius-circle);
  transition: width 0.3s ease;
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProgressText = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
`;

const ProgressValue = styled.span`
  font-family: var(--font-family-mono);
  font-size: 0.75rem;
  color: var(--color-text-secondary);
`;

export const Progress = ({ value = 0, color, text, showPercentage = true, ...props }) => (
  <ProgressContainer {...props}>
    <ProgressTrack>
      <ProgressBar value={value} color={color} />
    </ProgressTrack>
    <ProgressInfo>
      {text && <ProgressText>{text}</ProgressText>}
      {showPercentage && <ProgressValue>{Math.round(value)}%</ProgressValue>}
    </ProgressInfo>
  </ProgressContainer>
);

// Skeleton Loader
const skeletonAnimation = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, 
    var(--color-bg-secondary) 25%, 
    var(--color-bg-tertiary) 37%, 
    var(--color-bg-secondary) 63%
  );
  background-size: 400px 100%;
  animation: ${skeletonAnimation} 1.4s ease infinite;
  border-radius: var(--border-radius-sm);
`;

const SkeletonText = styled(SkeletonBase)`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '16px'};
  margin-bottom: ${props => props.spacing || 'var(--spacing-sm)'};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SkeletonCircle = styled(SkeletonBase)`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border-radius: 50%;
`;

const SkeletonRect = styled(SkeletonBase)`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '200px'};
`;

export const Skeleton = {
  Text: SkeletonText,
  Circle: SkeletonCircle,
  Rectangle: SkeletonRect
};

// Full page loader overlay
const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(26, 26, 31, 0.8);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-index-modal);
`;

export const LoadingOverlay = ({ children }) => (
  <OverlayContainer>
    {children || <Spinner size="50px" text="Loading..." />}
  </OverlayContainer>
);

// Inline loader
const InlineContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-secondary);
  font-size: 0.875rem;
`;

const InlineSpinner = styled.div`
  width: 14px;
  height: 14px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const InlineLoader = ({ text = 'Loading...', ...props }) => (
  <InlineContainer {...props}>
    <InlineSpinner />
    <span>{text}</span>
  </InlineContainer>
);

// Export all loaders
const Loader = {
  Spinner,
  Dots,
  Progress,
  Skeleton,
  LoadingOverlay,
  InlineLoader
};

export default Loader;
