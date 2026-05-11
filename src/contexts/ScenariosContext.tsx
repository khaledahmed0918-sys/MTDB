import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { Scenario, Edit } from "../types";
import { useI18n } from "./I18nContext";

interface ScenariosContextType {
  scenarios: Scenario[];
  watchlist: string[];
  toggleWatchlist: (id: string) => void;
  edits: Edit[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ScenariosContext = createContext<ScenariosContextType>({
  scenarios: [],
  watchlist: [],
  toggleWatchlist: () => {},
  edits: [],
  loading: true,
  searchQuery: "",
  setSearchQuery: () => {},
});

export const ScenariosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [edits, setEdits] = useState<Edit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useI18n();

  useEffect(() => {
    // Load watchlist from local storage
    const savedWatchlist = localStorage.getItem('watchlist') || localStorage.getItem('favorites');
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist));
      } catch (e) {
        console.error("Error parsing watchlist", e);
      }
    }

    // Mock Edits Data
    const mockEdits: Edit[] = [
      {
        id: 'edit-1',
        title: 'Epic Chase Montage',
        type: 'video',
        url: 'https://cdn.pixabay.com/video/2023/10/24/186358-877797746_large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop',
        creator: 'ModKing',
        category: 'Action'
      },
      {
        id: 'edit-2',
        title: 'Cinematic Sunset',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop',
        creator: 'VisualArt',
        category: 'Atmospheric'
      },
      {
        id: 'edit-3',
        title: 'Heist Planning',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1541535650810-10d26f5c2abb?q=80&w=2069&auto=format&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1541535650810-10d26f5c2abb?q=80&w=2069&auto=format&fit=crop',
        creator: 'ScenarioDB',
        category: 'Crime'
      }
    ];
    setEdits(mockEdits);

    const fetchScenariosAndRatings = async () => {
      try {
        setLoading(true);
        // Load base data
        const res = await fetch('/data/scenarios.json');
        if (!res.ok) throw new Error("Failed to load local scenarios data");
        const data: Scenario[] = await res.json();
        
        let apiRatings: Record<string, { rating: number, votes: number }> | null = null;

        // Try load true ratings from the external API (DISABLED due to invalid API structure)
        /*
        try {
          const apiRes = await fetch('https://dolabriform-fascinatedly-lecia.ngrok-free.dev/api/rate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'getAll', cfToken: "cf_dummy_token_xyz" })
          });
          
          if (!apiRes.ok) {
            throw new Error(`API returned ${apiRes.status}`);
          }
          
          const apiData = await apiRes.json();
          if (apiData.error) {
            throw new Error(apiData.error);
          }
          
          // Assuming the API returns a structure like:
          // { success: true, ratings: { "scenario-id": { rating: 4.5, votes: 120 } } }
          // Or if it returns an array... we try to adapt flexibly
          if (apiData.ratings) {
             apiRatings = apiData.ratings;
          } else if (Array.isArray(apiData)) {
             apiRatings = apiData.reduce((acc, item) => ({ ...acc, [item.scenarioId]: { rating: item.rating || item.overallRating, votes: item.votes || item.totalVotes } }), {});
          }
          
          toast.success("Ratings synchronized with live servers!");

        } catch (apiErr: any) {
          console.error("API Fetch Error:", apiErr);
          toast.error("Error syncing live ratings: " + (apiErr.message || "Connection failed"));
        }
        */

        let updatedScenarios = [...data];
        
        // Fetch real-time ratings for all scenarios
        try {
          const ratingPromises = updatedScenarios.map(async (scenario) => {
            try {
              const res = await fetch(`https://dolabriform-fascinatedly-lecia.ngrok-free.dev/api/ratings/${scenario.id}`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
              });
              if (res.ok) {
                const ratingData = await res.json();
                return {
                  ...scenario,
                  overallRating: ratingData.votesCount > 0 ? ratingData.ratingsSum / ratingData.votesCount : 0,
                  totalVotes: ratingData.votesCount
                };
              }
            } catch (err) {
              console.error(`Failed to fetch ratings for ${scenario.id}`, err);
            }
            // Return scenario as is if fetch fails
            return scenario;
          });

          updatedScenarios = await Promise.all(ratingPromises);
          toast.success(t('liveSyncSuccess'));
        } catch (apiErr: any) {
          console.error("API Fetch Error:", apiErr);
          toast.error(t('liveSyncError'));
        }

        setScenarios(updatedScenarios);
      } catch (err: any) {
        console.error(err);
        toast.error(t('loadDataError'));
      } finally {
        setLoading(false);
      }
    };

    fetchScenariosAndRatings();
  }, []);

  const toggleWatchlist = (id: string) => {
    setWatchlist(prev => {
      const newWatchlist = prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id];
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
      if (newWatchlist.includes(id)) {
        toast.success(t('addedToWatchlist'));
      } else {
        toast.info(t('removedFromWatchlist'));
      }
      return newWatchlist;
    });
  };

  return (
    <ScenariosContext.Provider value={{ scenarios, watchlist, toggleWatchlist, edits, loading, searchQuery, setSearchQuery }}>
      {children}
    </ScenariosContext.Provider>
  );
};

export const useScenarios = () => useContext(ScenariosContext);
