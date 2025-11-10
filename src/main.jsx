import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "styled-components";
import { GlobalStyles, lightTheme, darkTheme } from "./theme";
import "./styles.css"; // <-- ensure legacy CSS classes are loaded

function Root() {
  const saved = localStorage.getItem("sc_theme") || "light";
  const [themeName, setThemeName] = React.useState(saved);

  React.useEffect(() => {
    localStorage.setItem("sc_theme", themeName);
  }, [themeName]);

  const theme = themeName === "dark" ? darkTheme : lightTheme;

  // expose toggleTheme so components can call theme.toggleTheme()
  const themeWithToggle = {
    ...theme,
    toggleTheme: () => setThemeName((t) => (t === "dark" ? "light" : "dark")),
  };

  return (
    <ThemeProvider theme={themeWithToggle}>
      <GlobalStyles />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
