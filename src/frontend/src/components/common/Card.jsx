import React from 'react';
import styled, { css } from 'styled-components';

// Card variants
const variants = {
  default: css`
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-accent-tertiary);
  `,
  
  elevated: css`
    background-color: var(--color-bg-secondary);
    border: none;
    box-shadow: var(--shadow-md);
  `,
  
  flat: css`
    background-color: var(--color-bg-tertiary);
    border: none;
    box-shadow: none;
  `,
  
  outlined: css`
    background-color: transparent;
    border: 1px solid var(--color-accent-tertiary);
    box-shadow: none;
  `
};

const StyledCard = styled.div`
  border-radius: var(--border-radius-md);
  padding: ${props => props.padding || 'var(--spacing-md)'};
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-fast);
  
  /* Apply variant styles */
  ${props => variants[props.variant]}
  
  /* Interactive cards can have hover effects */
  ${props => props.interactive && css`
    cursor: pointer;
    
    &:hover {
      box-shadow: var(--shadow-md);
    }
    
    &:active {
      transform: translateY(1px);
    }
  `}
  
  /* Full width option */
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  /* Custom width */
  ${props => props.width && css`
    width: ${props.width};
  `}
  
  /* Custom height */
  ${props => props.height && css`
    height: ${props.height};
  `}
`;

const CardHeader = styled.div`
  padding: ${props => props.padding || '0 0 var(--spacing-md) 0'};
  margin-bottom: ${props => props.marginBottom || 'var(--spacing-sm)'};
  border-bottom: ${props => props.divider ? '1px solid var(--color-accent-tertiary)' : 'none'};
  display: flex;
  justify-content: ${props => props.align || 'space-between'};
  align-items: center;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
`;

const CardSubtitle = styled.p`
  margin: var(--spacing-xs) 0 0 0;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;

const CardContent = styled.div`
  padding: ${props => props.padding || '0'};
`;

const CardFooter = styled.div`
  padding: ${props => props.padding || 'var(--spacing-md) 0 0 0'};
  margin-top: ${props => props.marginTop || 'var(--spacing-sm)'};
  border-top: ${props => props.divider ? '1px solid var(--color-accent-tertiary)' : 'none'};
  display: flex;
  justify-content: ${props => props.align || 'flex-end'};
  align-items: center;
  gap: var(--spacing-sm);
`;

const Card = ({ 
  children, 
  variant = 'default', 
  padding,
  width,
  height,
  fullWidth = false,
  interactive = false,
  onClick,
  className,
  ...props 
}) => {
  return (
    <StyledCard
      variant={variant}
      padding={padding}
      width={width}
      height={height}
      fullWidth={fullWidth}
      interactive={interactive}
      onClick={interactive ? onClick : undefined}
      className={className}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
