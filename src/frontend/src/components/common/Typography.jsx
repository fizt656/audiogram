import React from 'react';
import styled, { css } from 'styled-components';

// Shared text styles
const textStyles = css`
  margin: 0;
  color: ${props => props.color || 'inherit'};
  font-weight: ${props => props.weight || 'inherit'};
  text-align: ${props => props.align || 'inherit'};
  
  ${props => props.noWrap && css`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `}
  
  ${props => props.gutterBottom && css`
    margin-bottom: var(--spacing-md);
  `}
  
  ${props => props.muted && css`
    color: var(--color-text-secondary);
  `}
  
  ${props => props.accent && css`
    color: var(--color-accent-primary);
  `}
  
  ${props => props.uppercase && css`
    text-transform: uppercase;
    letter-spacing: 0.05em;
  `}
  
  ${props => props.monospace && css`
    font-family: var(--font-family-mono);
  `}
`;

// Heading components
const StyledH1 = styled.h1`
  ${textStyles}
  font-size: 2rem;
  font-weight: ${props => props.weight || 'var(--font-weight-semibold)'};
  line-height: var(--line-height-tight);
  letter-spacing: -0.01em;
  margin-bottom: ${props => props.gutterBottom ? 'var(--spacing-lg)' : '0'};
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const StyledH2 = styled.h2`
  ${textStyles}
  font-size: 1.5rem;
  font-weight: ${props => props.weight || 'var(--font-weight-medium)'};
  line-height: var(--line-height-tight);
  letter-spacing: -0.01em;
  margin-bottom: ${props => props.gutterBottom ? 'var(--spacing-md)' : '0'};
  
  @media (max-width: 768px) {
    font-size: 1.375rem;
  }
`;

const StyledH3 = styled.h3`
  ${textStyles}
  font-size: 1.25rem;
  font-weight: ${props => props.weight || 'var(--font-weight-medium)'};
  line-height: var(--line-height-tight);
  margin-bottom: ${props => props.gutterBottom ? 'var(--spacing-md)' : '0'};
  
  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const StyledH4 = styled.h4`
  ${textStyles}
  font-size: 1.125rem;
  font-weight: ${props => props.weight || 'var(--font-weight-medium)'};
  line-height: var(--line-height-tight);
  margin-bottom: ${props => props.gutterBottom ? 'var(--spacing-sm)' : '0'};
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const StyledH5 = styled.h5`
  ${textStyles}
  font-size: 1rem;
  font-weight: ${props => props.weight || 'var(--font-weight-medium)'};
  line-height: var(--line-height-tight);
  margin-bottom: ${props => props.gutterBottom ? 'var(--spacing-sm)' : '0'};
`;

const StyledH6 = styled.h6`
  ${textStyles}
  font-size: 0.875rem;
  font-weight: ${props => props.weight || 'var(--font-weight-medium)'};
  line-height: var(--line-height-tight);
  margin-bottom: ${props => props.gutterBottom ? 'var(--spacing-sm)' : '0'};
  text-transform: ${props => props.uppercase ? 'uppercase' : 'none'};
  letter-spacing: ${props => props.uppercase ? '0.05em' : 'normal'};
`;

// Text components
const StyledText = styled.p`
  ${textStyles}
  font-size: ${props => {
    switch (props.size) {
      case 'xs': return '0.75rem';
      case 'sm': return '0.875rem';
      case 'lg': return '1.125rem';
      case 'xl': return '1.25rem';
      default: return '1rem';
    }
  }};
  line-height: var(--line-height-relaxed);
  margin-bottom: ${props => props.gutterBottom ? 'var(--spacing-md)' : '0'};
`;

const StyledCaption = styled.span`
  ${textStyles}
  display: block;
  font-size: 0.75rem;
  color: ${props => props.color || 'var(--color-text-secondary)'};
  line-height: var(--line-height-normal);
`;

const StyledCode = styled.code`
  ${textStyles}
  font-family: var(--font-family-mono);
  font-size: 0.875em;
  background-color: var(--color-bg-tertiary);
  padding: 0.2em 0.4em;
  border-radius: var(--border-radius-sm);
`;

// Export components
export const H1 = (props) => <StyledH1 {...props} />;
export const H2 = (props) => <StyledH2 {...props} />;
export const H3 = (props) => <StyledH3 {...props} />;
export const H4 = (props) => <StyledH4 {...props} />;
export const H5 = (props) => <StyledH5 {...props} />;
export const H6 = (props) => <StyledH6 {...props} />;
export const Text = (props) => <StyledText {...props} />;
export const Caption = (props) => <StyledCaption {...props} />;
export const Code = (props) => <StyledCode {...props} />;

// Export all typography components
const Typography = {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Text,
  Caption,
  Code
};

export default Typography;
