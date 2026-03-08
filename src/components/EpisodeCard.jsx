import { useAppContext } from '../context/AppContext';
import { CheckCircle2, Circle, Star } from 'lucide-react';

export default function EpisodeCard({ episode }) {
    const { watchedEpisodes, toggleWatched, favorites, toggleFavorite } = useAppContext();
    const isWatched = watchedEpisodes.includes(episode.id);
    const isFavorite = favorites.includes(episode.id);

    return (
        <div className={`p-4 rounded-xl border transition-all duration-300 shadow-lg hover:scale-105 cursor-pointer ${isWatched
            ? 'border-bb-green-20 bg-bb-green-10 hover:border-bb-green-30'
            : 'border-white-10 bg-glass hover:bg-white-10 hover:border-white-20 glass'
            }`}>
            <div className="flex justify-between items-center mb-2">
                <div>
                    <span className="text-xs font-bold text-bb-yellow uppercase tracking-wider">
                        S{episode.season.toString().padStart(2, '0')} E{episode.episode.toString().padStart(2, '0')}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1 drop-shadow-sm">{episode.title}</h3>
                </div>
                <button
                    onClick={() => toggleFavorite(episode.id)}
                    className="text-white-dim hover:text-bb-yellow transition-colors hover:scale-105"
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <Star className={`w-5 h-5 ${isFavorite ? 'text-bb-yellow fill-bb-yellow drop-shadow-md' : ''}`} />
                </button>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <button
                    onClick={() => toggleWatched(episode.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-lg ${isWatched
                        ? 'bg-bb-green text-white hover:bg-bb-light-green'
                        : 'bg-white-10 text-white-high hover:bg-white-20'
                        }`}
                >
                    {isWatched ? (
                        <>
                            <CheckCircle2 className="w-4 h-4 cursor-pointer" />
                            Watched
                        </>
                    ) : (
                        <>
                            <Circle className="w-4 h-4 cursor-pointer" />
                            Mark Watched
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
