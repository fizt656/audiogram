import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import * as d3 from 'd3';
import Card from './common/Card';
import { H3, H4, Text, Caption } from './common/Typography';
import Loader from './common/Loader';
import Flex from './layout/Flex';
import Grid from './layout/Grid';

// Animation for the dominant emotion highlight
const pulseHighlight = keyframes`
  0% { opacity: 0.05; }
  50% { opacity: 0.15; }
  100% { opacity: 0.05; }
`;

const EmotionContainer = styled(Grid)`
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const ChartTabs = styled.div`
  display: flex;
  border-bottom: 1px solid var(--color-accent-tertiary);
  margin-bottom: var(--spacing-md);
`;

const ChartTab = styled.button`
  background: none;
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 0.9rem;
  font-weight: var(--font-weight-medium);
  color: ${props => props.active ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)'};
  border-bottom: 2px solid ${props => props.active ? 'var(--color-accent-primary)' : 'transparent'};
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    color: var(--color-accent-primary);
  }
`;

const RadarChart = styled.div`
  margin-bottom: var(--spacing-md);
  
  svg {
    width: 100%;
    height: 300px;
    overflow: visible;
  }
  
  .radar-area {
    fill-opacity: 0.2;
    stroke-width: 2px;
  }
  
  .radar-circle {
    fill: none;
    stroke: var(--color-bg-tertiary);
    stroke-dasharray: 4,4;
  }
  
  .radar-axis {
    stroke: var(--color-bg-tertiary);
  }
  
  .radar-label {
    font-family: var(--font-family-display);
    font-size: 0.8rem;
    fill: var(--color-text-primary);
  }
`;

const EmotionChart = styled.div`
  margin-bottom: var(--spacing-md);
  
  svg {
    width: 100%;
    overflow: visible;
  }
  
  .emotion-bar {
    transition: width 1s ease-out;
  }
  
  .emotion-label {
    font-family: var(--font-family-display);
    font-size: 0.875rem;
  }
  
  .emotion-value {
    font-family: var(--font-family-mono);
    font-size: 0.75rem;
  }
`;

const EmotionLegend = styled(Flex)`
  margin-top: var(--spacing-sm);
`;

const LegendItem = styled(Flex)`
  margin-right: var(--spacing-md);
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: var(--border-radius-sm);
  background-color: ${props => props.color};
`;

const EmotionDescription = styled.div`
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  background-color: var(--color-bg-secondary);
  position: relative;
  overflow: hidden;
`;

const EmotionHighlight = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-text-primary);
  opacity: 0.03;
  animation: ${pulseHighlight} 4s ease-in-out infinite;
  z-index: 0;
`;

const EmotionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-circle);
  background-color: var(--color-bg-tertiary);
  border: 1px solid var(--color-accent-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-md);
  color: var(--color-text-primary);
  font-size: 16px;
  font-family: var(--font-family-mono);
  font-weight: var(--font-weight-medium);
`;

const EmotionInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
`;

const EmotionInfoCard = styled.div`
  padding: var(--spacing-sm);
  background-color: var(--color-bg-secondary);
  border-radius: var(--border-radius-md);
  text-align: center;
`;

const EmotionContent = styled.div`
  position: relative;
  z-index: 1;
`;

// Monochrome colors for the emotion bars
const emotionColors = {
  happy: '#0D0C0C',      // Black
  sad: '#434343',        // Dark gray
  calm: '#777777',       // Medium gray
  energetic: '#AAAAAA',  // Light gray
  tense: '#CCCCCC'       // Very light gray
};

// Dash patterns for the emotion bars
const emotionPatterns = {
  happy: { dasharray: 'none', opacity: 0.9 },
  sad: { dasharray: 'none', opacity: 0.7 },
  calm: { dasharray: 'none', opacity: 0.5 },
  energetic: { dasharray: '4,2', opacity: 0.9 },
  tense: { dasharray: '2,2', opacity: 0.7 }
};

