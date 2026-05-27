import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html,
  body {
    height: 100%;
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 14px;
    color: #1f2939;
    background: #f8f9fa;
    -webkit-font-smoothing: antialiased;
  }

  #root {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;
