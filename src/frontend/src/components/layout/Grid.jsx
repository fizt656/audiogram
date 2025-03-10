import React from 'react';
import styled, { css } from 'styled-components';

// Grid container
const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => {
    if (props.columns) {
      return `repeat(${props.columns}, 1fr)`;
    } else if (props.templateColumns) {
      return props.templateColumns;
    } else {
      return 'repeat(12, 1fr)';
    }
  }};
  grid-template-rows: ${props => props.templateRows || 'auto'};
  grid-gap: ${props => props.gap || 'var(--grid-gap)'};
  grid-column-gap: ${props => props.columnGap || props.gap || 'var(--grid-gap)'};
  grid-row-gap: ${props => props.rowGap || props.gap || 'var(--grid-gap)'};
  
  ${props => props.autoRows && css`
    grid-auto-rows: ${props.autoRows};
  `}
  
  ${props => props.autoColumns && css`
    grid-auto-columns: ${props.autoColumns};
  `}
  
  ${props => props.autoFlow && css`
    grid-auto-flow: ${props.autoFlow};
  `}
  
  ${props => props.justifyItems && css`
    justify-items: ${props.justifyItems};
  `}
  
  ${props => props.alignItems && css`
    align-items: ${props.alignItems};
  `}
  
  ${props => props.justifyContent && css`
    justify-content: ${props.justifyContent};
  `}
  
  ${props => props.alignContent && css`
    align-content: ${props.alignContent};
  `}
  
  /* Responsive columns */
  @media (max-width: 1200px) {
    grid-template-columns: ${props => {
      if (props.columnsLg) {
        return `repeat(${props.columnsLg}, 1fr)`;
      } else if (props.columns && props.columns > 8) {
        return 'repeat(8, 1fr)';
      }
      return null;
    }};
  }
  
  @media (max-width: 992px) {
    grid-template-columns: ${props => {
      if (props.columnsMd) {
        return `repeat(${props.columnsMd}, 1fr)`;
      } else if (props.columns && props.columns > 6) {
        return 'repeat(6, 1fr)';
      }
      return null;
    }};
  }
  
  @media (max-width: 768px) {
    grid-template-columns: ${props => {
      if (props.columnsSm) {
        return `repeat(${props.columnsSm}, 1fr)`;
      } else if (props.columns && props.columns > 4) {
        return 'repeat(4, 1fr)';
      }
      return null;
    }};
    grid-gap: ${props => props.gapSm || 'var(--spacing-md)'};
  }
  
  @media (max-width: 576px) {
    grid-template-columns: ${props => {
      if (props.columnsXs) {
        return `repeat(${props.columnsXs}, 1fr)`;
      } else if (props.columns && props.columns > 2) {
        return 'repeat(2, 1fr)';
      }
      return null;
    }};
    grid-gap: ${props => props.gapXs || 'var(--spacing-sm)'};
  }
  
  @media (max-width: 480px) {
    grid-template-columns: ${props => {
      if (props.columnsXxs) {
        return `repeat(${props.columnsXxs}, 1fr)`;
      } else {
        return 'repeat(1, 1fr)';
      }
    }};
  }
`;

// Grid item
const StyledGridItem = styled.div`
  grid-column: ${props => props.colSpan ? `span ${props.colSpan}` : props.colStart ? `${props.colStart} / ${props.colEnd || 'auto'}` : 'auto'};
  grid-row: ${props => props.rowSpan ? `span ${props.rowSpan}` : props.rowStart ? `${props.rowStart} / ${props.rowEnd || 'auto'}` : 'auto'};
  
  ${props => props.justifySelf && css`
    justify-self: ${props.justifySelf};
  `}
  
  ${props => props.alignSelf && css`
    align-self: ${props.alignSelf};
  `}
  
  /* Responsive column spans */
  @media (max-width: 1200px) {
    grid-column: ${props => props.colSpanLg ? `span ${props.colSpanLg}` : null};
  }
  
  @media (max-width: 992px) {
    grid-column: ${props => props.colSpanMd ? `span ${props.colSpanMd}` : null};
  }
  
  @media (max-width: 768px) {
    grid-column: ${props => props.colSpanSm ? `span ${props.colSpanSm}` : null};
  }
  
  @media (max-width: 576px) {
    grid-column: ${props => props.colSpanXs ? `span ${props.colSpanXs}` : null};
  }
  
  @media (max-width: 480px) {
    grid-column: ${props => props.colSpanXxs ? `span ${props.colSpanXxs}` : '1 / -1'};
  }
`;

// Grid component
const Grid = ({ 
  children, 
  columns,
  columnsLg,
  columnsMd,
  columnsSm,
  columnsXs,
  columnsXxs,
  templateColumns,
  templateRows,
  gap,
  columnGap,
  rowGap,
  gapSm,
  gapXs,
  autoRows,
  autoColumns,
  autoFlow,
  justifyItems,
  alignItems,
  justifyContent,
  alignContent,
  className,
  ...props 
}) => {
  return (
    <StyledGrid
      columns={columns}
      columnsLg={columnsLg}
      columnsMd={columnsMd}
      columnsSm={columnsSm}
      columnsXs={columnsXs}
      columnsXxs={columnsXxs}
      templateColumns={templateColumns}
      templateRows={templateRows}
      gap={gap}
      columnGap={columnGap}
      rowGap={rowGap}
      gapSm={gapSm}
      gapXs={gapXs}
      autoRows={autoRows}
      autoColumns={autoColumns}
      autoFlow={autoFlow}
      justifyItems={justifyItems}
      alignItems={alignItems}
      justifyContent={justifyContent}
      alignContent={alignContent}
      className={className}
      {...props}
    >
      {children}
    </StyledGrid>
  );
};

// Grid item component
const GridItem = ({ 
  children, 
  colSpan,
  colSpanLg,
  colSpanMd,
  colSpanSm,
  colSpanXs,
  colSpanXxs,
  colStart,
  colEnd,
  rowSpan,
  rowStart,
  rowEnd,
  justifySelf,
  alignSelf,
  className,
  ...props 
}) => {
  return (
    <StyledGridItem
      colSpan={colSpan}
      colSpanLg={colSpanLg}
      colSpanMd={colSpanMd}
      colSpanSm={colSpanSm}
      colSpanXs={colSpanXs}
      colSpanXxs={colSpanXxs}
      colStart={colStart}
      colEnd={colEnd}
      rowSpan={rowSpan}
      rowStart={rowStart}
      rowEnd={rowEnd}
      justifySelf={justifySelf}
      alignSelf={alignSelf}
      className={className}
      {...props}
    >
      {children}
    </StyledGridItem>
  );
};

// Add GridItem as a property of Grid
Grid.Item = GridItem;

export default Grid;
