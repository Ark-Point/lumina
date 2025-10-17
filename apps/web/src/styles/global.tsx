'use client';

import { css, Global } from '@emotion/react';

import { HEADER_HEIGHT } from '../constant/style';

const globalStyles = css`
  :root {
    --header-height: ${HEADER_HEIGHT}px;
    --background: #ffffff;
    --foreground: #171717;

    @media (prefers-color-scheme: dark) {
      :root {
        --background: #ededed;
        --foreground: #0a0a0a;
      }
    }
  }

  body {
    height: 100%
    color: var(--foreground);
    background: var(--background);
  }
    
  .layout {
    min-height: 100dvh;          /* 또는 100svh (iOS Safari 대응) */
    display: flex;
    flex-direction: column;
  }

  main {
    flex:1;
    background-color: white;
    // padding-inline: 24px;
    // padding-bottom: 200px;
    padding-top: calc(var(--header-height));
  }
`;

export const GlobalStyles = () => {
  return <Global styles={globalStyles} />;
};
