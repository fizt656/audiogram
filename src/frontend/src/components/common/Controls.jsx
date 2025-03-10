import React from 'react';
import styled, { css } from 'styled-components';

// Shared styles for form controls
const controlStyles = css`
  font-family: var(--font-family-primary);
  font-size: 1rem;
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Label component
const StyledLabel = styled.label`
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  font-size: 0.875rem;
`;

export const Label = ({ children, htmlFor, ...props }) => (
  <StyledLabel htmlFor={htmlFor} {...props}>
    {children}
  </StyledLabel>
);

// Input component
const StyledInput = styled.input`
  ${controlStyles}
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-accent-tertiary);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: var(--color-accent-primary);
    box-shadow: 0 0 0 1px var(--color-accent-primary);
  }
  
  &::placeholder {
    color: var(--color-text-secondary);
    opacity: 0.6;
  }
`;

export const Input = ({ type = 'text', ...props }) => (
  <StyledInput type={type} {...props} />
);

// Textarea component
const StyledTextarea = styled.textarea`
  ${controlStyles}
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-accent-tertiary);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  width: 100%;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--color-accent-primary);
    box-shadow: 0 0 0 1px var(--color-accent-primary);
  }
  
  &::placeholder {
    color: var(--color-text-secondary);
    opacity: 0.6;
  }
`;

export const Textarea = (props) => (
  <StyledTextarea {...props} />
);

// Select component
const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: var(--spacing-md);
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid var(--color-text-secondary);
    pointer-events: none;
  }
`;

const StyledSelect = styled.select`
  ${controlStyles}
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-accent-tertiary);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  width: 100%;
  appearance: none;
  
  &:focus {
    outline: none;
    border-color: var(--color-accent-primary);
    box-shadow: 0 0 0 1px var(--color-accent-primary);
  }
`;

export const Select = ({ children, ...props }) => (
  <SelectWrapper>
    <StyledSelect {...props}>
      {children}
    </StyledSelect>
  </SelectWrapper>
);

// Checkbox component
const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  user-select: none;
  
  &:hover .checkbox-custom {
    border-color: var(--color-accent-primary);
  }
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
`;

const CheckboxCustom = styled.div`
  width: 18px;
  height: 18px;
  border: 1px solid var(--color-accent-tertiary);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  
  ${props => props.checked && css`
    background-color: var(--color-accent-primary);
    border-color: var(--color-accent-primary);
  `}
  
  &::after {
    content: '';
    width: 10px;
    height: 10px;
    background-color: white;
    opacity: 0;
    transition: opacity var(--transition-fast);
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  }
  
  ${props => props.checked && css`
    &::after {
      opacity: 1;
    }
  `}
`;

const CheckboxLabel = styled.span`
  font-size: 0.875rem;
  color: var(--color-text-primary);
`;

export const Checkbox = ({ label, checked, onChange, ...props }) => (
  <CheckboxContainer onClick={() => onChange(!checked)}>
    <HiddenCheckbox checked={checked} onChange={() => {}} {...props} />
    <CheckboxCustom className="checkbox-custom" checked={checked} />
    {label && <CheckboxLabel>{label}</CheckboxLabel>}
  </CheckboxContainer>
);

// Radio component
const RadioContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  user-select: none;
  
  &:hover .radio-custom {
    border-color: var(--color-accent-primary);
  }
`;

const HiddenRadio = styled.input.attrs({ type: 'radio' })`
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
`;

const RadioCustom = styled.div`
  width: 18px;
  height: 18px;
  border: 1px solid var(--color-accent-tertiary);
  border-radius: var(--border-radius-circle);
  background-color: var(--color-bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  
  ${props => props.checked && css`
    border-color: var(--color-accent-primary);
  `}
  
  &::after {
    content: '';
    width: 10px;
    height: 10px;
    background-color: var(--color-accent-primary);
    border-radius: var(--border-radius-circle);
    opacity: 0;
    transition: opacity var(--transition-fast);
  }
  
  ${props => props.checked && css`
    &::after {
      opacity: 1;
    }
  `}
`;

const RadioLabel = styled.span`
  font-size: 0.875rem;
  color: var(--color-text-primary);
`;

export const Radio = ({ label, checked, onChange, value, name, ...props }) => (
  <RadioContainer onClick={() => onChange(value)}>
    <HiddenRadio checked={checked} name={name} value={value} onChange={() => {}} {...props} />
    <RadioCustom className="radio-custom" checked={checked} />
    {label && <RadioLabel>{label}</RadioLabel>}
  </RadioContainer>
);

// Slider component
const SliderContainer = styled.div`
  width: 100%;
`;

const SliderTrack = styled.div`
  width: 100%;
  height: 4px;
  background-color: var(--color-bg-tertiary);
  border-radius: var(--border-radius-circle);
  position: relative;
  margin: var(--spacing-md) 0;
`;

const SliderFill = styled.div`
  position: absolute;
  height: 100%;
  background-color: var(--color-accent-primary);
  border-radius: var(--border-radius-circle);
  left: 0;
  width: ${props => `${props.percentage}%`};
`;

const SliderThumb = styled.div`
  width: 16px;
  height: 16px;
  background-color: var(--color-accent-primary);
  border-radius: var(--border-radius-circle);
  position: absolute;
  top: 50%;
  left: ${props => `${props.percentage}%`};
  transform: translate(-50%, -50%);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-fast);
  
  &:hover {
    box-shadow: var(--shadow-md);
  }
`;

const SliderInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-xs);
`;

const SliderLabel = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
`;

const SliderValue = styled.div`
  font-family: var(--font-family-mono);
  font-size: 0.875rem;
  color: var(--color-accent-primary);
  text-align: center;
  margin-bottom: var(--spacing-xs);
`;

export const Slider = ({ 
  min = 0, 
  max = 100, 
  step = 1, 
  value, 
  onChange,
  showLabels = true,
  showValue = true,
  valueFormatter = val => val,
  ...props 
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <SliderContainer>
      {showValue && (
        <SliderValue>{valueFormatter(value)}</SliderValue>
      )}
      <SliderTrack>
        <SliderFill percentage={percentage} />
        <SliderThumb percentage={percentage} />
        <SliderInput
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          {...props}
        />
      </SliderTrack>
      {showLabels && (
        <SliderLabels>
          <SliderLabel>{valueFormatter(min)}</SliderLabel>
          <SliderLabel>{valueFormatter(max)}</SliderLabel>
        </SliderLabels>
      )}
    </SliderContainer>
  );
};

// Form group component
const StyledFormGroup = styled.div`
  margin-bottom: var(--spacing-md);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const FormGroup = ({ children, ...props }) => (
  <StyledFormGroup {...props}>
    {children}
  </StyledFormGroup>
);

// Helper text component
const StyledHelperText = styled.p`
  margin: var(--spacing-xs) 0 0 0;
  font-size: 0.75rem;
  color: ${props => props.error ? 'var(--color-tense)' : 'var(--color-text-secondary)'};
`;

export const HelperText = ({ children, error = false, ...props }) => (
  <StyledHelperText error={error} {...props}>
    {children}
  </StyledHelperText>
);

// Export all controls
const Controls = {
  Label,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Slider,
  FormGroup,
  HelperText
};

export default Controls;
