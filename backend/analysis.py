from dotenv import load_dotenv
load_dotenv()

import json
import pandas as pd
import os
from collections import Counter
from spotipy.oauth2 import SpotifyClientCredentials
import spotipy
import requests
from textblob import TextBlob

# --- Spotify API Setup ---
# You must set these environment variables before running the backend:
#   SPOTIPY_CLIENT_ID and SPOTIPY_CLIENT_SECRET
# You can get these from https://developer.spotify.com/dashboard

GENIUS_API_KEY = 'pmD2N4y2YG9PLXszf3XXOPXFUWHkdM5jbH7xbBfpXtSzUudNiNaPK0DzLmRnMsgz'
GENIUS_API_URL = 'https://api.genius.com'

SPOTIPY_CLIENT_ID = os.getenv('SPOTIPY_CLIENT_ID')
SPOTIPY_CLIENT_SECRET = os.getenv('SPOTIPY_CLIENT_SECRET')

if not SPOTIPY_CLIENT_ID or not SPOTIPY_CLIENT_SECRET:
    raise Exception("Please set SPOTIPY_CLIENT_ID and SPOTIPY_CLIENT_SECRET as environment variables.")

sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials())

def get_lyrics(track, artist):
    headers = {'Authorization': f'Bearer {GENIUS_API_KEY}'}
    search_url = f"{GENIUS_API_URL}/search"
    # Try with both track and artist
    queries = [f'{track} {artist}', track]
    for query in queries:
        params = {'q': query}
        try:
            response = requests.get(search_url, params=params, headers=headers, timeout=10)
            if response.status_code != 200:
                continue
            hits = response.json()['response']['hits']
            for hit in hits:
                # Try to match artist name (case-insensitive, partial)
                genius_artist = hit['result']['primary_artist']['name'].lower()
                if artist.lower() in genius_artist or genius_artist in artist.lower() or query == track:
                    song_path = hit['result']['path']
                    page_url = f'https://genius.com{song_path}'
                    try:
                        page = requests.get(page_url, timeout=10)
                        from bs4 import BeautifulSoup
                        html = BeautifulSoup(page.text, 'html.parser')
                        lyrics_div = html.find('div', class_='Lyrics__Container-sc-1ynbvzw-6')
                        if not lyrics_div:
                            lyrics_div = html.find('div', class_='lyrics')
                        if lyrics_div:
                            return lyrics_div.get_text(separator='\n')
                    except Exception as e:
                        print(f'Error scraping lyrics for {track} by {artist}:', e)
                        continue
        except Exception as e:
            print(f'Error searching Genius for {track} by {artist}:', e)
            continue
    print(f'Lyrics not found for {track} by {artist}')
    return None

def analyze_sentiment(lyrics):
    if not lyrics:
        return 0  # Neutral if no lyrics
    try:
        blob = TextBlob(lyrics)
        return blob.sentiment.polarity  # -1 (negative) to 1 (positive)
    except Exception as e:
        print(f"Error analyzing sentiment: {e}")
        return 0

def get_top_by_period(df, col, period, n=5):
    if 'endTime' not in df.columns:
        return {}
    df['endTime'] = pd.to_datetime(df['endTime'])
    df[period] = df['endTime'].dt.to_period(period[0].upper()).astype(str)
    grouped = df.groupby(period)[col].apply(lambda x: Counter(x).most_common(n)).to_dict()
    # Convert Counter output to list of dicts
    for k in grouped:
        grouped[k] = [{'name': name, 'count': count} for name, count in grouped[k]]
    return grouped

