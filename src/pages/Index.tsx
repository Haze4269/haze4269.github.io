import { useState, useEffect } from "react";
import RetroHeader from "@/components/RetroHeader";
import ProfileCard from "@/components/ProfileCard";
import MusicPlayer from "@/components/MusicPlayer";
import IntroAnimation from "@/components/IntroAnimation";

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const handleIntroComplete = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShowIntro(false);
    }, 1000); // Wait for fade out animation
  };

  return (
    <>
      {showIntro && (
        <div className={`fixed inset-0 z-50 transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
          <IntroAnimation onComplete={handleIntroComplete} />
        </div>
      )}
      
      <div className="min-h-screen bg-background flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
        {/* Hellish background effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-fire-orange rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className={`w-full max-w-4xl space-y-3 md:space-y-4 relative z-10 transition-all duration-1000 transform ${showIntro ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>
          <div className="retro-dashed bg-card rounded-lg p-3 sm:p-4 md:p-6 animate-glow-pulse space-y-3 md:space-y-4">
            <RetroHeader />
            <ProfileCard />
            <MusicPlayer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
