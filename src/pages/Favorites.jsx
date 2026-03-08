import { useAppContext } from '../context/AppContext';
import { episodes } from '../data/episodes';
import EpisodeCard from '../components/EpisodeCard';
import { StarOff } from 'lucide-react';

export default function Favorites() {
    const { favorites } = useAppContext();

    const favoriteEpisodes = episodes.filter(ep => favorites.includes(ep.id));

    return (
        <div className="space-y-6 fade-in">
            <div className="flex items-center gap-3 mb-8">
                <h1 className="text-3xl font-black text-bb-yellow drop-shadow-md tracking-tight">Favorites</h1>
            </div>

            {favoriteEpisodes.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {favoriteEpisodes.map((ep, index) => (
                        <div key={ep.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                            <EpisodeCard episode={ep} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 glass rounded-2xl border-white-5 shadow-lg">
                    <StarOff className="w-16 h-16 text-white-10 mb-6 group-hover:scale-110 transition-transform duration-500" />
                    <h3 className="text-2xl font-bold text-white mb-2">No favorites yet</h3>
                    <p className="text-white-med mt-2 max-w-md text-center text-lg">
                        You haven't added any episodes to your favorites. Unbelievable, right?
                    </p>
                </div>
            )}
        </div>
    );
}
