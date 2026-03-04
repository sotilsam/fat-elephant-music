import { HeroSection } from './components/HeroSection';
import { TransitionSection } from './components/TransitionSection';
import { AlbumSection } from './components/AlbumSection';
import { MusicPlayer } from './components/MusicPlayer';
import { Planner } from './components/Planner';
import { ContentHub } from './components/ContentHub';
import { SetlistComponent } from './components/SetlistComponent';
import { SocialContent } from './components/SocialContent';

function App() {
  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] selection:bg-white selection:text-black">
      <HeroSection />
      <TransitionSection />
      <AlbumSection />
      <MusicPlayer />
      <Planner />
      <SetlistComponent />
      <SocialContent />
      <ContentHub />

      <footer className="w-full py-12 text-center bg-black text-[#86868b] text-sm">
        <p className="font-medium tracking-wide">FAT ELEPHANT © {new Date().getFullYear()}</p>
        <p className="mt-2 opacity-50">All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
