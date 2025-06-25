# 🎧 Spotify Wrapped, But Better

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Click%20Here-green?style=for-the-badge&logo=vercel)](https://spotify-wrapped-but-better.vercel.app)

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


Add more interactive visualisations.

## Contributions

Contributions are welcome! Feel free to open an issue or submit a pull request
