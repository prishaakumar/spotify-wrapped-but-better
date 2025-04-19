## Spotify Wrapped, But Better

An improved version of Spotify Wrapped that provides deeper insights into your music listening habits. This project leverages machine learning to analyze your Spotify data, including sentiment analysis on lyrics and artist prediction using collaborative filtering.

##Features

1.Top Tracks & Artists Analysis: Identify your most listened-to songs and artists.

2.Sentiment Analysis on Lyrics: Understand the mood of the songs you listen to most.

3.Artist Prediction (Collaborative Filtering): Recommends new artists based on your listening history.

4.Data Visualization: Beautiful charts to showcase your listening trends.

## Dataset

1.Uses Spotify's data export (JSON files from "Download your data" option).

2.Processes StreamingHistory.json for play counts and trends.

3.Uses additional APIs (e.g., Genius, Last.fm) for lyric and sentiment analysis.

## Tech Stack

1.Programming Language: Python

2.Libraries: Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn, TensorFlow/PyTorch

3.Web Scraping/APIs: Spotipy, Genius API

3.Framework for Deployment: Flask / Streamlit(optional)

4.Database: SQLite / MongoDB (optional for storing processed data)

## Installation

1.Clone the repository

git clone https://github.com/yourusername/spotify-wrapped-better.git
cd spotify-wrapped-better

2.Set up a virtual environment (optional but recommended)

python -m venv venv
source venv/bin/activate  # On Windows use 'venv\Scripts\activate'

3.Install dependencies

pip install -r requirements.txt

4.Run Jupyter Notebook (for analysis)

jupyter notebook

5.Run the Web App (if applicable)

streamlit run app.py  # or flask run

## Usage

Download your Spotify data from Spotify Data Request

Extract the StreamingHistory.json file and place it in the data/ folder.

Run the Jupyter notebook to analyse trends.

Use the web app (if implemented) to interactively explore your data.

## Results

Insights on most played tracks & artists.

Sentiment-based visualisation of favourite songs.

AI-powered recommendations.

Future Improvements

Integrate a real-time Spotify API for live updates.

Improve recommendation accuracy with deep learning models.

Add more interactive visualisations.

## Contributions

Contributions are welcome! Feel free to open an issue or submit a pull request
