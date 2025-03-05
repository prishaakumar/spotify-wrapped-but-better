Spotify Wrapped, But Better

An improved version of Spotify Wrapped that provides deeper insights into your music listening habits. This project leverages machine learning to analyze your Spotify data, including sentiment analysis on lyrics and artist prediction using collaborative filtering.

Features

Top Tracks & Artists Analysis: Identify your most listened-to songs and artists.

Sentiment Analysis on Lyrics: Understand the mood of the songs you listen to most.

Artist Prediction (Collaborative Filtering): Recommends new artists based on your listening history.

Data Visualization: Beautiful charts to showcase your listening trends.

Dataset

Uses Spotify's data export (JSON files from "Download your data" option).

Processes StreamingHistory.json for play counts and trends.

Uses additional APIs (e.g., Genius, Last.fm) for lyric and sentiment analysis.

Tech Stack

Programming Language: Python

Libraries: Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn, TensorFlow/PyTorch

Web Scraping/APIs: Spotipy, Genius API

Framework for Deployment: Flask / Streamlit

Database: SQLite / MongoDB (optional for storing processed data)

Installation

Clone the repository

git clone https://github.com/yourusername/spotify-wrapped-better.git
cd spotify-wrapped-better

Set up a virtual environment (optional but recommended)

python -m venv venv
source venv/bin/activate  # On Windows use 'venv\Scripts\activate'

Install dependencies

pip install -r requirements.txt

Run Jupyter Notebook (for analysis)

jupyter notebook

Run the Web App (if applicable)

streamlit run app.py  # or flask run

Usage

Download your Spotify data from Spotify Data Request

Extract the StreamingHistory.json file and place it in the data/ folder.

Run the Jupyter notebook to analyze trends.

Use the web app (if implemented) to interactively explore your data.

Results

Insights on most played tracks & artists.

Sentiment-based visualization of favorite songs.

AI-powered recommendations.

Future Improvements

Integrate a real-time Spotify API for live updates.

Improve recommendation accuracy with deep learning models.

Add more interactive visualizations.

Contributions

Contributions are welcome! Feel free to open an issue or submit a pull request
