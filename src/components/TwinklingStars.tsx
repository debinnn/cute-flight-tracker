'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';

const StarsContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

const Star = styled(motion.div)<{ top: string; left: string }>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  color: #f9a8d4;
  font-size: 0.8rem;
`;

const TwinklingStars = () => {
  const stars = [...Array(20)].map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 2
  }));

  return (
    <StarsContainer>
      {stars.map((star) => (
        <Star
          key={star.id}
          top={star.top}
          left={star.left}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 2,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ⭐
        </Star>
      ))}
    </StarsContainer>
  );
};

export default TwinklingStars;
