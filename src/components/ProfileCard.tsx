import { Heart, RotateCcw, X } from "lucide-react";
import { useState, useEffect } from "react";
import avatar from "@/assets/avatar-hell.png";

interface ProfileData {
  name: string;
  age: number;
  pronouns: string;
  lastUpdated: string;
  bio: string[];
  likes: string[];
}

const ProfileCard = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProfile = async () => {
    try {
      // Add cache-busting query parameter to force refresh
      const response = await fetch(`/profile.json?t=${Date.now()}`);
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchProfile();
  };

  if (isLoading || !profileData) {
    return (
      <div className="bg-card rounded-lg retro-dashed p-3 md:p-4 space-y-3">
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg retro-dashed p-3 md:p-4 space-y-3">
      <div className="flex items-center justify-between border-b-2 border-hell-red pb-2 gap-2">
        <div className="flex items-center gap-1 md:gap-2 min-w-0 flex-1">
          <Heart className="w-4 h-4 md:w-5 md:h-5 text-hell-red animate-pulse flex-shrink-0" />
          <span className="text-xs md:text-sm text-hell-red font-bold flex-shrink-0">:</span>
          <span className="text-xs md:text-sm font-bold uppercase tracking-wide truncate">
            about me
          </span>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="hover:text-hell-red transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed" 
            aria-label="Refresh"
          >
            <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button className="hover:text-hell-red transition-colors p-1" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="text-center">
            <p className="text-xs md:text-sm mb-2 font-bold uppercase tracking-wider text-hell-red">
              {profileData.name}
            </p>
            <img 
              src={avatar} 
              alt="Profile avatar" 
              className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-lg border-2 border-hell-red object-cover shadow-[0_0_20px_rgba(255,0,0,0.6)]"
            />
            <p className="text-xs text-muted-foreground mt-2 font-bold">
              {profileData.age} {profileData.pronouns}<br />
            </p>
          </div>
        </div>
        
        <div className="md:col-span-2 grid md:grid-cols-[1fr_auto_1fr] gap-4">
          <div className="space-y-2 text-xs md:text-sm">
            <h3 className="font-bold mb-2 uppercase text-hell-red tracking-wide py-1 md:py-2">Bio</h3>
            <p className="text-muted-foreground leading-loose font-semibold py-1 md:py-2">
              {profileData.bio.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < profileData.bio.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>
          
          <div className="hidden md:flex relative items-center justify-center px-2">
            <div className="relative h-full min-h-[200px] flex flex-col items-center justify-center gap-4">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-hell-red -translate-x-1/2"></div>
              <div className="relative z-10 bg-card px-2 text-hell-red text-xs font-bold">☠</div>
              <div className="relative z-10 bg-card px-2 text-hell-red text-xs font-bold">═══</div>
              <div className="relative z-10 bg-card px-2 text-hell-red text-xs font-bold">☠</div>
              <div className="relative z-10 bg-card px-2 text-hell-red text-xs font-bold">═══</div>
              <div className="relative z-10 bg-card px-2 text-hell-red text-xs font-bold">☠</div>
            </div>
          </div>
          
          <div className="space-y-2 text-xs md:text-sm">
            <h3 className="font-bold mb-1 uppercase text-hell-red tracking-wide py-1 md:py-2">likes</h3>
            <p className="text-muted-foreground leading-loose font-semibold py-1 md:py-2">
              {profileData.likes.map((like, i) => (
                <span key={i}>
                  {like}
                  {i < profileData.likes.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
