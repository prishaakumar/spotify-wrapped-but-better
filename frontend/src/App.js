import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import TopNavBar from './TopNavBar';
import { Box, Toolbar, Container, Typography, Button, CircularProgress, Card, CardContent, Avatar, Link, Grid, ToggleButton, ToggleButtonGroup, Select, MenuItem, FormControl, InputLabel, Skeleton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import PersonIcon from '@mui/icons-material/Person';
import MoodIcon from '@mui/icons-material/Mood';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CategoryIcon from '@mui/icons-material/Category';
import { getTheme } from './theme';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import '@fontsource/montserrat';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function App() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const [section, setSection] = useState('overview');
    const [trackFilterType, setTrackFilterType] = useState('month');
    const [artistFilterType, setArtistFilterType] = useState('month');
    const [selectedTrackPeriod, setSelectedTrackPeriod] = useState('');
    const [selectedArtistPeriod, setSelectedArtistPeriod] = useState('');
    const [mode, setMode] = useState('dark');
    const [openTracks, setOpenTracks] = useState(false);
    const [openArtists, setOpenArtists] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError('');
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file.');
            return;
        }
        setLoading(true);
        setError('');
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch(`${BASE_URL}/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError('Upload failed.');
        }
        setLoading(false);
    };

    // Get available months/years from results
    const months = results && results.top_tracks_by_month ? Object.keys(results.top_tracks_by_month) : [];
    const years = results && results.top_tracks_by_year ? Object.keys(results.top_tracks_by_year) : [];
    const artistMonths = results && results.top_artists_by_month ? Object.keys(results.top_artists_by_month) : [];
    const artistYears = results && results.top_artists_by_year ? Object.keys(results.top_artists_by_year) : [];

    // Set default period when results change
    React.useEffect(() => {
        if (months.length > 0 && !selectedTrackPeriod) setSelectedTrackPeriod(months[0]);
        if (artistMonths.length > 0 && !selectedArtistPeriod) setSelectedArtistPeriod(artistMonths[0]);
    }, [results]);

    // Get filtered top tracks/artists
    const filteredTracks = React.useMemo(() => {
        if (!results) return [];
        if (trackFilterType === 'month' && selectedTrackPeriod && results.top_tracks_by_month[selectedTrackPeriod]) {
            return results.top_tracks_by_month[selectedTrackPeriod];
        }
        if (trackFilterType === 'year' && selectedTrackPeriod && results.top_tracks_by_year[selectedTrackPeriod]) {
            return results.top_tracks_by_year[selectedTrackPeriod];
        }
        return results.top_tracks;
    }, [results, trackFilterType, selectedTrackPeriod]);

    const filteredArtists = React.useMemo(() => {
        if (!results) return [];
        if (artistFilterType === 'month' && selectedArtistPeriod && results.top_artists_by_month[selectedArtistPeriod]) {
            return results.top_artists_by_month[selectedArtistPeriod];
        }
        if (artistFilterType === 'year' && selectedArtistPeriod && results.top_artists_by_year[selectedArtistPeriod]) {
            return results.top_artists_by_year[selectedArtistPeriod];
        }
        return results.top_artists;
    }, [results, artistFilterType, selectedArtistPeriod]);

    // Chart data for top tracks
    const trackChartData = results ? {
        labels: filteredTracks.map(t => t.name),
        datasets: [
            {
                label: 'Play Count',
                data: filteredTracks.map(t => t.count),
                backgroundColor: '#AEE6FA',
                borderColor: '#181C2A',
                borderWidth: 2,
            },
        ],
    } : null;

    // Chart data for top artists
    const artistChartData = results ? {
        labels: filteredArtists.map(a => a.name),
        datasets: [
            {
                label: 'Play Count',
                data: filteredArtists.map(a => a.count),
                backgroundColor: '#F5E3DA',
                borderColor: '#181C2A',
                borderWidth: 2,
            },
        ],
    } : null;

    // Sentiment chart for top tracks
    const sentimentChartData = results ? {
        labels: filteredTracks.map(t => t.name),
        datasets: [
            {
                label: 'Sentiment Polarity',
                data: results.sentiment_scores,
                backgroundColor: results.sentiment_scores.map(s => s > 0.2 ? '#AEE6FA' : s < -0.2 ? '#F5E3DA' : '#B8E3F6'),
                borderColor: '#181C2A',
                borderWidth: 2,
            },
        ],
    } : null;

    // Genre Pie Chart Data
    const genrePieData = results && results.genre_distribution && Object.keys(results.genre_distribution).length > 0 ? {
        labels: Object.keys(results.genre_distribution),
        datasets: [
            {
                data: Object.values(results.genre_distribution),
                backgroundColor: [
                    '#1A237E', '#00B8A9', '#FFB300', '#F4F6F8', '#757575', '#B2DFDB', '#FFD54F', '#C5CAE9', '#FF8A65', '#81C784'
                ],
            },
        ],
    } : null;

    // Listening Activity Line Chart Data
    const activityLineData = results && results.listening_activity && Object.keys(results.listening_activity).length > 0 ? {
        labels: Object.keys(results.listening_activity),
        datasets: [
            {
                label: 'Listening Activity',
                data: Object.values(results.listening_activity),
                fill: false,
                borderColor: '#1A237E',
                backgroundColor: '#00B8A9',
                tension: 0.3,
            },
        ],
    } : null;

    // Monthly Streaming Minutes Bar Chart Data
    const monthlyMinutesData = results && results.monthly_streaming_minutes && Object.keys(results.monthly_streaming_minutes).length > 0 ? {
        labels: Object.keys(results.monthly_streaming_minutes),
        datasets: [
            {
                label: 'Monthly Streaming Minutes',
                data: Object.values(results.monthly_streaming_minutes),
                backgroundColor: '#FFB300',
                borderColor: '#1A237E',
                borderWidth: 2,
            },
        ],
    } : null;

    // Average Daily Streaming Minutes Line Chart Data
    const avgDailyMinutesData = results && results.average_daily_streaming_minutes && Object.keys(results.average_daily_streaming_minutes).length > 0 ? {
        labels: Object.keys(results.average_daily_streaming_minutes),
        datasets: [
            {
                label: 'Avg Daily Streaming Minutes',
                data: Object.values(results.average_daily_streaming_minutes),
                fill: false,
                borderColor: '#FF4081',
                backgroundColor: '#FFB300',
                tension: 0.3,
            },
        ],
    } : null;

    // Overall average daily streaming minutes
    const overallAvgDaily = avgDailyMinutesData && avgDailyMinutesData.datasets[0].data.length > 0
        ? (avgDailyMinutesData.datasets[0].data.reduce((a, b) => a + b, 0) / avgDailyMinutesData.datasets[0].data.length).toFixed(1)
        : null;

    // Summary card data
    const topTrack = results && results.top_tracks && results.top_tracks[0];
    const topArtist = results && results.top_artists && results.top_artists[0];
    const mood = results && results.sentiment ? results.sentiment : 'No Data';
    const totalMinutes = results && results.monthly_streaming_minutes ? Object.values(results.monthly_streaming_minutes).reduce((a, b) => a + b, 0).toFixed(0) : 0;
    const avgDaily = overallAvgDaily || 0;
    const uniqueArtists = results && results.top_artists ? results.top_artists.length : 0;
    const uniqueTracks = results && results.top_tracks ? results.top_tracks.length : 0;
    const genreDist = results && results.genre_distribution ? results.genre_distribution : {};
    const sortedGenres = Object.entries(genreDist).sort((a, b) => b[1] - a[1]);
    const mostCommonGenre = sortedGenres.length > 0 ? sortedGenres[0][0] : 'N/A';
    const mostCommonGenreCount = sortedGenres.length > 0 ? sortedGenres[0][1] : 0;

    // Mood emoji
    const moodEmoji = mood.includes('Positive') ? '😄' : mood.includes('Negative') ? '😢' : mood.includes('Mixed') ? '😐' : '🤔';

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            x: {
                ticks: { color: '#FFFFFF' },
                grid: { color: '#23263A' },
            },
            y: {
                ticks: { color: '#FFFFFF' },
                grid: { color: '#23263A' },
            },
        },
    };

    // Debug logs for visualization data
    console.log('monthly_streaming_minutes', results?.monthly_streaming_minutes);
    console.log('average_daily_streaming_minutes', results?.average_daily_streaming_minutes);

    return (
        <ThemeProvider theme={getTheme(mode)}>
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
                <TopNavBar section={section} onSectionChange={setSection}
                    mode={mode}
                    onToggleMode={() => setMode(mode === 'dark' ? 'light' : 'dark')}
                />
                <Toolbar />
                <Box component="main" sx={{ maxWidth: '1200px', mx: 'auto', p: 4 }}>
                    {section === 'overview' && (
                        <>
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    mb: 4,
                                    py: 7,
                                    borderRadius: 3,
                                    background: theme => theme.palette.mode === 'dark' ? '#181818' : '#F5F5F5',
                                    color: theme => theme.palette.text.primary,
                                    boxShadow: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                }}
                            >
                                <Box sx={{
                                    width: '100%',
                                    maxWidth: 600,
                                    mx: 'auto',
                                    mb: 3,
                                    px: 2,
                                    py: 1.5,
                                    borderRadius: 1,
                                    background: 'transparent',
                                    color: theme => theme.palette.text.secondary,
                                    fontFamily: 'Montserrat, Arial, sans-serif',
                                    fontSize: 15,
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    borderBottom: theme => `1px solid ${theme.palette.divider}`,
                                    justifyContent: 'center',
                                }}>
                                    <InfoOutlinedIcon sx={{ mr: 1, mt: 0.2, color: theme => theme.palette.text.secondary, fontSize: 22 }} />
                                    <span>
                                        <b>How to get your Spotify data:</b> Go to <a href="https://www.spotify.com/account/privacy/" target="_blank" rel="noopener noreferrer" style={{ color: '#1DB954', fontWeight: 600 }}>Spotify Privacy Settings</a>, request your data, and upload <b>StreamingHistory_music_0.json</b> here. <span style={{ fontWeight: 400 }}>(See details below if needed.)</span>
                                    </span>
                                </Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontFamily: 'Montserrat, Arial, sans-serif',
                                        fontWeight: 800,
                                        fontSize: { xs: 24, sm: 32, md: 36 },
                                        mb: 2,
                                        letterSpacing: 0.5,
                                    }}
                                >
                                    Your Spotify history? We're judging. Lovingly. <span role="img" aria-label="nail polish">💅</span>
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontFamily: 'Montserrat, Arial, sans-serif',
                                        fontWeight: 400,
                                        mb: 4,
                                        color: theme => theme.palette.text.secondary,
                                        maxWidth: 480,
                                    }}
                                >
                                    We'll analyze your listening history and show you insights, trends, and recommendations.
                                </Typography>
                                <Button
                                    variant="contained"
                                    component="label"
                                    startIcon={<CloudUploadIcon />}
                                    color="primary"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: 18,
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 2,
                                        boxShadow: 'none',
                                        mb: 2,
                                        textTransform: 'none',
                                    }}
                                >
                                    Upload File
                                    <input type="file" hidden onChange={handleFileChange} />
                                </Button>
                                {file && <Typography color="primary" sx={{ mt: 1, fontWeight: 500 }}>{file.name}</Typography>}
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleUpload}
                                    disabled={loading}
                                    sx={{ fontWeight: 700, ml: 2, fontSize: 18, px: 4, py: 1.5, borderRadius: 2, textTransform: 'none', mt: 3 }}
                                >
                                    Analyze
                                </Button>
                                {loading && <CircularProgress color="primary" sx={{ ml: 2 }} />}
                                {error && <Typography color="error.main" sx={{ mt: 2 }}>{error}</Typography>}
                            </Box>
                            {loading ? (
                                <Grid container spacing={3} justifyContent="center">
                                    {[...Array(7)].map((_, i) => (
                                        <Grid item xs={12} sm={6} md={4} key={i}>
                                            <Card>
                                                <CardContent>
                                                    <Skeleton variant="circular" width={40} height={40} sx={{ mb: 1, mx: 'auto' }} />
                                                    <Skeleton variant="text" width={100} height={28} sx={{ mx: 'auto', mb: 1 }} />
                                                    <Skeleton variant="rectangular" width={80} height={36} sx={{ mx: 'auto', mb: 1 }} />
                                                    <Skeleton variant="text" width={60} height={20} sx={{ mx: 'auto' }} />
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : results && (
                                <Grid container spacing={3} justifyContent="center">
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Card sx={{ minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, Arial, sans-serif' }}>
                                                <EmojiEventsIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                                <Typography variant="h6">Top Track</Typography>
                                                {topTrack ? (
                                                    <>
                                                        <Avatar src={topTrack.album_art} alt={topTrack.name} sx={{ width: 56, height: 56, mx: 'auto', mb: 1 }} />
                                                        <Typography variant="subtitle1">{topTrack.name}</Typography>
                                                        <Typography variant="body2" color="text.secondary">{topTrack.artist}</Typography>
                                                    </>
                                                ) : <Typography>No data</Typography>}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Card sx={{ minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, Arial, sans-serif' }}>
                                                <PersonIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                                                <Typography variant="h6">Top Artist</Typography>
                                                {topArtist ? (
                                                    <>
                                                        <Avatar src={topArtist.image} alt={topArtist.name} sx={{ width: 56, height: 56, mx: 'auto', mb: 1 }} />
                                                        <Typography variant="subtitle1">{topArtist.name}</Typography>
                                                    </>
                                                ) : <Typography>No data</Typography>}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Card sx={{ minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, Arial, sans-serif' }}>
                                                <MoodIcon color="accent" sx={{ fontSize: 40, mb: 1 }} />
                                                <Typography variant="h6">Your Mood</Typography>
                                                <Typography variant="h2" sx={{ mb: 1 }}>{moodEmoji}</Typography>
                                                <Typography variant="subtitle1">{mood}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Card sx={{ minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, Arial, sans-serif' }}>
                                                <AccessTimeIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                                                <Typography variant="h6">Total Minutes Streamed</Typography>
                                                <Typography variant="h4" color="primary.main">{totalMinutes}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Card sx={{ minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, Arial, sans-serif' }}>
                                                <AccessTimeIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                                                <Typography variant="h6">Avg Daily Minutes</Typography>
                                                <Typography variant="h4" color="primary.main">{avgDaily}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Card sx={{ minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, Arial, sans-serif' }}>
                                                <CategoryIcon color="accent" sx={{ fontSize: 40, mb: 1 }} />
                                                <Typography variant="h6">Most Common Genre</Typography>
                                                <Typography variant="h4" color="primary.main">{mostCommonGenre}</Typography>
                                                <Typography variant="body2" color="text.secondary">{mostCommonGenreCount} plays</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Card sx={{ minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: results ? 'pointer' : 'default' }} onClick={() => results && setOpenTracks(true)}>
                                            <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, Arial, sans-serif' }}>
                                                <LibraryMusicIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                                <Typography variant="h6">Unique Tracks</Typography>
                                                <Typography variant="h4" color="primary.main">{uniqueTracks}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Card sx={{ minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: results ? 'pointer' : 'default' }} onClick={() => results && setOpenArtists(true)}>
                                            <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, Arial, sans-serif' }}>
                                                <PersonIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                                                <Typography variant="h6">Unique Artists</Typography>
                                                <Typography variant="h4" color="primary.main">{uniqueArtists}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            )}
                        </>
                    )}
                    {section === 'tracks' && (
                        <Container maxWidth="lg">
                            <Box mt={4} width="100%">
                                <Card sx={{ mb: 4 }}>
                                    <CardContent>
                                        <Typography variant="h4" color="primary.main" sx={{ textAlign: 'center' }}>Top Tracks</Typography>
                                        <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={2}>
                                            <ToggleButtonGroup
                                                value={trackFilterType}
                                                exclusive
                                                onChange={(_, val) => val && setTrackFilterType(val)}
                                                color="primary"
                                                size="small"
                                            >
                                                <ToggleButton value="month">By Month</ToggleButton>
                                                <ToggleButton value="year">By Year</ToggleButton>
                                            </ToggleButtonGroup>
                                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                                <InputLabel>{trackFilterType === 'month' ? 'Month' : 'Year'}</InputLabel>
                                                <Select
                                                    value={selectedTrackPeriod}
                                                    label={trackFilterType === 'month' ? 'Month' : 'Year'}
                                                    onChange={e => setSelectedTrackPeriod(e.target.value)}
                                                >
                                                    {(trackFilterType === 'month' ? months : years).map((period) => (
                                                        <MenuItem value={period} key={period}>{period}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                        <Box sx={{ mb: 3 }}>
                                            {loading ? (
                                                <Skeleton variant="rectangular" width="100%" height={200} />
                                            ) : (
                                                <Bar data={trackChartData} options={chartOptions} height={200} />
                                            )}
                                        </Box>
                                        <Grid container spacing={2}>
                                            {filteredTracks.map((track, i) => (
                                                <Grid item xs={12} sm={6} md={4} key={i}>
                                                    <Card variant="outlined" sx={{ display: 'flex', alignItems: 'center', p: 1, bgcolor: 'background.paper' }}>
                                                        <Avatar
                                                            variant="square"
                                                            src={track.album_art}
                                                            alt={track.name}
                                                            sx={{ width: 56, height: 56, mr: 2 }}
                                                        />
                                                        <Box>
                                                            <Typography variant="subtitle1">
                                                                {track.spotify_url ? (
                                                                    <Link href={track.spotify_url} target="_blank" rel="noopener noreferrer" color="primary.main">
                                                                        {track.name}
                                                                    </Link>
                                                                ) : track.name}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {track.artist}
                                                            </Typography>
                                                            <Typography variant="caption">Plays: {track.count}</Typography>
                                                        </Box>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Container>
                    )}
                    {section === 'artists' && (
                        <Container maxWidth="lg">
                            <Box mt={4} width="100%">
                                <Card sx={{ mb: 4 }}>
                                    <CardContent>
                                        <Typography variant="h4" color="primary.main" sx={{ textAlign: 'center' }}>Top Artists</Typography>
                                        <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={2}>
                                            <ToggleButtonGroup
                                                value={artistFilterType}
                                                exclusive
                                                onChange={(_, val) => val && setArtistFilterType(val)}
                                                color="primary"
                                                size="small"
                                            >
                                                <ToggleButton value="month">By Month</ToggleButton>
                                                <ToggleButton value="year">By Year</ToggleButton>
                                            </ToggleButtonGroup>
                                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                                <InputLabel>{artistFilterType === 'month' ? 'Month' : 'Year'}</InputLabel>
                                                <Select
                                                    value={selectedArtistPeriod}
                                                    label={artistFilterType === 'month' ? 'Month' : 'Year'}
                                                    onChange={e => setSelectedArtistPeriod(e.target.value)}
                                                >
                                                    {(artistFilterType === 'month' ? artistMonths : artistYears).map((period) => (
                                                        <MenuItem value={period} key={period}>{period}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                        <Box sx={{ mb: 3 }}>
                                            {loading ? (
                                                <Skeleton variant="rectangular" width="100%" height={200} />
                                            ) : (
                                                <Bar data={artistChartData} options={chartOptions} height={200} />
                                            )}
                                        </Box>
                                        <Grid container spacing={2}>
                                            {loading ? (
                                                [...Array(6)].map((_, i) => (
                                                    <Grid item xs={12} sm={6} md={4} key={i}>
                                                        <Card variant="outlined" sx={{ display: 'flex', alignItems: 'center', p: 1, bgcolor: 'background.paper' }}>
                                                            <Skeleton variant="circular" width={56} height={56} sx={{ mr: 2 }} />
                                                            <Box sx={{ flex: 1 }}>
                                                                <Skeleton variant="text" width={100} height={24} />
                                                                <Skeleton variant="text" width={60} height={16} />
                                                            </Box>
                                                        </Card>
                                                    </Grid>
                                                ))
                                            ) : (
                                                filteredArtists.map((artist, i) => (
                                                    <Grid item xs={12} sm={6} md={4} key={i}>
                                                        <Card variant="outlined" sx={{ display: 'flex', alignItems: 'center', p: 1, bgcolor: 'background.paper' }}>
                                                            <Avatar
                                                                src={artist.image}
                                                                alt={artist.name}
                                                                sx={{ width: 56, height: 56, mr: 2 }}
                                                            />
                                                            <Box>
                                                                <Typography variant="subtitle1">
                                                                    {artist.spotify_url ? (
                                                                        <Link href={artist.spotify_url} target="_blank" rel="noopener noreferrer" color="primary.main">
                                                                            {artist.name}
                                                                        </Link>
                                                                    ) : artist.name}
                                                                </Typography>
                                                                <Typography variant="caption">Plays: {artist.count}</Typography>
                                                            </Box>
                                                        </Card>
                                                    </Grid>
                                                ))
                                            )}
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Container>
                    )}
                    {section === 'sentiment' && (
                        <Container maxWidth="lg">
                            <Card sx={{ mb: 4 }}>
                                <CardContent>
                                    <Typography variant="h4" color="primary.main" sx={{ textAlign: 'center' }}>Sentiment</Typography>
                                    <Typography sx={{ mb: 2 }}>{results?.sentiment}</Typography>
                                    {loading ? (
                                        <Skeleton variant="rectangular" width="100%" height={150} />
                                    ) : (
                                        <Bar data={sentimentChartData} options={{
                                            ...chartOptions,
                                            scales: {
                                                ...chartOptions.scales,
                                                y: {
                                                    ...chartOptions.scales.y,
                                                    min: -1,
                                                    max: 1,
                                                    title: { display: true, text: 'Polarity (-1 = Negative, 1 = Positive)', color: '#FFFFFF' }
                                                }
                                            }
                                        }} height={150} />
                                    )}
                                </CardContent>
                            </Card>
                        </Container>
                    )}
                    {section === 'recommendations' && (
                        <Container maxWidth="lg">
                            <Typography variant="h4" color="primary.main" sx={{ mb: 2, textAlign: 'center' }}>Recommended Songs</Typography>
                            <Grid container spacing={2} mb={4}>
                                {loading ? (
                                    [...Array(6)].map((_, i) => (
                                        <Grid item xs={12} sm={6} md={4} key={i}>
                                            <Card sx={{ minWidth: 320, minHeight: 110, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', p: 1, bgcolor: theme => theme.palette.background.paper, boxShadow: 1 }}>
                                                <CardContent sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                    <Skeleton variant="circular" width={56} height={56} sx={{ mr: 2 }} />
                                                    <Box sx={{ flex: 1 }}>
                                                        <Skeleton variant="text" width={100} height={24} />
                                                        <Skeleton variant="text" width={60} height={16} />
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))
                                ) : results && results.recommended_songs && results.recommended_songs.length > 0 ? (
                                    results.recommended_songs.map((song, i) => (
                                        <Grid item xs={12} sm={6} md={4} key={i}>
                                            <Card sx={{ minWidth: 320, minHeight: 110, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', p: 1, bgcolor: theme => theme.palette.background.paper, boxShadow: 1 }}>
                                                <CardContent sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                    <Avatar
                                                        variant="square"
                                                        src={song.album_art}
                                                        alt={song.name}
                                                        sx={{ width: 56, height: 56, mr: 2 }}
                                                    />
                                                    <Box>
                                                        <Typography variant="subtitle1">
                                                            {song.spotify_url ? (
                                                                <Link href={song.spotify_url} target="_blank" rel="noopener noreferrer" color="primary.main">
                                                                    {song.name}
                                                                </Link>
                                                            ) : song.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {song.artist}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))
                                ) : (
                                    <Typography>No song recommendations available.</Typography>
                                )}
                            </Grid>
                            <Typography variant="h4" color="primary.main" sx={{ mb: 2, mt: 4, textAlign: 'center' }}>Recommended Albums</Typography>
                            <Grid container spacing={2}>
                                {loading ? (
                                    [...Array(6)].map((_, i) => (
                                        <Grid item xs={12} sm={6} md={4} key={i}>
                                            <Card sx={{ minWidth: 320, minHeight: 110, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', p: 1, bgcolor: theme => theme.palette.background.paper, boxShadow: 1 }}>
                                                <CardContent sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                    <Skeleton variant="circular" width={56} height={56} sx={{ mr: 2 }} />
                                                    <Box sx={{ flex: 1 }}>
                                                        <Skeleton variant="text" width={100} height={24} />
                                                        <Skeleton variant="text" width={60} height={16} />
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))
                                ) : results && results.recommended_albums && results.recommended_albums.length > 0 ? (
                                    results.recommended_albums.map((album, i) => (
                                        <Grid item xs={12} sm={6} md={4} key={i}>
                                            <Card sx={{ minWidth: 320, minHeight: 110, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', p: 1, bgcolor: theme => theme.palette.background.paper, boxShadow: 1 }}>
                                                <CardContent sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                    <Avatar
                                                        variant="square"
                                                        src={album.cover_art}
                                                        alt={album.name}
                                                        sx={{ width: 56, height: 56, mr: 2 }}
                                                    />
                                                    <Box>
                                                        <Typography variant="subtitle1">
                                                            {album.spotify_url ? (
                                                                <Link href={album.spotify_url} target="_blank" rel="noopener noreferrer" color="primary.main">
                                                                    {album.name}
                                                                </Link>
                                                            ) : album.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {album.artist}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))
                                ) : (
                                    <Typography>No album recommendations available.</Typography>
                                )}
                            </Grid>
                        </Container>
                    )}
                    {section === 'visualizations' && (
                        <Container maxWidth="lg">
                            <Card sx={{ mb: 4 }}>
                                <CardContent>
                                    <Typography variant="h4" color="primary.main" sx={{ textAlign: 'center' }}>Genre Distribution</Typography>
                                    {loading ? (
                                        <Skeleton variant="rectangular" width="100%" height={120} />
                                    ) : (
                                        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2} mt={2}>
                                            {sortedGenres.length > 0 ? (
                                                sortedGenres.map(([genre, count], idx) => (
                                                    <Box key={genre} sx={{
                                                        bgcolor: idx === 0 ? 'accent.main' : 'background.paper',
                                                        color: idx === 0 ? 'primary.main' : 'text.primary',
                                                        borderRadius: 3,
                                                        boxShadow: 2,
                                                        px: 3,
                                                        py: 2,
                                                        minWidth: 120,
                                                        textAlign: 'center',
                                                        fontWeight: idx === 0 ? 700 : 500,
                                                        border: idx === 0 ? '2px solid #FFD166' : '1px solid #E0E0E0',
                                                    }}>
                                                        <Typography variant="h6" sx={{ fontWeight: idx === 0 ? 700 : 500 }}>{genre}</Typography>
                                                        <Typography variant="body1">{count} plays</Typography>
                                                        {idx === 0 && <Typography variant="caption" color="secondary">Most Common</Typography>}
                                                    </Box>
                                                ))
                                            ) : (
                                                <Typography>No genre data available.</Typography>
                                            )}
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                            <Card sx={{ mb: 4 }}>
                                <CardContent>
                                    <Typography variant="h4" color="primary.main" sx={{ textAlign: 'center' }}>Monthly Streaming Minutes</Typography>
                                    {loading ? (
                                        <Skeleton variant="rectangular" width="100%" height={200} />
                                    ) : (
                                        <Bar data={monthlyMinutesData} options={chartOptions} />
                                    )}
                                </CardContent>
                            </Card>
                            <Card sx={{ mb: 4 }}>
                                <CardContent>
                                    <Typography variant="h4" color="primary.main" sx={{ textAlign: 'center' }}>Average Daily Streaming Minutes (per Month)</Typography>
                                    {loading ? (
                                        <Skeleton variant="rectangular" width="100%" height={200} />
                                    ) : (
                                        <Line data={avgDailyMinutesData} />
                                    )}
                                    {overallAvgDaily && !loading && (
                                        <Typography variant="h6" color="secondary.main" sx={{ mt: 2, textAlign: 'center' }}>
                                            Overall Average Daily Streaming Minutes: {overallAvgDaily}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    <Typography variant="h4" color="primary.main" sx={{ textAlign: 'center' }}>Listening Activity Over Time</Typography>
                                    {loading ? (
                                        <Skeleton variant="rectangular" width="100%" height={200} />
                                    ) : (
                                        <Line data={activityLineData} />
                                    )}
                                </CardContent>
                            </Card>
                        </Container>
                    )}
                </Box>
            </Box>
            <Dialog open={openTracks} onClose={() => setOpenTracks(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Unique Tracks You Listened To</DialogTitle>
                <DialogContent dividers sx={{ maxHeight: 400 }}>
                    <List dense>
                        {results && results.top_tracks && results.top_tracks.map((track, i) => (
                            <ListItem key={i}>
                                <ListItemText primary={track.name} secondary={track.artist} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
            <Dialog open={openArtists} onClose={() => setOpenArtists(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Unique Artists You Listened To</DialogTitle>
                <DialogContent dividers sx={{ maxHeight: 400 }}>
                    <List dense>
                        {results && results.top_artists && results.top_artists.map((artist, i) => (
                            <ListItem key={i}>
                                <ListItemText primary={artist.name} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </ThemeProvider>
    );
}

export default App; 