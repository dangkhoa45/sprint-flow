// Breakpoint tokens for responsive design
export const breakpointTokens = {
  // Mobile-first breakpoints
  xs: 0,      // Extra small devices (phones)
  sm: 600,    // Small devices (tablets)
  md: 900,    // Medium devices (small laptops)
  lg: 1200,   // Large devices (desktops)
  xl: 1536,   // Extra large devices (large desktops)

  // Custom breakpoints for specific use cases
  mobile: {
    min: 0,
    max: 599,
  },
  tablet: {
    min: 600,
    max: 899,
  },
  desktop: {
    min: 900,
    max: 1199,
  },
  wide: {
    min: 1200,
    max: 1535,
  },
  ultra: {
    min: 1536,
    max: Infinity,
  },

  // Component-specific breakpoints
  components: {
    sidebar: {
      collapse: 1024, // Sidebar collapses below this width
    },
    navigation: {
      mobile: 768,    // Mobile navigation below this width
    },
    grid: {
      tablet: 768,    // Grid changes to single column below this width
      mobile: 480,    // Grid changes to single column below this width
    },
  },
} as const;

export type BreakpointTokens = typeof breakpointTokens; 