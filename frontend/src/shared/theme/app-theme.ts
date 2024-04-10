import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    basic: {
      white: string;
      gray: string;
      purple: string;
    };
  }

  interface PaletteOptions {
    basic: {
      white: string;
      gray: string;
      purple: string;
    };
  }

  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true;
  }
}

const defaultTheme = createTheme({
  typography: {
    fontFamily: 'Montserrat, Roboto',
  },
  shape: {
    borderRadius: 8,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 480,
      md: 640,
      lg: 1024,
      xl: 1280,
      xxl: 1440,
    },
  },
});

export const AppTheme = createTheme(defaultTheme, {
  palette: {
    primary: {
      dark: '#413FC0',
      main: '#6765F2',
    },
    basic: {
      white: '#FFFFFF',
      purple: '#F7F7FE',
      gray: '#999999',
    },
    text: {
      secondary: '#656565',
    },
  },
});
