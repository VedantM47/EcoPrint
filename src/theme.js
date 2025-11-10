import { createGlobalStyle } from 'styled-components'

export const spacing = (n) => `${n * 8}px`

export const lightTheme = {
  bg: '#F9FAFB',
  surface: 'rgba(255,255,255,0.8)',
  primary: '#4A90E2',
  secondary: '#50E3C2',
  accent: '#7B61FF',
  text: '#2E2E2E',
  muted: '#6B7280',
  glass: 'rgba(255,255,255,0.7)',
  cardShadow: '0 8px 30px rgba(16,24,40,0.06)'
}

export const darkTheme = {
  bg: '#0b1220',
  surface: 'rgba(20,25,30,0.6)',
  primary: '#4A90E2',
  secondary: '#50E3C2',
  accent: '#7B61FF',
  text: '#E6EEF3',
  muted: '#9AA4B2',
  glass: 'rgba(30,35,40,0.5)',
  cardShadow: '0 12px 40px rgba(2,6,23,0.6)'
}

export const GlobalStyles = createGlobalStyle`
  :root {
    --spacing-1: 8px;
    --spacing-2: 16px;
    --spacing-3: 24px;
    --spacing-4: 32px;
    --radius: 12px;
    --transition: 180ms cubic-bezier(.2,.9,.3,1);
  }

  *,*::before,*::after { box-sizing: border-box; }

  html,body,#root { height:100%; }
  body {
    margin:0;
    font-family: 'Inter', system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial;
    background: ${(p) => p.theme.bg};
    color: ${(p) => p.theme.text};
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;
    line-height:1.45;
    transition: background var(--transition), color var(--transition);
  }

  a { color: inherit; text-decoration: none; }
  button { font-family: inherit; }
  input, textarea, select { font-family: inherit; }
  
  /* Utility */
  .container { max-width: 1100px; margin: 28px auto; padding: 0 20px; }
`