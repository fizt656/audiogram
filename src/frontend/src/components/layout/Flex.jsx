import React from 'react';
import styled, { css } from 'styled-components';

// Flex container
const StyledFlex = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  flex-wrap: ${props => props.wrap || 'nowrap'};
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'stretch'};
  align-content: ${props => props.alignContent || 'stretch'};
  gap: ${props => props.gap || '0'};
  
  ${props => props.inline && css`
    display: inline-flex;
  `}
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  ${props => props.fullHeight && css`
    height: ${props.fullHeight === true ? '100%' : props.fullHeight};
  `}
  
  /* Responsive direction */
  @media (max-width: 768px) {
    flex-direction: ${props => props.directionSm || props.direction || 'row'};
    gap: ${props => props.gapSm || props.gap || '0'};
  }
  
  @media (max-width: 576px) {
    flex-direction: ${props => props.directionXs || props.directionSm || props.direction || 'row'};
    gap: ${props => props.gapXs || props.gapSm || props.gap || '0'};
  }
`;

// Flex item
const StyledFlexItem = styled.div`
  flex: ${props => {
    if (props.flex === 'auto') return '1 1 auto';
    if (props.flex === 'none') return '0 0 auto';
    if (props.flex === 'grow') return '1 0 auto';
    if (props.flex === 'shrink') return '0 1 auto';
    if (props.flex === 'initial') return '0 1 auto';
    return props.flex || '0 1 auto';
  }};
  
  ${props => props.grow !== undefined && css`
    flex-grow: ${props.grow};
  `}
  
  ${props => props.shrink !== undefined && css`
    flex-shrink: ${props.shrink};
  `}
  
  ${props => props.basis && css`
    flex-basis: ${props.basis};
  `}
  
  ${props => props.order !== undefined && css`
    order: ${props.order};
  `}
  
  ${props => props.alignSelf && css`
    align-self: ${props.alignSelf};
  `}
  
  ${props => props.width && css`
    width: ${props.width};
  `}
  
  ${props => props.minWidth && css`
    min-width: ${props.minWidth};
  `}
  
  ${props => props.maxWidth && css`
    max-width: ${props.maxWidth};
  `}
  
  /* Responsive flex */
  @media (max-width: 768px) {
    flex: ${props => props.flexSm || props.flex || '0 1 auto'};
    
    ${props => props.growSm !== undefined && css`
      flex-grow: ${props.growSm};
    `}
    
    ${props => props.shrinkSm !== undefined && css`
      flex-shrink: ${props.shrinkSm};
    `}
    
    ${props => props.basisSm && css`
      flex-basis: ${props.basisSm};
    `}
    
    ${props => props.orderSm !== undefined && css`
      order: ${props.orderSm};
    `}
    
    ${props => props.widthSm && css`
      width: ${props.widthSm};
    `}
  }
  
  @media (max-width: 576px) {
    flex: ${props => props.flexXs || props.flexSm || props.flex || '0 1 auto'};
    
    ${props => props.growXs !== undefined && css`
      flex-grow: ${props.growXs};
    `}
    
    ${props => props.shrinkXs !== undefined && css`
      flex-shrink: ${props.shrinkXs};
    `}
    
    ${props => props.basisXs && css`
      flex-basis: ${props.basisXs};
    `}
    
    ${props => props.orderXs !== undefined && css`
      order: ${props.orderXs};
    `}
    
    ${props => props.widthXs && css`
      width: ${props.widthXs};
    `}
  }
`;

// Flex component
const Flex = ({ 
  children, 
  direction = 'row',
  directionSm,
  directionXs,
  wrap = 'nowrap',
  justify = 'flex-start',
  align = 'stretch',
  alignContent = 'stretch',
  gap = '0',
  gapSm,
  gapXs,
  inline = false,
  fullWidth = false,
  fullHeight = false,
  as = 'div',
  className,
  ...props 
}) => {
  return (
    <StyledFlex
      direction={direction}
      directionSm={directionSm}
      directionXs={directionXs}
      wrap={wrap}
      justify={justify}
      align={align}
      alignContent={alignContent}
      gap={gap}
      gapSm={gapSm}
      gapXs={gapXs}
      inline={inline}
      fullWidth={fullWidth}
      fullHeight={fullHeight}
      as={as}
      className={className}
      {...props}
    >
      {children}
    </StyledFlex>
  );
};

// Flex item component
const FlexItem = ({ 
  children, 
  flex,
  flexSm,
  flexXs,
  grow,
  growSm,
  growXs,
  shrink,
  shrinkSm,
  shrinkXs,
  basis,
  basisSm,
  basisXs,
  order,
  orderSm,
  orderXs,
  alignSelf,
  width,
  widthSm,
  widthXs,
  minWidth,
  maxWidth,
  className,
  ...props 
}) => {
  return (
    <StyledFlexItem
      flex={flex}
      flexSm={flexSm}
      flexXs={flexXs}
      grow={grow}
      growSm={growSm}
      growXs={growXs}
      shrink={shrink}
      shrinkSm={shrinkSm}
      shrinkXs={shrinkXs}
      basis={basis}
      basisSm={basisSm}
      basisXs={basisXs}
      order={order}
      orderSm={orderSm}
      orderXs={orderXs}
      alignSelf={alignSelf}
      width={width}
      widthSm={widthSm}
      widthXs={widthXs}
      minWidth={minWidth}
      maxWidth={maxWidth}
      className={className}
      {...props}
    >
      {children}
    </StyledFlexItem>
  );
};

// Add FlexItem as a property of Flex
Flex.Item = FlexItem;

// Common flex layouts
Flex.Row = (props) => <Flex direction="row" {...props} />;
Flex.Column = (props) => <Flex direction="column" {...props} />;
Flex.Center = (props) => <Flex justify="center" align="center" {...props} />;
Flex.Between = (props) => <Flex justify="space-between" {...props} />;
Flex.Around = (props) => <Flex justify="space-around" {...props} />;
Flex.Evenly = (props) => <Flex justify="space-evenly" {...props} />;

export default Flex;
