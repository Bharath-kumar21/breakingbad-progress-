import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase';
import { Users, Activity, PlayCircle, Star, Search, ShieldAlert, Download, MonitorPlay } from 'lucide-react';

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const usersRef = collection(db, 'users');
        // Simple collection query without orderBy to avoid composite index requirements
        const q = query(usersRef);

        // Real-time listener — auto-updates whenever user data changes
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                // Sort client-side by lastActive descending
                .sort((a, b) => (b.lastActive || '').localeCompare(a.lastActive || ''));
            setUsers(usersData);
            setLoading(false);
        }, (error) => {
            console.error("Error listening to users:", error);
            setLoading(false);
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, []);

    const filteredUsers = users.filter(user => 
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate Global Stats
    const totalEpisodesWatched = users.reduce((sum, user) => sum + (user.watchedCount || 0), 0);
    const totalFavorites = users.reduce((sum, user) => sum + (user.favoritesCount || 0), 0);
    
    // Find Most Active User (highest watched count or simply using the first since it's ordered by recent activity)
    const mostActiveUser = users.length > 0 ? users.reduce((prev, current) => 
        (prev.watchedCount > current.watchedCount) ? prev : current
    ) : null;

    const handleExportCSV = () => {
        if (users.length === 0) return;

        const headers = ['Name', 'Email', 'DOB', 'Episodes Watched', 'Favorites', 'Last Active'];
        const csvContent = [
            headers.join(','),
            ...users.map(user => [
                `"${user.displayName || 'Unknown'}"`,
                `"${user.email}"`,
                `"${user.dob || 'Unknown'}"`,
                user.watchedCount || 0,
                user.favoritesCount || 0,
                `"${user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Unknown'}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'bb_tracker_operatives.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-bb-green border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 fade-in">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4 mb-2">
                        <ShieldAlert className="w-10 h-10 text-bb-green" />
                        Admin Override
                    </h1>
                    <p className="text-white-dim text-lg">Global Monitoring System V2.0</p>
                </div>
                
                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
                    {/* Search Bar */}
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white-dim w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search operatives..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white-5 border border-white-10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-bb-green focus:bg-white-10 transition-all font-medium"
                        />
                    </div>
                    {/* Export Button */}
                    <button 
                        onClick={handleExportCSV}
                        className="flex items-center justify-center gap-2 bg-bb-green/20 hover:bg-bb-green/30 text-bb-green border border-bb-green/30 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
                    >
                        <Download className="w-4 h-4" />
                        Export Data
                    </button>
                </div>
            </div>

            {/* Global Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass rounded-2xl p-6 border-white-5 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-white-5 flex items-center justify-center text-white-dim">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-white-dim text-sm font-bold uppercase tracking-wider mb-1">Total Operatives</p>
                        <p className="text-3xl font-black text-white">{users.length}</p>
                    </div>
                </div>

                <div className="glass rounded-2xl p-6 border-white-5 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-bb-green/20 flex items-center justify-center text-bb-green border border-bb-green/30">
                            <MonitorPlay className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-white-dim text-sm font-bold uppercase tracking-wider mb-1">Network Episodes</p>
                        <p className="text-3xl font-black text-white">{totalEpisodesWatched}</p>
                    </div>
                </div>

                <div className="glass rounded-2xl p-6 border-white-5 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-bb-yellow/20 flex items-center justify-center text-bb-yellow border border-bb-yellow/30">
                            <Star className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-white-dim text-sm font-bold uppercase tracking-wider mb-1">Total Favorites</p>
                        <p className="text-3xl font-black text-white">{totalFavorites}</p>
                    </div>
                </div>

                <div className="glass rounded-2xl p-6 border-white-5 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-bb-green-20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-black/40 border border-white-10 flex items-center justify-center text-bb-green">
                            <Activity className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-white-dim text-sm font-bold uppercase tracking-wider mb-1">Top Watcher</p>
                        <p className="text-xl font-bold text-white truncate" title={mostActiveUser?.displayName || 'N/A'}>
                            {mostActiveUser?.displayName || 'N/A'}
                        </p>
                        <p className="text-xs text-bb-green font-medium mt-1">{mostActiveUser?.watchedCount || 0} episodes</p>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="glass rounded-3xl border-white-5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/40 border-b border-white-5">
                                <th className="p-5 font-bold text-white-dim text-sm uppercase tracking-wider whitespace-nowrap">Operative</th>
                                <th className="p-5 font-bold text-white-dim text-sm uppercase tracking-wider whitespace-nowrap">Email Address</th>
                                <th className="p-5 font-bold text-white-dim text-sm uppercase tracking-wider whitespace-nowrap">D.O.B</th>
                                <th className="p-5 font-bold text-white-dim text-sm uppercase tracking-wider whitespace-nowrap text-center">Watched</th>
                                <th className="p-5 font-bold text-white-dim text-sm uppercase tracking-wider whitespace-nowrap text-center">Faves</th>
                                <th className="p-5 font-bold text-white-dim text-sm uppercase tracking-wider whitespace-nowrap text-right">Last Active</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white-5 flex-1 break-all">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-white-5 transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-bb-dark border border-white-10 flex items-center justify-center shrink-0">
                                                    <span className="text-bb-green font-bold text-xs">
                                                        {user.displayName?.charAt(0).toUpperCase() || '?'}
                                                    </span>
                                                </div>
                                                <span className="font-bold text-white group-hover:text-bb-green transition-colors whitespace-nowrap">
                                                    {user.displayName || 'Unknown Operative'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-white-med">{user.email}</td>
                                        <td className="p-5 text-white-med whitespace-nowrap">{user.dob || '--'}</td>
                                        <td className="p-5 text-center">
                                            <span className="inline-flex items-center justify-center bg-bb-green/10 text-bb-green border border-bb-green/20 rounded-full px-3 py-1 font-bold text-sm min-w-12">
                                                {user.watchedCount || 0}
                                            </span>
                                        </td>
                                        <td className="p-5 text-center">
                                            <span className="inline-flex items-center justify-center bg-bb-yellow/10 text-bb-yellow border border-bb-yellow/20 rounded-full px-3 py-1 font-bold text-sm min-w-12">
                                                {user.favoritesCount || 0}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right text-white-dim whitespace-nowrap">
                                            {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Unknown'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-white-dim">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <Users className="w-10 h-10 opacity-30" />
                                            <p className="font-medium text-lg text-white-med">No operatives found matching search parameters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
