import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, deleteUser } from 'firebase/auth';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const ADMIN_EMAILS = ['bharathkumar2105j@gmail.com', 'thestrwht@gmail.com']; // Authorized admins
    const isAdmin = user && ADMIN_EMAILS.includes(user.email);

    const [displayName, setDisplayName] = useState(() =>
        localStorage.getItem('bb_displayName') || ''
    );
    const [dob, setDob] = useState(() =>
        localStorage.getItem('bb_dob') || ''
    );

    const [watchedEpisodes, setWatchedEpisodes] = useState(() => {
        const saved = localStorage.getItem('bb_watchedEpisodes');
        return saved ? JSON.parse(saved) : [];
    });

    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('bb_favorites');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Sync to Local Storage
    useEffect(() => { localStorage.setItem('bb_watchedEpisodes', JSON.stringify(watchedEpisodes)); }, [watchedEpisodes]);
    useEffect(() => { localStorage.setItem('bb_favorites', JSON.stringify(favorites)); }, [favorites]);
    useEffect(() => { localStorage.setItem('bb_displayName', displayName); }, [displayName]);
    useEffect(() => { localStorage.setItem('bb_dob', dob); }, [dob]);

    // Sync to Firestore for Admin Tracking
    useEffect(() => {
        const syncToFirestore = async () => {
            if (user && !loading) {
                try {
                    const userRef = doc(db, 'users', user.uid);
                    await setDoc(userRef, {
                        email: user.email,
                        displayName: displayName || user.email?.split('@')[0],
                        dob: dob || '',
                        watchedCount: watchedEpisodes.length,
                        favoritesCount: favorites.length,
                        lastActive: new Date().toISOString()
                    }, { merge: true });
                } catch (error) {
                    console.error("Error syncing user data to Firestore:", error);
                }
            }
        };

        const timeoutId = setTimeout(syncToFirestore, 1000); // Debounce sync
        return () => clearTimeout(timeoutId);
    }, [user, displayName, dob, watchedEpisodes, favorites, loading]);

    const toggleWatched = (episodeId) => {
        setWatchedEpisodes(prev =>
            prev.includes(episodeId) ? prev.filter(id => id !== episodeId) : [...prev, episodeId]
        );
    };

    const toggleFavorite = (episodeId) => {
        setFavorites(prev =>
            prev.includes(episodeId) ? prev.filter(id => id !== episodeId) : [...prev, episodeId]
        );
    };

    const userData = user
        ? { username: displayName || user.email?.split('@')[0], dob }
        : null;

    const deleteAccount = async () => {
        if (!user) return;
        
        // Capture uid before auth user is deleted
        const uid = user.uid;
        const userRef = doc(db, 'users', uid);

        try {
            // 1. Clear Local Storage Data first (before async ops)
            localStorage.removeItem('bb_watchedEpisodes');
            localStorage.removeItem('bb_favorites');
            localStorage.removeItem('bb_displayName');
            localStorage.removeItem('bb_dob');

            // 2. Delete Firebase Auth account (while user is still authenticated)
            await deleteUser(user);

            // 3. Silently try to delete Firestore document - don't fail if rules block it
            try {
                await deleteDoc(userRef);
            } catch (firestoreErr) {
                console.warn("Firestore doc could not be deleted:", firestoreErr.message);
            }

            // 4. Reset Local State
            setWatchedEpisodes([]);
            setFavorites([]);
            setDisplayName('');
            setDob('');
            setUser(null);
            
            return true;
        } catch (error) {
            console.error("Error deleting account:", error);
            throw error;
        }
    };

    return (
        <AppContext.Provider value={{
            user, userData, displayName, setDisplayName, dob, setDob,
            watchedEpisodes, toggleWatched, favorites, toggleFavorite, 
            loading, isAdmin, deleteAccount
        }}>
            {!loading && children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
