import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
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
    fontFamily: "Gilroy, Roboto",
  },
  palette: {
    basic: {
      white: "#f2eeea",
      purple: "#F7F7FE",
      gray: "#999999",
    },
  },
  shape: {
    borderRadius: 15,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          "&:hover": {
            backgroundColor: "#383634",
          },
        },
      },
    },
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
      main: "#4C7C7D",
    },
    basic: {
      white: "#FFFFFF",
      purple: "#F7F7FE",
      gray: "#999999",
    },
    secondary: {
      main: "#edeae7",
    },
    text: {
      primary: "#383634",
    },
  },
});
