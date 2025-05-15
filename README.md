# Qurani

Qurani is a beautifully designed, modern web application for reading, listening, and learning the Holy Quran. Built by **Elshaibi**, it offers a seamless experience with a focus on accessibility, speed, and elegant UI.

---

## 🌟 Features

- **Browse All Surahs:** Explore all Quranic chapters with details and audio.
- **Reciters Gallery:** Listen to recitations from a wide selection of famous reciters.
- **Audio Player:** Advanced player with queue, play-all, and progress tracking.
- **SVG Quran Pages:** View high-quality Quran pages as SVG images.
- **User Authentication:** Secure login/register with Google support.
- **Favorites & Libraries:** Bookmark surahs and manage your personal library.
- **Live Streams:** Watch live Makkah & Madinah streams.
- **Multi-language:** English & Arabic support with instant switching.
- **Responsive Design:** Optimized for mobile and desktop.
- **Modern UI:** Smooth transitions, skeleton loaders, and dark mode.
- **Reciter Info:** AI-powered reciter descriptions and images.
- **Settings:** Customize playback quality and language.

---

## 🛠️ Tech Stack

- **Frontend:** [React](https://react.dev/), [Vite](https://vitejs.dev/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Routing:** [React Router](https://reactrouter.com/)
- **Authentication:** [Firebase](https://firebase.google.com/)
- **APIs:** [mp3quran.net](https://mp3quran.net/api/), [Google Custom Search](https://developers.google.com/custom-search/v1/overview), [Google Gemini AI](https://ai.google.dev/)
- **Icons:** [React Icons](https://react-icons.github.io/react-icons/)
- **Deployment:** [Vercel](https://vercel.com/)
- **Linting:** [ESLint](https://eslint.org/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm

### Installation

```sh
git clone https://github.com/MustafaElshaibi/qurani.git
cd qurani
npm install
```

### Development

```sh
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```sh
npm run build
```

### Lint

```sh
npm run lint
```

---

## 📁 Project Structure

```
src/
  App.jsx
  main.jsx
  index.css
  assets/
    font/
    images/
  auth/
  components/
    commen/
    libraries/
    uncommen/
  pages/
    AllReciters.jsx
    AllSurah.jsx
    Error.jsx
    Home.jsx
    ListSurahOfReciter.jsx
    LiveList.jsx
    Login.jsx
    Profile.jsx
    Register.jsx
    Settings.jsx
    SurahInfoPage.jsx
  rtk/
    store.js
    Reducers/
    Services/
  services/
  utility/
```

---

## 📚 Credits

- Quranic text and audio from [mp3quran.net](https://mp3quran.net/)
- Fonts by [elharrakfonts.com](https://elharrakfonts.com) (see `src/assets/font/Quran Surah 2/COPYRIGHT.txt`)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- Developed with ❤️ by **Elshaibi**

---

## 📝 License

This project is for educational and personal use it doesn't have any license if you want to inhance then god bless you. Please review font and API licenses before deploying commercially.

---

**Qurani** — Your gateway to the Holy Quran, beautifully crafted by Elshaibi.