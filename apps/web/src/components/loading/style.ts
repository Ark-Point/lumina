import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const spin = keyframes`
    to {
        transform: rotate(360deg);
    }
`;

export const Container = styled.div({
  width: '22px',
  height: '22px',
  margin: '0 auto',
});

export const LoadingSpinner = styled.div({
  display: 'block',
  width: '22px',
  height: '22px',
  border: '3px solid #80d4ff',
  borderTopColor: 'transparent',
  borderRadius: '50%',
  animation: `${spin} 1s linear infinite`,
});
