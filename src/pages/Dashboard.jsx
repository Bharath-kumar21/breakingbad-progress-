import { useAppContext } from '../context/AppContext';
import { episodes } from '../data/episodes';
import ProgressBar from '../components/ProgressBar';
import QuoteGenerator from '../components/QuoteGenerator';
import EpisodeCard from '../components/EpisodeCard';
import { PlayCircle, Trophy, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { watchedEpisodes, favorites } = useAppContext();
    const totalEpisodes = episodes.length;

    // Find last watched episode
    const lastWatchedId = watchedEpisodes.length > 0
        ? [...watchedEpisodes].sort((a, b) => b - a)[0]
        : null;

    const lastWatched = lastWatchedId ? episodes.find(e => e.id === lastWatchedId) : null;
    const nextEpisode = lastWatchedId && lastWatchedId < totalEpisodes
        ? episodes.find(e => e.id === lastWatchedId + 1)
        : episodes[0]; // If none watched, suggest first episode

    return (
        <div className="space-y-8 fade-in">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2 glass rounded-2xl p-6 border-bb-green-20 relative overflow-hidden group shadow-lg transition-all duration-500 hover:border-bb-green-30 hover:scale-105 cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-bb-green-10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col h-full justify-center">
                        <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight text-white drop-shadow-md">
                            Your Empire Business
                        </h2>
                        <ProgressBar current={watchedEpisodes.length} total={totalEpisodes} />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="glass rounded-2xl p-5 border-white-5 flex items-center justify-between transition-all hover:bg-white-5 hover:border-white-10 cursor-pointer shadow-lg hover:scale-105">
                        <div>
                            <p className="text-white-dim text-sm font-medium">Episodes Watched</p>
                            <p className="text-3xl font-bold text-white drop-shadow-md">{watchedEpisodes.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-bb-green-20 flex items-center justify-center text-bb-green transition-transform group-hover:scale-110">
                            <PlayCircle size={24} />
                        </div>
                    </div>
                    <div className="glass rounded-2xl p-5 border-white-5 flex items-center justify-between transition-all hover:bg-white-5 hover:border-white-10 cursor-pointer shadow-lg hover:scale-105">
                        <div>
                            <p className="text-white-dim text-sm font-medium">Favorites</p>
                            <p className="text-3xl font-bold text-bb-yellow drop-shadow-md">{favorites.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-bb-yellow-10 flex items-center justify-center text-bb-yellow transition-transform group-hover:scale-110">
                            <Star size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold flex items-center gap-2 text-white">
                            <Trophy className="text-bb-green w-6 h-6" />
                            Up Next
                        </h3>
                        <Link to="/episodes" className="px-5 py-2 rounded-full bg-bb-green/10 border border-bb-green/30 text-sm text-bb-green hover:bg-bb-green hover:text-white font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-lg">
                            View All →
                        </Link>
                    </div>

                    {nextEpisode ? (
                        <EpisodeCard episode={nextEpisode} />
                    ) : (
                        <div className="glass rounded-xl p-6 text-center border-bb-green-30 px-4 shadow-lg">
                            <p className="text-lg text-bb-green font-bold">You're done!</p>
                            <p className="text-white-med text-sm mt-2">You have watched all episodes.</p>
                        </div>
                    )}

                    {lastWatched && (
                        <div className="mt-6">
                            <h4 className="text-sm font-medium text-white-dim mb-3 uppercase tracking-wider">Previously On</h4>
                            <div className="opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                                <EpisodeCard episode={lastWatched} />
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <QuoteGenerator />
                </div>
            </div>

        </div>
    );
}
