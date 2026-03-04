# Fat Elephant - Official Band Hub 🐘🎸

A real-time, interactive web application built for the band **Fat Elephant**. This project serves as a dynamic promotional website showcasing the band's aesthetic, while doubling as a powerful, collaborative internal hub for band members to coordinate schedules, plan setlists, and brainstorm social media content.

## ✨ Features

- **Interactive 3D Hero:** A striking landing page featuring a custom 3D elephant model and dynamic curved typography utilizing WebGL.
- **Real-Time Collaborative Setlist:** A drag-and-drop interactive setlist where any band member can add, edit, or reorder songs, syncing instantly across everyone's devices.
- **Shared Schedule & Notice Board:** An organized calendar for rehearsals and gigs, plus an auto-saving notice board for dropping links and messages to the team.
- **Social Content Sketchpad:** A dedicated space to draft, edit, and store video ideas and social media strategies.
- **Music & Media Hub:** Quick links to the band's Spotify, Apple Music, and Instagram to drive fan engagement, alongside an album showcase.

## 🛠️ Technology Stack

- **Frontend:** React 19 (via Vite), TypeScript
- **Styling:** Tailwind CSS (v4)
- **3D Graphics:** Three.js, React Three Fiber, React Three Drei
- **Animations:** Framer Motion
- **Database / Backend:** Firebase Firestore (Real-time NoSQL Database)
- **Icons:** Lucide React

## 🚀 Getting Started (Local Development)

To run this project on your local machine:

### 1. Clone & Install
```bash
git clone https://github.com/your-username/fat-elephant.git
cd fat-elephant
npm install
```

### 2. Firebase Setup
Since this app uses Firebase for real-time collaboration, you need to provide your own database credentials if you are forking this project.
1. Create a project at [Firebase](https://console.firebase.google.com/).
2. Enable **Firestore Database** in test mode.
3. Replace the config in `src/firebase.ts` with your project's keys.

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the app.

## 🌍 Deployment

This project is fully optimized and ready to be deployed to platforms like [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/).

To deploy on Vercel:
1. Push your code to your GitHub repository.
2. Link the repository to a new Vercel project.
3. Vercel will automatically detect the Vite build settings and deploy the live site.
