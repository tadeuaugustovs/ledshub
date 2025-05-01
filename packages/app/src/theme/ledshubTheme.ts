import {
  createBaseThemeOptions,
  createUnifiedTheme,
  genPageTheme,
  palettes,
  shapes,
} from '@backstage/theme';

export const hubTheme = createUnifiedTheme({
  ...createBaseThemeOptions({
    palette: {
      ...palettes.dark,
      primary: { main: '#3B82F6' },
      secondary: { main: '#10B981' },
      error: { main: '#EF4444' },
      warning: { main: '#F59E0B' },
      info: { main: '#60A5FA' },
      success: { main: '#10B981' },
      background: {
        default: '#121212',
        paper: '#1E1E1E',
      },
      banner: {
        info: '#3B82F6',
        error: '#EF4444',
        text: '#FFFFFF',
        link: '#60A5FA',
      },
      navigation: {
        background: '#1A1A1A',
        indicator: '#3B82F6',
        color: '#D1D5DB',
        selectedColor: '#FFFFFF',
      },
    },
    fontFamily: 'Roboto, sans-serif',
    defaultPageTheme: 'home',
    pageTheme: {
      home: genPageTheme({ colors: ['#3B82F6'], shape: shapes.wave }),
      documentation: genPageTheme({ colors: ['#10B981'], shape: shapes.wave }),
      tool: genPageTheme({ colors: ['#3B82F6'], shape: shapes.round }),
      service: genPageTheme({ colors: ['#60A5FA'], shape: shapes.wave }),
      website: genPageTheme({ colors: ['#3B82F6'], shape: shapes.wave }),
      library: genPageTheme({ colors: ['#10B981'], shape: shapes.wave }),
      other: genPageTheme({ colors: ['#10B981'], shape: shapes.wave }),
    },
  }),

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // Estilos para botões de login específicos
          '&.signInButton': {
            borderRadius: '20px',
            padding: '12px 24px',
            fontWeight: 'bold',
            textTransform: 'none',
            margin: '8px 0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
          },
          '&.signInButton-github': {
            backgroundColor: '#24292e',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#2d333b',
            },
          },
          '&.signInButton-google': {
            backgroundColor: '#4285f4',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#3367d6',
            },
          },
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          '& > .MuiButton-root': {
            width: '100%',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
          color: '#f9fafb',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        },
      },
    },
  },
});