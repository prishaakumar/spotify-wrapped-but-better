import React from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab, Box, useMediaQuery } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import PeopleIcon from '@mui/icons-material/People';
import MoodIcon from '@mui/icons-material/Mood';
import StarIcon from '@mui/icons-material/Star';
import PieChartIcon from '@mui/icons-material/PieChart';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const sections = [
    { label: 'Dashboard', id: 'overview', icon: <DashboardIcon /> },
    { label: 'Tracks', id: 'tracks', icon: <LibraryMusicIcon /> },
    { label: 'Artists', id: 'artists', icon: <PeopleIcon /> },
    { label: 'Sentiment', id: 'sentiment', icon: <MoodIcon /> },
    { label: 'Recommendations', id: 'recommendations', icon: <StarIcon /> },
    { label: 'Visualizations', id: 'visualizations', icon: <PieChartIcon /> },
];

function TopNavBar({ section, onSectionChange, mode, onToggleMode }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <AppBar position={isMobile ? 'fixed' : 'sticky'} color="background" elevation={2} sx={{ top: 0, bottom: isMobile ? 0 : 'auto', background: '#191414' }}>
            <Toolbar sx={{ justifyContent: isMobile ? 'center' : 'space-between', minHeight: 64 }}>
                {!isMobile && (
                    <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1, color: '#1DB954' }}>
                        <span style={{ fontWeight: 900, fontFamily: 'Montserrat' }}>Spotify Wrapped</span>
                    </Typography>
                )}
                <Box sx={{ flexGrow: 1, ml: isMobile ? 0 : 4 }}>
                    <Tabs
                        value={section}
                        onChange={(_, val) => onSectionChange(val)}
                        textColor="inherit"
                        indicatorColor="primary"
                        centered={isMobile}
                        variant={isMobile ? 'fullWidth' : 'standard'}
                        sx={{
                            minHeight: 48,
                            '.MuiTabs-indicator': {
                                background: 'linear-gradient(90deg, #1DB954 60%, #9B5DE5 100%)',
                                height: 4,
                                borderRadius: 2,
                                transition: 'all 0.3s',
                            },
                        }}
                    >
                        {sections.map((s) => (
                            <Tab
                                key={s.id}
                                label={
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                                        {s.icon}
                                        <span style={{ fontSize: 12, fontWeight: 600 }}>{s.label}</span>
                                    </Box>
                                }
                                value={s.id}
                                sx={{
                                    fontWeight: 600,
                                    color: section === s.id ? '#1DB954' : '#B3B3B3',
                                    minWidth: 80,
                                    transition: 'color 0.3s',
                                    '&:hover': {
                                        color: '#1ED760',
                                    },
                                    borderBottom: section === s.id ? '3px solid #1DB954' : '3px solid transparent',
                                }}
                            />
                        ))}
                    </Tabs>
                </Box>
                <IconButton sx={{ ml: 2 }} onClick={onToggleMode} color="inherit">
                    {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default TopNavBar; 