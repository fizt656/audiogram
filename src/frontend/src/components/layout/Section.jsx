import React from 'react';
import styled, { css } from 'styled-components';
import Container from './Container';

// Section variants
const variants = {
  default: css`
    background-color: transparent;
    color: var(--color-text-primary);
  `,
  
  primary: css`
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
  `,
  
  secondary: css`
    background-color: var(--color-bg-secondary);
    color: var(--color-text-primary);
  `,
  
  tertiary: css`
    background-color: var(--color-bg-tertiary);
    color: var(--color-text-primary);
  `,
  
  accent: css`
    background-color: var(--color-accent-primary);
    color: white;
  `
};

// Section component
const StyledSection = styled.section`
  padding: ${props => props.padding || 'var(--spacing-xl) 0'};
  position: relative;
  
  /* Apply variant styles */
  ${props => variants[props.variant]}
  
  /* Custom background color */
  ${props => props.backgroundColor && css`
    background-color: ${props.backgroundColor};
  `}
  
  /* Custom text color */
  ${props => props.textColor && css`
    color: ${props.textColor};
  `}
  
  /* Full height option */
  ${props => props.fullHeight && css`
    min-height: ${props.fullHeight === true ? '100vh' : props.fullHeight};
    display: flex;
    flex-direction: column;
    justify-content: ${props.verticalAlign || 'center'};
  `}
  
  /* Border options */
  ${props => props.borderTop && css`
    border-top: 1px solid ${props.borderColor || 'var(--color-accent-tertiary)'};
  `}
  
  ${props => props.borderBottom && css`
    border-bottom: 1px solid ${props.borderColor || 'var(--color-accent-tertiary)'};
  `}
  
  /* Responsive padding */
  @media (max-width: 768px) {
    padding: ${props => props.paddingSm || 'var(--spacing-lg) 0'};
  }
  
  @media (max-width: 576px) {
    padding: ${props => props.paddingXs || 'var(--spacing-md) 0'};
  }
`;

// Section background
const SectionBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  pointer-events: none;
  
  ${props => props.overlay && css`
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: ${props.overlay};
    }
  `}
`;

// Section content
const SectionContent = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  
  ${props => props.fullHeight && css`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: ${props.verticalAlign || 'center'};
  `}
`;

const Section = ({ 
  children, 
  variant = 'default',
  backgroundColor,
  textColor,
  padding,
  paddingSm,
  paddingXs,
  fullHeight = false,
  verticalAlign,
  borderTop = false,
  borderBottom = false,
  borderColor,
  background,
  overlay,
  containerSize = 'md',
  containerProps,
  withContainer = true,
  className,
  ...props 
}) => {
  return (
    <StyledSection
      variant={variant}
      backgroundColor={backgroundColor}
      textColor={textColor}
      padding={padding}
      paddingSm={paddingSm}
      paddingXs={paddingXs}
      fullHeight={fullHeight}
      verticalAlign={verticalAlign}
      borderTop={borderTop}
      borderBottom={borderBottom}
      borderColor={borderColor}
      className={className}
      {...props}
    >
      {background && (
        <SectionBackground overlay={overlay}>
          {background}
        </SectionBackground>
      )}
      
      <SectionContent fullHeight={fullHeight} verticalAlign={verticalAlign}>
        {withContainer ? (
          <Container size={containerSize} {...containerProps}>
            {children}
          </Container>
        ) : (
          children
        )}
      </SectionContent>
    </StyledSection>
  );
};

export default Section;
