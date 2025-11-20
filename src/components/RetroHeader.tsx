import { Skull } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const RetroHeader = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
      <Link to="/" className="text-foreground text-base md:text-lg font-bold flex items-center gap-2 uppercase tracking-wider neon-glow hover:text-hell-red transition-colors">
        Haze's site... <Skull className="w-4 h-4 md:w-5 md:h-5 text-hell-red animate-pulse" />
      </Link>
      <div className="flex flex-col md:flex-row gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground font-bold uppercase">
        <Link 
          to="/" 
          className={`hover:text-hell-red transition-colors py-1 md:py-0 ${isActive("/") ? "text-hell-red" : ""}`}
        >
          about me
        </Link>
        <span className="hidden md:inline text-hell-red">|</span>
        <Link 
          to="/favorite-music" 
          className={`hover:text-hell-red transition-colors py-1 md:py-0 ${isActive("/favorite-music") ? "text-hell-red" : ""}`}
        >
          favorite music
        </Link>
        <span className="hidden md:inline text-hell-red">|</span>
        <Link 
          to="/favorite-games" 
          className={`hover:text-hell-red transition-colors py-1 md:py-0 ${isActive("/favorite-games") ? "text-hell-red" : ""}`}
        >
          favorite games
        </Link>
        <span className="hidden md:inline text-hell-red">|</span>
        <Link 
          to="/favorite-movies" 
          className={`hover:text-hell-red transition-colors py-1 md:py-0 ${isActive("/favorite-movies") ? "text-hell-red" : ""}`}
        >
          favorite movies
        </Link>
      </div>
    </div>
  );
};

export default RetroHeader;
