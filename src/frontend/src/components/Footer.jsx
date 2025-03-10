import React from 'react';
import styled from 'styled-components';
import Container from './layout/Container';
import Flex from './layout/Flex';
import { Text, Caption } from './common/Typography';
import audiogramLogo from '../assets/images/audiogram-logo.svg';

const FooterContainer = styled.footer`
  background-color: var(--color-bg-primary);
  padding: var(--spacing-md) 0;
  border-top: 1px solid var(--color-accent-tertiary);
  margin-top: auto; /* Push footer to bottom */
`;

const FooterText = styled(Text)`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: var(--font-weight-medium);
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const Logo = styled.img`
  width: 24px;
  height: 24px;
  opacity: 0.7;
`;

const DisclaimerText = styled(Caption)`
  max-width: 600px;
  line-height: var(--line-height-relaxed);
  color: var(--color-text-secondary);
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <Container>
        <Flex 
          direction="column" 
          directionSm="row" 
          justify="space-between" 
          align="center" 
          gap="var(--spacing-md)"
        >
          <LogoContainer>
            <Logo src={audiogramLogo} alt="Audiogram Logo" />
            <FooterText>
              © {currentYear} audiogram
            </FooterText>
          </LogoContainer>
          <DisclaimerText>
            This application provides a simplified visualization for educational purposes. 
            Actual brain responses to music are more complex and vary between individuals.
          </DisclaimerText>
        </Flex>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
