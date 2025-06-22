// Spacing tokens for consistent spacing throughout the application
export const spacingTokens = {
  // Base spacing units (in pixels)
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,

  // Component-specific spacing
  button: {
    padding: {
      small: 8,
      medium: 12,
      large: 16,
    },
    gap: 8,
  },

  card: {
    padding: 24,
    margin: 16,
    gap: 16,
  },

  form: {
    gap: 16,
    fieldGap: 24,
    sectionGap: 32,
  },

  layout: {
    header: {
      height: 64,
      padding: 16,
    },
    sidebar: {
      width: 280,
      collapsedWidth: 64,
      padding: 16,
    },
    content: {
      padding: 24,
    },
  },

  // Responsive spacing
  responsive: {
    mobile: {
      padding: 16,
      gap: 12,
    },
    tablet: {
      padding: 24,
      gap: 16,
    },
    desktop: {
      padding: 32,
      gap: 24,
    },
  },
} as const;

export type SpacingTokens = typeof spacingTokens; 