const emotionDescriptions = {
  happy: "Happiness in music is often conveyed through major keys, upbeat tempos, and bright timbres. The brain's reward centers, including the nucleus accumbens and ventral tegmental area, are activated, releasing dopamine and creating feelings of pleasure.",
  sad: "Sad music typically features minor keys, slower tempos, and lower pitches. It activates the amygdala and hippocampus, areas involved in emotional processing and memory, which can explain why sad music often evokes nostalgic feelings.",
  calm: "Calm music is characterized by steady rhythms, consonant harmonies, and moderate tempos. It reduces activity in the amygdala while increasing activity in the prefrontal cortex, helping to regulate emotions and reduce stress responses.",
  energetic: "Energetic music features fast tempos, strong rhythms, and dynamic changes. It activates the motor cortex and supplementary motor areas, even when you're not moving, creating an urge to dance or move to the beat.",
  tense: "Tense music often uses dissonant harmonies, unpredictable patterns, and unusual timbres. It increases activity in the amygdala and anterior insula, triggering alertness and sometimes anxiety as the brain processes potential threats."
};

const EmotionAnalysis = ({ emotionData, isLoading }) => {
  const barChartRef = useRef(null);
  const radarChartRef = useRef(null);
  const [dominantEmotion, setDominantEmotion] = useState(null);
  const [activeChart, setActiveChart] = useState('bar'); // 'bar' or 'radar'
  
  // Create radar chart when activeChart is 'radar' or emotionData changes
  useEffect(() => {
    if (!emotionData || isLoading || activeChart !== 'radar' || !radarChartRef.current) return;
    
    // Clear previous SVG content
    d3.select(radarChartRef.current).selectAll("*").remove();
    
    // Format data for radar chart
    const data = Object.entries(emotionData.overall_emotions).map(([emotion, value]) => ({
      emotion,
      value: parseFloat(value)
    }));
    
    // Set up radar chart dimensions
    const width = 300;
    const height = 300;
    const margin = 60;
    const radius = Math.min(width, height) / 2 - margin;
    
    // Create SVG
    const svg = d3.select(radarChartRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width/2}, ${height/2})`);
    
    // Define angles for each emotion
    const angleSlice = (Math.PI * 2) / data.length;
    
    // Scale for the radius
    const rScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, radius]);
    
    // Draw the circular grid
    const levels = 5;
    const gridCircles = svg.selectAll(".radar-circle")
      .data(d3.range(1, levels + 1).reverse())
      .enter()
      .append("circle")
      .attr("class", "radar-circle")
      .attr("r", d => radius * d / levels)
      .style("fill", "none")
      .style("stroke", "var(--color-bg-tertiary)")
      .style("stroke-dasharray", "4,4");
    
    // Draw the axes
    const axes = svg.selectAll(".radar-axis")
      .data(data)
      .enter()
      .append("line")
      .attr("class", "radar-axis")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d, i) => rScale(1.1) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (d, i) => rScale(1.1) * Math.sin(angleSlice * i - Math.PI / 2))
      .style("stroke", "var(--color-bg-tertiary)")
      .style("stroke-width", "1px");
    
    // Draw the axis labels
    const axisLabels = svg.selectAll(".radar-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "radar-label")
      .style("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", (d, i) => rScale(1.2) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y", (d, i) => rScale(1.2) * Math.sin(angleSlice * i - Math.PI / 2))
      .text(d => d.emotion.charAt(0).toUpperCase() + d.emotion.slice(1))
      .style("fill", "var(--color-text-primary)");
    
    // Draw the radar chart areas
    const radarLine = d3.lineRadial()
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);
    
    // Create the radar area
    svg.append("path")
      .datum(data)
      .attr("class", "radar-area")
      .attr("d", radarLine)
      .style("fill", "var(--color-accent-primary)")
      .style("fill-opacity", 0.1)
      .style("stroke", "var(--color-accent-primary)")
      .style("stroke-width", "2px")
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .style("opacity", 1);
    
    // Add dots at each data point
    svg.selectAll(".radar-dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "radar-dot")
      .attr("r", 4)
      .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .style("fill", "var(--color-accent-primary)")
      .style("stroke", "white")
      .style("stroke-width", "1px")
      .style("opacity", 0)
      .transition()
      .delay(1000)
      .duration(500)
      .style("opacity", 1);
    
    // Add value labels
    svg.selectAll(".radar-value")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "radar-value")
      .attr("x", (d, i) => rScale(d.value + 0.1) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y", (d, i) => rScale(d.value + 0.1) * Math.sin(angleSlice * i - Math.PI / 2))
      .text(d => `${(d.value * 100).toFixed(0)}%`)
      .style("font-size", "9px")
      .style("font-family", "var(--font-family-mono)")
      .style("fill", "var(--color-text-secondary)")
      .style("opacity", 0)
      .transition()
      .delay(1500)
      .duration(500)
      .style("opacity", 1);
      
  }, [emotionData, isLoading, activeChart]);

  useEffect(() => {
    if (!emotionData || isLoading) return;
    
    // Find dominant emotion
    let maxEmotion = '';
    let maxValue = 0;
    
    Object.entries(emotionData.overall_emotions).forEach(([emotion, value]) => {
      if (value > maxValue) {
        maxValue = value;
        maxEmotion = emotion;
      }
    });
    
    setDominantEmotion(maxEmotion);
    
    // Create bar chart
    const margin = { top: 10, right: 30, bottom: 30, left: 90 };
    const width = 300 - margin.left - margin.right;
    const height = 180 - margin.top - margin.bottom;
    
    // Clear previous SVG content
    d3.select(barChartRef.current).selectAll("*").remove();
    
    const svg = d3.select(barChartRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Format data for D3
    const data = Object.entries(emotionData.overall_emotions).map(([emotion, value]) => ({
      emotion,
      value: parseFloat(value)
    }));
    
    // Create scales
    const y = d3.scaleBand()
      .domain(data.map(d => d.emotion))
      .range([0, height])
      .padding(0.3);
    
    const x = d3.scaleLinear()
      .domain([0, 1])
      .range([0, width]);
    
    // Add Y axis
    svg.append("g")
      .call(d3.axisLeft(y).tickSize(0))
      .call(g => g.select(".domain").remove())
      .selectAll("text")
      .attr("class", "emotion-label")
      .style("text-transform", "capitalize")
      .style("fill", "var(--color-text-primary)");
    
    // Add X axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format(".0%")))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").attr("stroke", "var(--color-bg-tertiary)"))
      .selectAll("text")
      .attr("class", "emotion-value")
      .style("fill", "var(--color-text-secondary)");
    
    // Add grid lines
    svg.append("g")
      .attr("class", "grid")
      .call(d3.axisBottom(x).ticks(5).tickSize(height).tickFormat(""))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line")
        .attr("stroke", "var(--color-bg-tertiary)")
        .attr("stroke-dasharray", "2,2"));
    
    // Add bars with animation
    svg.selectAll(".emotion-bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "emotion-bar")
      .attr("y", d => y(d.emotion))
      .attr("height", y.bandwidth())
      .attr("x", 0)
      .attr("width", 0)
      .attr("fill", d => emotionColors[d.emotion])
      .attr("fill-opacity", d => emotionPatterns[d.emotion].opacity)
      .attr("stroke", d => emotionColors[d.emotion])
      .attr("stroke-dasharray", d => emotionPatterns[d.emotion].dasharray)
      .attr("rx", 3)
      .attr("ry", 3)
      .transition()
      .duration(1000)
      .attr("width", d => x(d.value));
    
    // Add value labels
    svg.selectAll(".value-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "emotion-value")
      .attr("x", d => x(d.value) + 5)
      .attr("y", d => y(d.emotion) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .style("fill", "var(--color-text-primary)")
      .text(d => `${(d.value * 100).toFixed(0)}%`)
      .style("opacity", 0)
      .transition()
      .delay(1000)
      .duration(500)
      .style("opacity", 1);
      
  }, [emotionData, isLoading]);
  
  if (isLoading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Emotion Analysis</Card.Title>
        </Card.Header>
        <Card.Content>
          <Loader.InlineLoader text="Analyzing emotional content..." />
        </Card.Content>
      </Card>
    );
  }
  
  if (!emotionData) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Emotion Analysis</Card.Title>
        </Card.Header>
        <Card.Content>
          <Text muted>Upload and analyze music to see emotional content</Text>
        </Card.Content>
      </Card>
    );
  }
  
  // Emotion icons (text-based for monochrome design)
  const getEmotionIcon = (emotion) => {
    switch(emotion) {
      case 'happy': return 'H+';
      case 'sad': return 'S-';
      case 'calm': return 'C~';
      case 'energetic': return 'E!';
      case 'tense': return 'T^';
      default: return '♪';
    }
  };
  
  // Musical characteristics associated with each emotion
  const emotionCharacteristics = {
    happy: ['Major key', 'Upbeat tempo', 'Bright timbre'],
    sad: ['Minor key', 'Slow tempo', 'Lower pitch'],
    calm: ['Steady rhythm', 'Consonant harmony', 'Moderate tempo'],
    energetic: ['Fast tempo', 'Strong rhythm', 'Dynamic changes'],
    tense: ['Dissonant harmony', 'Unpredictable patterns', 'Unusual timbre']
  };
  
  // Brain regions primarily associated with each emotion
  const emotionBrainRegions = {
    happy: ['Nucleus accumbens', 'Ventral tegmental area'],
    sad: ['Amygdala', 'Hippocampus'],
    calm: ['Prefrontal cortex', 'Reduced amygdala activity'],
    energetic: ['Motor cortex', 'Supplementary motor area'],
    tense: ['Amygdala', 'Anterior insula']
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Emotion Analysis</Card.Title>
      </Card.Header>
      
      <Card.Content>
        <EmotionContainer>
          <ChartContainer>
            <ChartTabs>
              <ChartTab 
                active={activeChart === 'bar'} 
                onClick={() => setActiveChart('bar')}
              >
                Bar Chart
              </ChartTab>
              <ChartTab 
                active={activeChart === 'radar'} 
                onClick={() => setActiveChart('radar')}
              >
                Radar Chart
              </ChartTab>
            </ChartTabs>
            
            {activeChart === 'bar' && (
              <>
                <EmotionChart>
                  <svg ref={barChartRef}></svg>
                </EmotionChart>
                
                <EmotionLegend wrap="wrap" gap="var(--spacing-sm)">
                  {Object.entries(emotionColors).map(([emotion, color]) => (
                    <LegendItem key={emotion} align="center" gap="var(--spacing-xs)">
                      <LegendColor color={color} />
                      <Caption style={{ textTransform: 'capitalize' }}>{emotion}</Caption>
                    </LegendItem>
                  ))}
                </EmotionLegend>
              </>
            )}
            
            {activeChart === 'radar' && (
              <RadarChart>
                <svg ref={radarChartRef}></svg>
              </RadarChart>
            )}
          </ChartContainer>
          
          {dominantEmotion && (
            <div>
              <EmotionDescription>
                <EmotionHighlight color={emotionColors[dominantEmotion]} />
                <EmotionContent>
                  <Flex align="center" gap="var(--spacing-sm)">
                    <EmotionIcon color={emotionColors[dominantEmotion]}>
                      {getEmotionIcon(dominantEmotion)}
                    </EmotionIcon>
                    <div>
                      <H4 style={{ textTransform: 'capitalize', margin: 0 }}>
                        {dominantEmotion}
                      </H4>
                      <Caption>Dominant Emotion</Caption>
                    </div>
                  </Flex>
                  
                  <Text size="sm" style={{ marginTop: 'var(--spacing-md)' }}>
                    {emotionDescriptions[dominantEmotion]}
                  </Text>
                  
                  <Grid cols="2" gap="var(--spacing-md)" style={{ marginTop: 'var(--spacing-md)' }}>
                    <div>
                      <Caption style={{ fontWeight: 'var(--font-weight-medium)' }}>
                        Musical Characteristics
                      </Caption>
                      <ul style={{ margin: 'var(--spacing-xs) 0', paddingLeft: 'var(--spacing-lg)' }}>
                        {emotionCharacteristics[dominantEmotion].map((trait, i) => (
                          <li key={i}><Caption>{trait}</Caption></li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <Caption style={{ fontWeight: 'var(--font-weight-medium)' }}>
                        Brain Regions
                      </Caption>
                      <ul style={{ margin: 'var(--spacing-xs) 0', paddingLeft: 'var(--spacing-lg)' }}>
                        {emotionBrainRegions[dominantEmotion].map((region, i) => (
                          <li key={i}><Caption>{region}</Caption></li>
                        ))}
                      </ul>
                    </div>
                  </Grid>
                </EmotionContent>
              </EmotionDescription>
            </div>
          )}
        </EmotionContainer>
      </Card.Content>
    </Card>
  );
};

export default EmotionAnalysis;
