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
      // 🎯 Aqui escurecemos o menu lateral
      navigation: {
        background: '#1A1A1A',       // mais escuro que o padrão
        indicator: '#3B82F6',        // cor da barra lateral ativa
        color: '#D1D5DB',            // texto dos itens
        selectedColor: '#FFFFFF',    // item selecionado
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
      other: genPageTheme({ colors: ['#6B7280'], shape: shapes.wave }),
      app: genPageTheme({ colors: ['#3B82F6'], shape: shapes.wave }),
    },
  }),
});
