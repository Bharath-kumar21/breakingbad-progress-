import { useState, useMemo } from 'react';
import { episodes } from '../data/episodes';
import EpisodeCard from '../components/EpisodeCard';
import { Search } from 'lucide-react';

export default function Episodes() {
    const [activeSeason, setActiveSeason] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredEpisodes = useMemo(() => {
        let result = episodes;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(e =>
                e.title.toLowerCase().includes(q) ||
                `s${e.season}e${e.episode}`.includes(q)
            );
        } else {
            result = result.filter(e => e.season === activeSeason);
        }
        return result;
    }, [activeSeason, searchQuery]);

    return (
        <div className="space-y-6 fade-in">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                <h1 className="text-3xl font-black text-white drop-shadow-md tracking-tight">Episodes</h1>

                <div className="relative w-full md:w-72 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Search className="h-5 w-5 text-white-dim group-focus-within:text-bb-green transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="search-input glass shadow-sm focus:shadow-lg focus:shadow-bb-green/20"
                        placeholder="Search episodes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {!searchQuery && (
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    {[1, 2, 3, 4, 5].map(s => (
                        <button
                            key={s}
                            onClick={() => setActiveSeason(s)}
                            className={`px-8 py-2.5 rounded-full font-bold transition-all duration-300 shadow-sm whitespace-nowrap ${activeSeason === s
                                ? 'bg-bb-green text-white shadow-lg shadow-bb-green/30 transform -translate-y-1'
                                : 'bg-white-5 text-white-med hover:bg-white-10 hover:text-white hover:-translate-y-0.5'
                                }`}
                        >
                            Season {s}
                        </button>
                    ))}
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredEpisodes.length > 0 ? (
                    filteredEpisodes.map((ep, index) => (
                        <div key={ep.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                            <EpisodeCard episode={ep} />
                        </div>
                    ))
                ) : (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 py-12 text-center text-white-med glass rounded-2xl shadow-inner border-white-5">
                        <p className="text-lg">No episodes found matching "<span className="text-white font-bold">{searchQuery}</span>"</p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-4 text-bb-green hover:text-bb-light-green font-medium transition-colors"
                        >
                            Clear search
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
