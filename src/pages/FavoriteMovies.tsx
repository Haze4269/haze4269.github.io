import RetroHeader from "@/components/RetroHeader";
import { Film, Heart, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";

interface Movie {
  name: string;
  genre: string;
  description: string;
}

interface MoviesData {
  lastUpdated: string;
  movies: Movie[];
}

const FavoriteMovies = () => {
  const [moviesData, setMoviesData] = useState<MoviesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMovies = async () => {
    try {
      const response = await fetch(`/movies.json?t=${Date.now()}`);
      if (!response.ok) throw new Error("Failed to fetch movies");
      const data = await response.json();
      setMoviesData(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchMovies();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Hellish background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-fire-orange rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="w-full max-w-4xl space-y-3 md:space-y-4 relative z-10">
        <div className="retro-dashed bg-card rounded-lg p-3 sm:p-4 md:p-6 animate-glow-pulse space-y-3 md:space-y-4">
          <RetroHeader />
          
          <div className="bg-card rounded-lg retro-dashed p-3 sm:p-4 space-y-3">
            <div className="flex items-center justify-between border-b-2 border-hell-red pb-2 gap-2">
              <div className="flex items-center gap-1 md:gap-2 min-w-0 flex-1">
                <Film className="w-4 h-4 md:w-5 md:h-5 text-hell-red animate-pulse flex-shrink-0" />
                <span className="text-xs md:text-sm text-hell-red font-bold flex-shrink-0">:</span>
                <span className="text-xs md:text-sm font-bold uppercase tracking-wide truncate">
                  Favorite Movies
                </span>
              </div>
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="hover:text-hell-red transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0" 
                aria-label="Refresh"
              >
                <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : moviesData ? (
              <div className="grid sm:grid-cols-2 gap-3 md:gap-4 mt-3 md:mt-4">
                {moviesData.movies.map((movie, index) => (
                  <div key={index} className="bg-card rounded-lg retro-dashed p-3 md:p-4 space-y-2 border-2 border-hell-red/30 hover:border-hell-red transition-colors">
                    <div className="flex items-center gap-2">
                      <Heart className="w-3 h-3 md:w-4 md:h-4 text-hell-red flex-shrink-0" />
                      <h3 className="font-bold uppercase text-hell-red tracking-wide text-sm md:text-base">{movie.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase">{movie.genre}</p>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-semibold">{movie.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">Failed to load movies</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteMovies;

