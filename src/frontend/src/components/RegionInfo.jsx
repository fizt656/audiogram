import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Card from './common/Card';
import Button from './common/Button';
import { H3, H4, Text } from './common/Typography';
import Loader from './common/Loader';
import Flex from './layout/Flex';

const FunctionsList = styled.ul`
  margin: var(--spacing-sm) 0 var(--spacing-md);
  padding-left: var(--spacing-lg);
  
  li {
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-xs);
  }
`;

const MusicRelation = styled(Card)`
  margin-top: var(--spacing-md);
`;

const EmotionTags = styled(Flex)`
  margin-top: var(--spacing-md);
`;

const EmotionTag = styled.span`
  background-color: ${props => `var(--color-${props.emotion})`};
  color: ${props => 
    props.emotion === 'happy' || props.emotion === 'energetic' 
      ? 'rgba(0, 0, 0, 0.8)' 
      : 'white'
  };
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: 0.75rem;
  font-weight: var(--font-weight-medium);
  text-transform: capitalize;
`;

const RegionInfo = ({ region, onClose }) => {
  const [regionData, setRegionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchRegionInfo = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`/api/info/regions?region=${region}`);
        setRegionData(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load region information');
        setIsLoading(false);
      }
    };
    
    if (region) {
      fetchRegionInfo();
    }
  }, [region]);
  
  if (isLoading) {
    return (
      <Card>
        <Card.Content>
          <Loader.InlineLoader text="Loading region information..." />
        </Card.Content>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Region Information</Card.Title>
          <Button variant="icon" onClick={onClose} aria-label="Close">
            ×
          </Button>
        </Card.Header>
        <Card.Content>
          <Text color="var(--color-tense)">{error}</Text>
        </Card.Content>
      </Card>
    );
  }
  
  if (!regionData) {
    return null;
  }
  
  return (
    <Card>
      <Card.Header>
        <Card.Title>{regionData.name}</Card.Title>
        <Button variant="icon" onClick={onClose} aria-label="Close">
          ×
        </Button>
      </Card.Header>
      
      <Card.Content>
        <Text muted gutterBottom>
          {regionData.description}
        </Text>
        
        <H4 size="sm">Functions</H4>
        <FunctionsList>
          {regionData.functions.map((func, index) => (
            <li key={index}>{func}</li>
          ))}
        </FunctionsList>
        
        <MusicRelation variant="flat">
          <Card.Content padding="var(--spacing-md)">
            <H4 size="sm" gutterBottom>Relation to Music</H4>
            <Text size="sm" muted>
              {regionData.music_relation}
            </Text>
          </Card.Content>
        </MusicRelation>
        
        {regionData.emotions && regionData.emotions.length > 0 && (
          <EmotionTags wrap="wrap" gap="var(--spacing-xs)">
            {regionData.emotions.map(emotion => (
              emotion !== 'all' ? (
                <EmotionTag key={emotion} emotion={emotion}>
                  {emotion}
                </EmotionTag>
              ) : null
            ))}
          </EmotionTags>
        )}
      </Card.Content>
    </Card>
  );
};

export default RegionInfo;
