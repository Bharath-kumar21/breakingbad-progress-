import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { Users, Activity, PlayCircle, Star, Search, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Fetch all users ordered by last active date
                const usersRef = collection(db, 'users');
                const q = query(usersRef, orderBy('lastActive', 'desc'));
                const snapshot = await getDocs(q);

                const usersData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching users:", error);
                // Creating a dummy index to gracefully fail if rules or indexing prevents it
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => 
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        Admin Access
                    </h1>
                    <p className="text-white-dim text-lg">System Operative Directory</p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white-dim w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search operatives..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white-5 border border-white-10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-bb-green focus:bg-white-10 transition-all font-medium"
                    />
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass rounded-2xl p-6 border-white-5 flex items-center gap-6 shadow-lg">
                    <div className="w-14 h-14 rounded-full bg-bb-green/20 flex items-center justify-center text-bb-green border border-bb-green/30 shrink-0">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-white-dim text-sm font-bold uppercase tracking-wider mb-1">Total Operatives</p>
                        <p className="text-3xl font-black text-white">{users.length}</p>
                    </div>
                </div>
                
                <div className="glass md:col-span-2 rounded-2xl p-6 border-white-5 shadow-lg bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0JyBoZWlnaHQ9JzQnPjxyZWN0IHdpZHRoPSc0JyBoZWlnaHQ9JzQnIGZpbGw9JyMxMTEnLz48cmVjdCB3aWR0aD0nMScgaGVpZ2h0PScxJyBmaWxsPScjMjIyJy8+PC9zdmc+')] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-bb-green-20 to-transparent opacity-20"></div>
                    <div className="relative z-10">
                        <p className="text-bb-green text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            System Status
                        </p>
                        <p className="text-lg text-white font-medium">Monitoring all operative progress across the Albuquerque network. Ensure all members meet their binge quotas.</p>
                    </div>
                </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <div key={user.id} className="glass rounded-2xl border-white-5 overflow-hidden shadow-xl hover:border-white-10 transition-colors group">
                            {/* Card Header */}
                            <div className="bg-white-5 p-5 border-b border-white-5 flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-bb-green transition-colors">
                                        {user.displayName || 'Unknown Operative'}
                                    </h3>
                                    <p className="text-sm text-white-dim font-medium break-all">{user.email}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-black/40 border border-white-10 flex items-center justify-center shrink-0">
                                    <span className="text-bb-green font-bold text-lg">
                                        {user.displayName?.charAt(0).toUpperCase() || '?'}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Card Body */}
                            <div className="p-5 flex flex-col gap-4 bg-black/20">
                                {/* Stats row */}
                                <div className="flex justify-between items-center px-2">
                                    <div className="flex items-center gap-3">
                                        <PlayCircle className="text-bb-green w-5 h-5 opacity-70" />
                                        <div>
                                            <p className="text-[10px] text-white-dim uppercase font-bold tracking-wider">Watched</p>
                                            <p className="font-bold text-white text-lg">{user.watchedCount || 0}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Star className="text-bb-yellow w-5 h-5 opacity-70" />
                                        <div className="text-right">
                                            <p className="text-[10px] text-white-dim uppercase font-bold tracking-wider">Favorites</p>
                                            <p className="font-bold text-white text-lg">{user.favoritesCount || 0}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="mt-2 pt-4 border-t border-white-5 flex flex-col gap-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-white-dim">Born:</span>
                                        <span className="text-white-med font-medium">{user.dob || 'Unknown'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-white-dim">Last Active:</span>
                                        <span className="text-bb-green font-medium">
                                            {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Unknown'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center glass rounded-2xl border-white-5">
                        <Users className="w-12 h-12 text-white-dim mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-bold text-white mb-2">No Operatives Found</h3>
                        <p className="text-white-med">They might be hiding from Gus.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
