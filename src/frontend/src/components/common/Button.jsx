import React from 'react';
import styled, { css } from 'styled-components';

// Button variants
const variants = {
  primary: css`
    background-color: var(--color-accent-primary);
    color: white;
    border: none;
    
    &:hover {
      background-color: #333333; /* Slightly darker shade of accent primary */
      box-shadow: var(--shadow-md);
    }
    
    &:active {
      background-color: #222222;
    }
  `,
  
  secondary: css`
    background-color: transparent;
    color: var(--color-text-primary);
    border: 1px solid var(--color-accent-tertiary);
    
    &:hover {
      border-color: var(--color-accent-primary);
      color: var(--color-accent-primary);
    }
    
    &:active {
      background-color: rgba(13, 12, 12, 0.05);
    }
  `,
  
  text: css`
    background-color: transparent;
    color: var(--color-accent-primary);
    border: none;
    padding: var(--spacing-xs) var(--spacing-sm);
    box-shadow: none;
    
    &:hover {
      background-color: rgba(13, 12, 12, 0.05);
      box-shadow: none;
    }
    
    &:active {
      background-color: rgba(13, 12, 12, 0.1);
    }
  `,
  
  icon: css`
    background-color: transparent;
    color: var(--color-text-secondary);
    border: none;
    padding: var(--spacing-xs);
    border-radius: var(--border-radius-circle);
    box-shadow: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background-color: var(--color-bg-tertiary);
      color: var(--color-text-primary);
      box-shadow: none;
    }
    
    &:active {
      background-color: var(--color-accent-tertiary);
    }
  `
};

// Button sizes
const sizes = {
  small: css`
    font-size: 0.875rem;
    padding: var(--spacing-xs) var(--spacing-sm);
    height: 32px;
  `,
  
  medium: css`
    font-size: 1rem;
    padding: var(--spacing-sm) var(--spacing-md);
    height: 40px;
  `,
  
  large: css`
    font-size: 1.125rem;
    padding: var(--spacing-sm) var(--spacing-lg);
    height: 48px;
  `
};

const StyledButton = styled.button`
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-medium);
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-accent-tertiary);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
  box-shadow: var(--shadow-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  
  &:hover {
    background-color: var(--color-bg-secondary);
    border-color: var(--color-accent-primary);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
  
  /* Apply variant styles */
  ${props => variants[props.variant]}
  
  /* Apply size styles */
  ${props => sizes[props.size]}
  
  /* Full width option */
  ${props => props.fullWidth && css`
    width: 100%;
  `}
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  type = 'button',
  fullWidth = false,
  disabled = false,
  onClick,
  ...props 
}) => {
  return (
    <StyledButton
      type={type}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