def run_analysis(filepath):
    # Load streaming history
    with open(filepath, encoding='utf-8') as f:
        data = json.load(f)
    df = pd.DataFrame(data)

    # Basic checks
    if 'trackName' not in df.columns or 'artistName' not in df.columns:
        return {'error': 'Invalid StreamingHistory.json format.'}

    # Top tracks
    top_tracks = Counter(df['trackName']).most_common(5)
    # Top artists
    top_artists = Counter(df['artistName']).most_common(5)

    # Fetch Spotify info for top tracks
    track_infos = []
    sentiment_scores = []
    for track, count in top_tracks:
        artist = df[df['trackName'] == track]['artistName'].iloc[0]
        q = f"track:{track} artist:{artist}"
        try:
            results = sp.search(q, type='track', limit=1)
            if results['tracks']['items']:
                item = results['tracks']['items'][0]
                album_art = item['album']['images'][0]['url'] if item['album']['images'] else None
                spotify_url = item['external_urls']['spotify']
            else:
                album_art = None
                spotify_url = None
        except Exception:
            album_art = None
            spotify_url = None
        # Sentiment analysis
        lyrics = get_lyrics(track, artist)
        sentiment = analyze_sentiment(lyrics)
        if lyrics is None:
            print(f"No lyrics for {track} by {artist}, sentiment set to 0.")
        else:
            print(f"Sentiment for {track} by {artist}: {sentiment}")
        sentiment_scores.append(sentiment)
        track_infos.append({
            'name': track,
            'artist': artist,
            'count': count,
            'album_art': album_art,
            'spotify_url': spotify_url,
            'sentiment': sentiment
        })

    # Fetch Spotify info for top artists
    artist_infos = []
    for artist, count in top_artists:
        try:
            results = sp.search(q=f"artist:{artist}", type='artist', limit=1)
            if results['artists']['items']:
                item = results['artists']['items'][0]
                image = item['images'][0]['url'] if item['images'] else None
                spotify_url = item['external_urls']['spotify']
            else:
                image = None
                spotify_url = None
        except Exception:
            image = None
            spotify_url = None
        artist_infos.append({
            'name': artist,
            'count': count,
            'image': image,
            'spotify_url': spotify_url
        })

    # Sentiment summary
    avg_sentiment = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0
    if avg_sentiment > 0.2:
        sentiment_summary = 'Mostly Positive'
    elif avg_sentiment < -0.2:
        sentiment_summary = 'Mostly Negative'
    else:
        sentiment_summary = 'Mixed/Neutral'

    # Enhanced Recommendations: fetch related artists from Spotify
    recommended_artists = {}
    user_top_artist_names = set([a[0] for a in top_artists])
    for artist, _ in top_artists:
        try:
            results = sp.search(q=f"artist:{artist}", type='artist', limit=1)
            if results['artists']['items']:
                artist_id = results['artists']['items'][0]['id']
                related = sp.artist_related_artists(artist_id)
                for rel_artist in related['artists']:
                    rel_name = rel_artist['name']
                    if rel_name not in user_top_artist_names and rel_name not in recommended_artists:
                        recommended_artists[rel_name] = {
                            'name': rel_name,
                            'image': rel_artist['images'][0]['url'] if rel_artist['images'] else None,
                            'spotify_url': rel_artist['external_urls']['spotify']
                        }
        except Exception:
            continue
    # Limit to top 6 recommendations
    recommendations = list(recommended_artists.values())[:6]

    # --- Song Recommendations ---
    user_tracks = set(df['trackName'])
    recommended_songs = {}
    for artist, _ in top_artists:
        try:
            results = sp.search(q=f"artist:{artist}", type='artist', limit=1)
            if results['artists']['items']:
                artist_id = results['artists']['items'][0]['id']
                top_tracks = sp.artist_top_tracks(artist_id)['tracks']
                for t in top_tracks:
                    if t['name'] not in user_tracks and t['name'] not in recommended_songs:
                        recommended_songs[t['name']] = {
                            'name': t['name'],
                            'artist': t['artists'][0]['name'],
                            'album_art': t['album']['images'][0]['url'] if t['album']['images'] else None,
                            'spotify_url': t['external_urls']['spotify']
                        }
        except Exception:
            continue
    # Limit to top 6 recommended songs
    recommended_songs_list = list(recommended_songs.values())[:6]

    # --- Album Recommendations ---
    user_albums = set()
    if 'albumName' in df.columns:
        user_albums = set(df['albumName'])
    recommended_albums = {}
    for artist, _ in top_artists:
        try:
            results = sp.search(q=f"artist:{artist}", type='artist', limit=1)
            if results['artists']['items']:
                artist_id = results['artists']['items'][0]['id']
                albums = sp.artist_albums(artist_id, album_type='album')['items']
                for alb in albums:
                    if alb['name'] not in user_albums and alb['name'] not in recommended_albums:
                        recommended_albums[alb['name']] = {
                            'name': alb['name'],
                            'artist': alb['artists'][0]['name'],
                            'cover_art': alb['images'][0]['url'] if alb['images'] else None,
                            'spotify_url': alb['external_urls']['spotify']
                        }
        except Exception:
            continue
    # Limit to top 6 recommended albums
    recommended_albums_list = list(recommended_albums.values())[:6]

    # --- Genre Distribution ---
    genre_counter = Counter()
    for artist, _ in top_artists:
        try:
            results = sp.search(q=f"artist:{artist}", type='artist', limit=1)
            if results['artists']['items']:
                genres = results['artists']['items'][0]['genres']
                genre_counter.update(genres)
        except Exception:
            continue
    genre_distribution = dict(genre_counter)

    # --- Listening Activity Time Series ---
    activity = {}
    if 'endTime' in df.columns:
        df['endTime'] = pd.to_datetime(df['endTime'])
        df['month'] = df['endTime'].dt.to_period('M').astype(str)
        activity = df.groupby('month').size().to_dict()

    # Monthly and yearly top tracks/artists
    top_tracks_by_month = get_top_by_period(df, 'trackName', 'month', 5)
    top_tracks_by_year = get_top_by_period(df, 'trackName', 'year', 5)
    top_artists_by_month = get_top_by_period(df, 'artistName', 'month', 5)
    top_artists_by_year = get_top_by_period(df, 'artistName', 'year', 5)

    # --- Monthly and Average Daily Streaming Minutes ---
    monthly_minutes = {}
    avg_daily_minutes = {}
    if 'endTime' in df.columns and 'msPlayed' in df.columns:
        df['endTime'] = pd.to_datetime(df['endTime'])
        df['month'] = df['endTime'].dt.to_period('M').astype(str)
        df['date'] = df['endTime'].dt.date
        df['minutesPlayed'] = df['msPlayed'] / (1000 * 60)
        monthly_minutes = df.groupby('month')['minutesPlayed'].sum().to_dict()
        # For each month, calculate average daily minutes
        for month, group in df.groupby('month'):
            daily = group.groupby('date')['minutesPlayed'].sum()
            avg_daily_minutes[month] = daily.mean()

    return {
        'top_tracks': track_infos,
        'top_artists': artist_infos,
        'sentiment': sentiment_summary,
        'sentiment_scores': sentiment_scores,
        'recommendations': recommendations,
        'recommended_songs': recommended_songs_list,
        'recommended_albums': recommended_albums_list,
        'genre_distribution': genre_distribution,
        'listening_activity': activity,
        'top_tracks_by_month': top_tracks_by_month,
        'top_tracks_by_year': top_tracks_by_year,
        'top_artists_by_month': top_artists_by_month,
        'top_artists_by_year': top_artists_by_year,
        'monthly_streaming_minutes': monthly_minutes,
        'average_daily_streaming_minutes': avg_daily_minutes
    } 