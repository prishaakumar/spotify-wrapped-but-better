import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
    palette: {
        mode,
        primary: {
            main: '#1DB954', // Spotify Green
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#9B5DE5', // Vibrant Purple
            contrastText: '#FFFFFF',
        },
        background: mode === 'dark' ? {
            default: '#191414', // Spotify Black
            paper: '#181818', // Card backgrounds
            dark: '#121212',
            hover: '#282828',
        } : {
            default: '#F5F5F5',
            paper: '#FFFFFF',
            dark: '#E0E0E0',
            hover: '#F0F0F0',
        },
        text: mode === 'dark' ? {
            primary: '#FFFFFF',
            secondary: '#B3B3B3',
        } : {
            primary: '#191414',
            secondary: '#555',
        },
        accent: {
            main: '#F15BB5', // Pink
        },
        info: {
            main: '#00BBF9', // Sky Blue
        },
        divider: mode === 'dark' ? '#282828' : '#E0E0E0',
    },
    typography: {
        fontFamily: 'Inter, Montserrat, Arial, sans-serif',
        h1: {
            fontFamily: 'Montserrat',
            fontWeight: 700,
            fontSize: 40,
            color: mode === 'dark' ? '#FFFFFF' : '#191414',
        },
        h2: {
            fontFamily: 'Montserrat',
            fontWeight: 600,
            fontSize: 32,
            color: mode === 'dark' ? '#FFFFFF' : '#191414',
        },
        h3: {
            fontFamily: 'Montserrat',
            fontWeight: 500,
            fontSize: 24,
            color: mode === 'dark' ? '#FFFFFF' : '#191414',
            textAlign: 'center',
        },
        h4: {
            fontWeight: 600,
            textAlign: 'center',
            color: mode === 'dark' ? '#FFFFFF' : '#191414',
        },
        h5: {
            fontWeight: 600,
            textAlign: 'center',
            color: mode === 'dark' ? '#FFFFFF' : '#191414',
        },
        h6: {
            textAlign: 'center',
            color: mode === 'dark' ? '#B3B3B3' : '#555',
        },
        body1: {
            fontFamily: 'Inter',
            fontSize: 16,
            color: mode === 'dark' ? '#FFFFFF' : '#191414',
            textAlign: 'center',
        },
        body2: {
            fontFamily: 'Inter',
            fontSize: 14,
            color: mode === 'dark' ? '#B3B3B3' : '#555',
            textAlign: 'center',
        },
        caption: {
            fontFamily: 'Inter',
            fontSize: 12,
            fontWeight: 500,
            color: mode === 'dark' ? '#B3B3B3' : '#1DB954',
            textTransform: 'uppercase',
        },
        label: {
            fontFamily: 'Inter',
            fontSize: 12,
            fontWeight: 500,
            color: '#1DB954',
            textTransform: 'uppercase',
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: mode === 'dark' ? '0 4px 24px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.08)',
                    background: mode === 'dark' ? '#181818' : '#FFFFFF',
                    border: mode === 'dark' ? '1px solid #282828' : '1px solid #E0E0E0',
                    transition: 'box-shadow 0.3s, transform 0.3s',
                    '&:hover': {
                        boxShadow: mode === 'dark' ? '0 8px 32px rgba(29,185,84,0.18)' : '0 4px 16px rgba(29,185,84,0.10)',
                        background: mode === 'dark' ? '#282828' : '#F5F5F5',
                        transform: 'translateY(-5px) scale(1.03)',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    fontWeight: 600,
                    fontFamily: 'Montserrat',
                    textTransform: 'none',
                    transition: 'all 0.3s ease-out',
                    '&:hover': {
                        backgroundColor: '#1ED760',
                        filter: 'brightness(1.05)',
                        transform: 'scale(1.03)',
                    },
                },
                outlined: {
                    border: '1.5px solid #1DB954',
                    color: '#1DB954',
                    background: 'transparent',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    background: mode === 'dark' ? '#121212' : '#FFFFFF',
                    color: mode === 'dark' ? '#FFFFFF' : '#191414',
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                root: {
                    minHeight: 48,
                },
                indicator: {
                    backgroundColor: '#1DB954',
                    height: 4,
                    borderRadius: 2,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    fontSize: 16,
                    color: mode === 'dark' ? '#B3B3B3' : '#191414',
                    '&.Mui-selected': {
                        color: '#1DB954',
                    },
                    transition: 'color 0.3s, border-bottom 0.3s',
                    '&:hover': {
                        color: '#1ED760',
                        textDecoration: 'underline',
                    },
                },
            },
        },
    },
});

export const getTheme = (mode = 'dark') => createTheme(getDesignTokens(mode)); 