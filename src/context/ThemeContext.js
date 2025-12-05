import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('theme_mode') || 'system';
  });

  const [systemMode, setSystemMode] = useState(() =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setSystemMode(e.matches ? 'dark' : 'light');
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange); // Fallback for older browsers
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('theme_mode', mode);
  }, [mode]);

  const resolvedMode = useMemo(() => {
    if (mode === 'system') {
      return systemMode;
    }
    return mode;
  }, [mode, systemMode]);

  useEffect(() => {
    const darkThemeLink = document.getElementById('antd-dark-theme');
    if (resolvedMode === 'dark') {
      if (!darkThemeLink) {
        const link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.id = 'antd-dark-theme';
        link.href = '/css/antd.dark.min.css';
        document.head.appendChild(link);
      }
    } else {
      if (darkThemeLink) {
        document.head.removeChild(darkThemeLink);
      }
    }
  }, [resolvedMode]);

  const value = {
    mode,
    setMode,
    resolvedMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
