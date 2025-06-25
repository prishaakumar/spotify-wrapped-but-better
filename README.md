<<<<<<< HEAD
# 🎧 Spotify Wrapped, But Better

An interactive, modern web app that gives you **deeper, smarter, and more aesthetic insights** into your Spotify listening history—way beyond what Spotify Wrapped offers.

Upload your own streaming data and unlock analytics, mood insights, personalized recommendations, and stunning visualizations, all in a responsive Spotify-themed UI.

> ⚡ Think of it as your *AI-powered music diary*—but cooler.

---

## ✨ Features

- 📂 **Upload Your Data**: Drag & drop your `StreamingHistory_music_0.json` file.
- 📈 **Top Tracks & Artists**: View your most-played songs and artists with album covers and Spotify links.
- 🧠 **Sentiment Analysis**: Analyze the mood of your favorite tracks using lyrics and AI (TextBlob + Genius API).
- 🌀 **Genre & Time Insights**: Visualize listening habits by genre, time of day, and frequency.
- 💡 **Smart Recommendations**: Discover music you'll love based on your unique taste.
- 🎛️ **Interactive Dashboard**: Beautiful charts, light/dark mode, dynamic cards.
- 📋 **Unique Track & Artist Insights**: Explore every track and artist you've ever streamed.
- 📘 **Step-by-Step Spotify Data Help**: Clear guide for downloading your streaming history.

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/spotify-wrapped-but-better.git
cd spotify-wrapped-but-better
```

---

## ⚙️ Backend Setup (Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

* Runs at: `http://localhost:5000`

---

## 🌐 Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

* Runs at: `http://localhost:3000`

---

## 📥 How to Download Your Spotify Data

1. Go to [Spotify Privacy Settings](https://www.spotify.com/account/privacy).
2. Scroll to **Download your data** and click **Request data**.
3. Wait for an email from Spotify (may take a few days).
4. Download and unzip the file.
5. Locate `StreamingHistory_music_0.json`.
6. Upload it into the app to see your personalized insights.

---

## 🖥️ Usage Instructions

1. Open your browser and go to `http://localhost:3000`
2. Upload `StreamingHistory_music_0.json`
3. Enjoy your dashboard: charts, moods, top songs, and more!
4. Explore the "Unique Tracks" and "Unique Artists" tabs for the full archive.

---

## 🛠️ Tech Stack

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| Frontend  | React, Material UI, Chart.js            |
| Backend   | Flask (Python), Spotipy, Genius API     |
| Sentiment | TextBlob                                |
| Styling   | Custom Spotify-inspired CSS theme       |
| Hosting   | Localhost (dev) or Vercel/Render (prod) |

---

## 📁 Project Structure

```
spotify-wrapped-but-better/
│
├── backend/
│   ├── app.py
│   ├── routes/
│   └── utils/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   └── App.js
│
└── README.md
```

---

## 💡 Contributing

We'd love your help!

* ⭐ Star the repo if you like it
* 🐛 Found a bug? Open an issue
* 🎨 Have an idea? Fork and submit a PR
* 🧪 Add your own visualizations or improve analysis

---

## 📜 License

This project is licensed under the **MIT License**.

> Not affiliated with or endorsed by Spotify.

---

Made with 🎧 by [Your Name]
=======
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
>>>>>>> 2bc2e6c39a33e6918e045e9fe8f461db1e017fa1
