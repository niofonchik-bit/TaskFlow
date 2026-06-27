import { createTheme } from '@mui/material';

export const appTheme = createTheme({
    cssVariables: {
        cssVarPrefix: 'taskflow',
        colorSchemeSelector: "[data-theme='%s']",
    },

    colorSchemes: {
        light: {
            palette: {
                primary: {
                    light: '#FF9B79',
                    main: '#F2734D',
                    dark: '#E85C39',
                    contrastText: '#FFFFFF',
                },

                secondary: {
                    light: '#75C3BE',
                    main: '#4FA6A0',
                    dark: '#357F7A',
                    contrastText: '#FFFFFF',
                },

                background: {
                    default: '#FCF7F1',
                    paper: '#FFFFFF',
                },

                text: {
                    primary: '#2E2723',
                    secondary: '#8A7A70',
                },

                divider: '#ECE3DB',

                action: {
                    hover: 'rgba(46, 39, 35, 0.05)',
                    selected: 'rgba(242, 115, 77, 0.1)',
                    disabled: 'rgba(46, 39, 35, 0.38)',
                    disabledBackground: 'rgba(46, 39, 35, 0.08)',
                },

                success: {
                    main: '#4E9A64',
                },

                error: {
                    main: '#D85D4A',
                },

                warning: {
                    main: '#D99232',
                },

                info: {
                    main: '#4C8DB5',
                },
            },
        },

        dark: {
            palette: {
                primary: {
                    light: '#FFB097',
                    main: '#FF8966',
                    dark: '#F2734D',
                    contrastText: '#211815',
                },

                secondary: {
                    light: '#96D9D4',
                    main: '#6FC1BB',
                    dark: '#4FA6A0',
                    contrastText: '#14211F',
                },

                background: {
                    default: '#171310',
                    paper: '#211B18',
                },

                text: {
                    primary: '#FFF4EC',
                    secondary: '#C9B8AC',
                },

                divider: '#40342D',

                action: {
                    hover: 'rgba(255, 244, 236, 0.06)',
                    selected: 'rgba(255, 137, 102, 0.14)',
                    disabled: 'rgba(255, 244, 236, 0.38)',
                    disabledBackground: 'rgba(255, 244, 236, 0.08)',
                },

                success: {
                    main: '#73BD86',
                },

                error: {
                    main: '#EE806E',
                },

                warning: {
                    main: '#E8AD58',
                },

                info: {
                    main: '#72ACD0',
                },
            },
        },
    },

    typography: {
        fontFamily: '"Nunito", Arial, sans-serif',

        button: {
            fontWeight: 800,
            textTransform: 'none',
        },
    },

    shape: {
        borderRadius: 14,
    },

    components: {
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },

            styleOverrides: {
                root: {
                    borderRadius: 14,
                    fontWeight: 800,
                },
            },
        },

        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
    },
});
