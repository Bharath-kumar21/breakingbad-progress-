import { useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toJpeg } from 'html-to-image';
import { episodes } from '../data/episodes';
import { LogOut, User, Edit2, Share2, Check, X, Award, PlayCircle, Trash2 } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';

const TOTAL = episodes.length;

export default function Profile() {
    const { user, userData, displayName, setDisplayName, dob, watchedEpisodes, favorites, deleteAccount } = useAppContext();
    const navigate = useNavigate();
    const progressRef = useRef(null);
    const [sharing, setSharing] = useState(false);
    const [editing, setEditing] = useState(false);
    const [nameInput, setNameInput] = useState(displayName || '');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmInput, setDeleteConfirmInput] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const pct = Math.round((watchedEpisodes.length / TOTAL) * 100) || 0;

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmInput !== 'DELETE') return;
        setDeleting(true);
        setDeleteError('');
        try {
            await deleteAccount();
            navigate('/');
        } catch (err) {
            if (err.code === 'auth/requires-recent-login') {
                setDeleteError('Session expired. Please sign out and sign back in, then try deleting again.');
            } else {
                setDeleteError('Something went wrong. Please try again.');
            }
            setDeleting(false);
        }
    };

    const handleSaveName = () => {
        setDisplayName(nameInput.trim() || user?.email?.split('@')[0]);
        setEditing(false);
    };

    const handleShare = async () => {
        if (!progressRef.current) return;
        setSharing(true);
        try {
            await new Promise(r => setTimeout(r, 150));
            const dataUrl = await toJpeg(progressRef.current, {
                quality: 0.96,
                backgroundColor: '#0a0a0a',
            });
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], 'bb-progress.jpg', { type: 'image/jpeg' });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ title: 'My Breaking Bad Progress', files: [file] });
            } else {
                const link = document.createElement('a');
                link.download = 'bb-progress.jpg';
                link.href = dataUrl;
                link.click();
            }
        } catch (err) { alert("Couldn't generate image."); }
        finally { setSharing(false); }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 fade-in">
            
            {/* ── Top window ── */}
            <div className="glass rounded-3xl p-8 border-white-5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-bb-green-20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
                    {/* Avatar */}
                    <div className="w-32 h-32 rounded-full glass border-2 border-bb-green-30 flex items-center justify-center shadow-lg relative shrink-0">
                        <User className="w-16 h-16 text-bb-green" />
                        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(16,185,129,0.2)]"></div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 w-full">
                        {editing ? (
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <div className="relative flex-1 min-w-[200px] max-w-sm">
                                    <input
                                        autoFocus
                                        value={nameInput}
                                        onChange={e => setNameInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                                        className="w-full bg-white-5 border border-bb-green-50 text-white rounded-lg px-4 py-2 text-2xl font-black focus:outline-none focus:ring-2 focus:ring-bb-green focus:border-transparent transition-all"
                                        placeholder="Enter name..."
                                    />
                                </div>
                                <button onClick={handleSaveName} className="p-2.5 rounded-lg bg-bb-green text-white hover:bg-green-500 transition-colors shadow-lg">
                                    <Check size={20} />
                                </button>
                                <button onClick={() => setEditing(false)} className="p-2.5 rounded-lg bg-white-10 text-white hover:bg-white-20 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-wrap items-center gap-4 mb-2">
                                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
                                    {userData?.username || 'Operative'}
                                </h1>
                                <button 
                                    onClick={() => { setNameInput(displayName); setEditing(true); }}
                                    className="p-2 rounded-full text-white-dim hover:bg-white-10 hover:text-white transition-all"
                                    title="Edit Name"
                                >
                                    <Edit2 size={18} />
                                </button>
                            </div>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4">
                            <div className="flex flex-col">
                                <span className="text-white-dim text-xs uppercase tracking-wider font-bold">Email</span>
                                <span className="text-white-med text-sm font-medium">{user?.email}</span>
                            </div>
                            {dob && (
                                <div className="flex flex-col">
                                    <span className="text-white-dim text-xs uppercase tracking-wider font-bold">Born</span>
                                    <span className="text-white-med text-sm font-medium">{dob}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sign out */}
                    <button 
                        onClick={handleLogout}
                        className="mt-4 md:mt-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-400 font-bold hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/20 shadow-sm"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass rounded-3xl p-6 border-white-5 flex items-center justify-between transition-all hover:bg-white-5 hover:border-white-10 cursor-pointer shadow-lg hover:-translate-y-1">
                    <div>
                        <p className="text-white-dim text-sm font-bold uppercase tracking-wider mb-1">Episodes Logged</p>
                        <p className="text-4xl font-black text-white drop-shadow-md">{watchedEpisodes.length}</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-bb-green-20 flex items-center justify-center text-bb-green shadow-inner">
                        <PlayCircle size={32} />
                    </div>
                </div>
                <div className="glass rounded-3xl p-6 border-white-5 flex items-center justify-between transition-all hover:bg-white-5 hover:border-white-10 cursor-pointer shadow-lg hover:-translate-y-1">
                    <div>
                        <p className="text-white-dim text-sm font-bold uppercase tracking-wider mb-1">Favorites Saved</p>
                        <p className="text-4xl font-black text-bb-yellow drop-shadow-md">{favorites.length}</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-bb-yellow-10 flex items-center justify-center text-bb-yellow shadow-inner">
                        <Award size={32} />
                    </div>
                </div>
            </div>

            <div className="h-4"></div>

            {/* ── Shareable Card Area ── */}
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Share2 className="text-bb-green w-5 h-5" />
                    Share Your Progress
                </h3>
            </div>
            
            <div className="glass rounded-3xl p-6 md:p-10 border-white-5 shadow-2xl relative overflow-hidden flex flex-col items-center">
                
                {/* The actual card that gets screenshotted */}
                <div 
                    ref={progressRef} 
                    className="w-full max-w-lg bg-[#0a0a0a] rounded-2xl p-8 relative overflow-hidden shadow-2xl"
                    style={{
                        border: '1px solid rgba(255,255,255,0.08)',
                        backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(16,185,129,0.15) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(16,185,129,0.05) 0%, transparent 50%)'
                    }}
                >
                    {/* Header: Logo + Date */}
                    <div className="flex justify-between items-start mb-10">
                        <div className="flex items-center gap-1.5 cursor-pointer">
                            <div className="flex items-center gap-1 font-black text-xl tracking-tighter">
                                <span className="bg-[#0f6b32] text-white px-2 py-1 rounded shadow-sm border border-[#168a42]">Br</span>
                                <span className="bg-[#0f6b32] text-white px-2 py-1 rounded shadow-sm border border-[#168a42]">Ba</span>
                            </div>
                            <span className="text-white/60 font-bold ml-1 text-sm tracking-widest uppercase">Tracker</span>
                        </div>
                        
                        <div className="text-right">
                            <p className="text-white/80 font-bold text-sm tracking-wide">
                                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Operative Profile</p>
                            <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-sm">
                                {userData?.username || 'Operative'}
                            </h2>
                        </div>

                        <div className="glass p-6 rounded-2xl border-white-5 bg-white/[0.02]">
                            <div className="flex justify-between items-end mb-4">
                                <p className="text-white/70 font-semibold tracking-wide">Series Completed</p>
                                <div className="text-right">
                                    <span className="text-4xl font-black text-bb-green drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]">{pct}%</span>
                                </div>
                            </div>
                            
                            <ProgressBar current={watchedEpisodes.length} total={TOTAL} />
                            
                            <div className="flex justify-between mt-5 pt-5 border-t border-white/5">
                                <div className="text-center">
                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Episodes</p>
                                    <p className="text-white font-bold text-lg">{watchedEpisodes.length}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Total</p>
                                    <p className="text-white font-bold text-lg">{TOTAL}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Favorites</p>
                                    <p className="text-bb-yellow font-bold text-lg">{favorites.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Share button */}
                <button
                    onClick={handleShare}
                    disabled={sharing}
                    className="mt-8 relative group overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 text-white font-bold text-lg tracking-wide shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                    <span className="relative z-10 flex items-center gap-2">
                        {sharing ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Generating...
                            </>
                        ) : (
                            <>
                                <Share2 className="w-5 h-5" />
                                Share Story
                            </>
                        )}
                    </span>
                </button>
                <p className="text-white-dim text-xs mt-4 text-center max-w-md">
                    Click to generate a sleek card. On mobile, it opens the share menu. On desktop, it downloads the image for you to upload.
                </p>
            </div>
            
            {/* ── Danger Zone ── */}
            <div className="glass rounded-3xl p-6 border border-red-500/20 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none"></div>
                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-red-400 mb-1 flex items-center gap-2">
                            <Trash2 size={18} />
                            Danger Zone
                        </h3>
                        <p className="text-white-dim text-sm">Permanently delete your account and all associated data. This cannot be undone.</p>
                    </div>
                    <button
                        onClick={() => { setShowDeleteModal(true); setDeleteConfirmInput(''); setDeleteError(''); }}
                        className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-400 font-bold hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/30 shadow-sm"
                    >
                        <Trash2 size={16} />
                        Delete Account
                    </button>
                </div>
            </div>

            <div className="h-8"></div>

            {/* ── Delete Confirmation Modal ── */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
                    <div className="glass rounded-3xl p-8 w-full max-w-md border border-red-500/30 shadow-2xl relative overflow-hidden fade-in">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent pointer-events-none"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                                    <Trash2 className="text-red-400" size={22} />
                                </div>
                                <button onClick={() => setShowDeleteModal(false)} className="p-2 rounded-full text-white-dim hover:text-white hover:bg-white-10 transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <h2 className="text-2xl font-black text-white mb-2">Delete Account?</h2>
                            <p className="text-white-dim mb-6">This will permanently erase your account, all your progress, and tracked data. <span className="text-red-400 font-bold">There is no going back.</span></p>

                            <p className="text-white-med text-sm font-bold mb-2">Type <span className="text-red-400 font-mono">DELETE</span> to confirm:</p>
                            <input
                                autoFocus
                                value={deleteConfirmInput}
                                onChange={e => setDeleteConfirmInput(e.target.value)}
                                placeholder="DELETE"
                                className="w-full bg-white-5 border border-red-500/30 rounded-xl px-4 py-3 text-white font-mono font-bold focus:outline-none focus:border-red-400 transition-all mb-4"
                            />

                            {deleteError && (
                                <p className="text-red-400 text-sm font-medium mb-4">{deleteError}</p>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-3 rounded-xl bg-white-5 text-white-med font-bold hover:bg-white-10 transition-all border border-white-10"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteConfirmInput !== 'DELETE' || deleting}
                                    className="flex-1 py-3 rounded-xl bg-red-500/20 text-red-400 font-bold border border-red-500/30 hover:bg-red-500 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {deleting ? (
                                        <><span className="w-4 h-4 border-2 border-red-300/40 border-t-red-300 rounded-full animate-spin"></span> Deleting...</>
                                    ) : (
                                        <><Trash2 size={16} /> Confirm Delete</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
