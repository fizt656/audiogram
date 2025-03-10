import React from 'react';
import styled, { css } from 'styled-components';

// Container sizes
const sizes = {
  sm: '800px',
  md: '1200px',
  lg: '1600px',
  xl: 'var(--container-max-width)',
  fluid: '100%'
};

const StyledContainer = styled.div`
  width: 100%;
  max-width: ${props => sizes[props.size] || sizes.md};
  margin-left: auto;
  margin-right: auto;
  padding-left: ${props => props.padding || 'var(--spacing-md)'};
  padding-right: ${props => props.padding || 'var(--spacing-md)'};
  
  ${props => props.centerContent && css`
    display: flex;
    flex-direction: column;
    align-items: center;
  `}
  
  ${props => props.fullHeight && css`
    min-height: ${props.fullHeight === true ? '100vh' : props.fullHeight};
  `}
  
  @media (max-width: 768px) {
    padding-left: ${props => props.mobilePadding || 'var(--spacing-sm)'};
    padding-right: ${props => props.mobilePadding || 'var(--spacing-sm)'};
  }
`;

const Container = ({ 
  children, 
  size = 'md', 
  padding,
  mobilePadding,
  centerContent = false,
  fullHeight = false,
  as = 'div',
  className,
  ...props 
}) => {
  return (
    <StyledContainer
      size={size}
      padding={padding}
      mobilePadding={mobilePadding}
      centerContent={centerContent}
      fullHeight={fullHeight}
      as={as}
      className={className}
      {...props}
    >
      {children}
    </StyledContainer>
  );
};

export default Container;
