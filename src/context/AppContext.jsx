import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [watchedEpisodes, setWatchedEpisodes] = useState(() => {
        const saved = localStorage.getItem('bb_watchedEpisodes');
        return saved ? JSON.parse(saved) : [];
    });

    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('bb_favorites');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('bb_watchedEpisodes', JSON.stringify(watchedEpisodes));
    }, [watchedEpisodes]);

    useEffect(() => {
        localStorage.setItem('bb_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleWatched = (episodeId) => {
        setWatchedEpisodes(prev =>
            prev.includes(episodeId)
                ? prev.filter(id => id !== episodeId)
                : [...prev, episodeId]
        );
    };

    const toggleFavorite = (episodeId) => {
        setFavorites(prev =>
            prev.includes(episodeId)
                ? prev.filter(id => id !== episodeId)
                : [...prev, episodeId]
        );
    };

    return (
        <AppContext.Provider value={{ watchedEpisodes, toggleWatched, favorites, toggleFavorite }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
