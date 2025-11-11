import { createGlobalStyle } from "styled-components"

export const spacing = (n) => `${n * 8}px`

export const lightTheme = {
  bg: "#FAFBF7",
  surface: "rgba(255,254,250,0.95)",
  primary: "#D4A017",
  secondary: "#E8B04B",
  accent: "#F5C842",
  text: "#1A1A1A",
  muted: "#6B7280",
  glass: "rgba(255,255,255,0.85)",
  cardShadow: "0 4px 20px rgba(212,160,23,0.08)",
  borderColor: "rgba(212,160,23,0.1)",
}

export const darkTheme = {
  bg: "#0F1419",
  surface: "rgba(20,28,24,0.8)",
  primary: "#E8B04B",
  secondary: "#D4A017",
  accent: "#F5C842",
  text: "#F5F5F5",
  muted: "#A0A0A0",
  glass: "rgba(30,40,35,0.6)",
  cardShadow: "0 8px 32px rgba(232,176,75,0.12)",
  borderColor: "rgba(232,176,75,0.15)",
}

export const GlobalStyles = createGlobalStyle`
  :root {
    --spacing-1: 8px;
    --spacing-2: 16px;
    --spacing-3: 24px;
    --spacing-4: 32px;
    --radius: 12px;
    --transition: 200ms cubic-bezier(0.3, 0, 0.2, 1);
  }

  *,*::before,*::after { box-sizing: border-box; }

  html,body,#root { height:100%; }
  body {
    margin:0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    background: ${(p) => p.theme.bg};
    color: ${(p) => p.theme.text};
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;
    line-height:1.6;
    transition: background var(--transition), color var(--transition);
  }

  a { color: inherit; text-decoration: none; }
  button { font-family: inherit; }
  input, textarea, select { font-family: inherit; }
  
  /* Utility */
  .container { max-width: 1100px; margin: 28px auto; padding: 0 20px; }
`

export default lightTheme
