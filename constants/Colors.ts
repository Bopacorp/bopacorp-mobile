const primaryLight = '#13a3ec'; // oklch(65% .18 230)
const primaryDark = '#007fce';  // oklch(51.02% .1402 243.8)

export default {
  light: {
    text: '#1a1a1a',          // oklch(14.5% 0 0)
    background: '#ffffff',    // oklch(100% 0 0)
    card: '#ffffff',          // oklch(100% 0 0)
    primary: primaryLight,
    secondary: '#f7f7f7',     // oklch(97% 0 0)
    muted: '#f7f7f7',         // oklch(97% 0 0)
    mutedForeground: '#8e8e8e', // oklch(55.6% 0 0)
    border: '#ebebeb',        // oklch(92.2% 0 0)
    tint: primaryLight,
    tabIconDefault: '#a0a0a0',
    tabIconSelected: primaryLight,
    hero: '#262d38',          // oklch(18% .04 250)
  },
  dark: {
    text: '#fcfcfc',          // oklch(98.5% 0 0)
    background: '#090b11',    // Deep slate black
    card: '#151b26',          // Dark blue-gray card (distinct from background)
    primary: primaryDark,
    secondary: '#1c2433',     // Dark slate secondary accent
    muted: '#1c2433',
    mutedForeground: '#a3b3cc', // High contrast readable blue-gray
    border: '#232d3d',        // Distinct border color
    tint: primaryDark,
    tabIconDefault: '#5c6e8c',
    tabIconSelected: primaryDark,
    hero: '#12161c',
  },
};
