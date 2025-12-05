const colors = {
  grey: '#787878',
  lighterGrey: '#EEEEEE',
  green: '#03A369',
  lighterGreen: '#E5F6F0',
  orange: '#EB7100',
  lighterOrange: '#FFE4CC',
  red: '#E01702',
  lighterRed: '#FFE3E3',
  white: '#ffffff',
  black: '#000000',
};

const fontSizes = [12, 14, 16, 20, 24, 40];
const space = [0, 2, 4, 8, 16, 24, 32, 40, 48, 56, 68];

const commonTheme = {
  space,
  fontSizes,
};

// Original theme (Light)
export const lightTheme = {
  ...commonTheme,
  colors: {
    ...colors,
    background: '#f0f2f5', // Standard Antd background
    componentBackground: '#ffffff',
    text: 'rgba(0, 0, 0, 0.85)',
    heading: 'rgba(0, 0, 0, 0.85)',
    secondaryText: 'rgba(0, 0, 0, 0.45)',
    headerBackground: '#16161D', // Original header color
    siderBackground: '#ffffff',
    border: '#f0f0f0',
  },
};

// Dark theme
export const darkTheme = {
  ...commonTheme,
  colors: {
    ...colors,
    background: '#000000', // Dark background
    componentBackground: '#141414',
    text: 'rgba(255, 255, 255, 0.85)',
    heading: 'rgba(255, 255, 255, 0.85)',
    secondaryText: 'rgba(255, 255, 255, 0.45)',
    headerBackground: '#141414', // Match antd dark header or keep distinct? Let's use standard dark component bg
    siderBackground: '#141414',
    border: '#303030',
  },
};

// Default export for backward compatibility
const theme = lightTheme;
export default theme;
