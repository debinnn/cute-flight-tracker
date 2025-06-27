'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';

const ErrorContainer = styled(motion.div)`
  background: linear-gradient(135deg, #fce7f3, #fbcfe8);
  border: 2px solid #f472b6;
  border-radius: 20px;
  padding: 2rem;
  margin: 1rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(236, 72, 153, 0.15);
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.h3`
  font-family: var(--font-pixel), monospace;
  font-size: 1rem;
  color: #be185d;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  font-family: var(--font-pixel), monospace;
  font-size: 0.7rem;
  color: #9d174d;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const RetryButton = styled(motion.button)`
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 0.8rem 1.5rem;
  font-family: var(--font-pixel), monospace;
  font-size: 0.7rem;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(236, 72, 153, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
  }
`;

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay = ({ message, onRetry }: ErrorDisplayProps) => {
  return (
    <ErrorContainer
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ErrorIcon>😭</ErrorIcon>
      <ErrorTitle>Oops! Something went wrong</ErrorTitle>
      <ErrorMessage>{message}</ErrorMessage>
      <RetryButton
        onClick={onRetry}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Try Again ✨
      </RetryButton>
    </ErrorContainer>
  );
};

export default ErrorDisplay;
