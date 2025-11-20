import RetroHeader from "@/components/RetroHeader";
import ProfileCard from "@/components/ProfileCard";
import MusicPlayer from "@/components/MusicPlayer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Hellish background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-fire-orange rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="w-full max-w-4xl space-y-3 md:space-y-4 relative z-10">
        <div className="retro-dashed bg-card rounded-lg p-3 sm:p-4 md:p-6 animate-glow-pulse space-y-3 md:space-y-4">
          <RetroHeader />
          <ProfileCard />
          <MusicPlayer />
        </div>
      </div>
    </div>
  );
};

export default Index;
