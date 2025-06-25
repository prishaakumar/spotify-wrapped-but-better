import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import PeopleIcon from '@mui/icons-material/People';
import MoodIcon from '@mui/icons-material/Mood';
import StarIcon from '@mui/icons-material/Star';
import PieChartIcon from '@mui/icons-material/PieChart';

const sections = [
    { text: 'Overview', icon: <DashboardIcon />, id: 'overview' },
    { text: 'Top Tracks', icon: <LibraryMusicIcon />, id: 'tracks' },
    { text: 'Top Artists', icon: <PeopleIcon />, id: 'artists' },
    { text: 'Sentiment', icon: <MoodIcon />, id: 'sentiment' },
    { text: 'Recommendations', icon: <StarIcon />, id: 'recommendations' },
    { text: 'Visualizations', icon: <PieChartIcon />, id: 'visualizations' },
];

function Sidebar({ onSectionChange }) {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 220,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: 220, boxSizing: 'border-box' },
            }}
        >
            <Toolbar />
            <List>
                {sections.map((section) => (
                    <ListItem button key={section.id} onClick={() => onSectionChange(section.id)}>
                        <ListItemIcon sx={{ color: 'inherit' }}>{section.icon}</ListItemIcon>
                        <ListItemText primary={section.text} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}

export default Sidebar; 