import { useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toJpeg } from 'html-to-image';
import { episodes } from '../data/episodes';

const mono = { fontFamily: "'Courier New', Courier, monospace" };
const TOTAL = episodes.length;

/* 2008-style beveled button */
const Btn2k8 = ({ children, onClick, type = 'button', disabled, danger, small }) => (
    <button
        type={type} disabled={disabled} onClick={onClick}
        style={{
            ...mono,
            background: danger
                ? 'linear-gradient(180deg,#ff8080 0%,#dd2222 45%,#aa0000 100%)'
                : 'linear-gradient(180deg,#c8ff9a 0%,#4ece60 45%,#228833 100%)',
            border: danger ? '2px solid #770000' : '2px solid #1a6b30',
            boxShadow: danger
                ? '0 4px 0 #550000, inset 0 1px 0 rgba(255,210,210,0.5)'
                : '0 4px 0 #0d4a1a, inset 0 1px 0 rgba(210,255,210,0.6)',
            color: '#fff',
            textShadow: '0 1px 2px rgba(0,0,0,0.6)',
            padding: small ? '8px 18px' : '13px 36px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontWeight: 900,
            letterSpacing: small ? '0.12em' : '0.18em',
            fontSize: small ? '0.68rem' : '0.78rem',
            textTransform: 'uppercase',
            opacity: disabled ? 0.6 : 1,
            borderRadius: '4px',
            minWidth: small ? 'unset' : '140px',
        }}
    >{children}</button>
);

export default function Profile() {
    const { user, userData, displayName, setDisplayName, dob, watchedEpisodes, favorites } = useAppContext();
    const navigate = useNavigate();
    const progressRef = useRef(null);
    const [sharing, setSharing] = useState(false);
    const [editing, setEditing] = useState(false);
    const [nameInput, setNameInput] = useState(displayName || '');

    const pct = Math.round((watchedEpisodes.length / TOTAL) * 100) || 0;

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
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
                backgroundColor: '#040f09',
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
                alert('Downloaded! Share it to your Instagram Story.');
            }
        } catch (err) { alert("Couldn't generate image."); }
        finally { setSharing(false); }
    };

    /* ─── filled bar segments ─── */
    const SEG = 20;
    const filled = Math.round((pct / 100) * SEG);

    return (
        <div style={{ maxWidth: 700, margin: '0 auto', padding: 8, ...mono }}>

            {/* ── Top window ── */}
            <div style={{
                background: 'linear-gradient(145deg,#3a3a3a,#1a1a1a)',
                border: '4px solid #555',
                borderRadius: 10,
                boxShadow: '0 0 0 2px #222, 6px 6px 20px rgba(0,0,0,0.7), 0 0 30px rgba(16,185,129,0.12)',
                marginBottom: 20,
                overflow: 'hidden'
            }}>
                {/* title bar */}
                <div style={{
                    background: 'linear-gradient(180deg,#2a6e3a,#1a4a28)',
                    padding: '6px 12px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderBottom: '2px solid #0a3a12',
                }}>
                    <span style={{ color: '#a8ffc0', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em' }}>
                        🖥  BB_PROFILE.EXE — OPERATIVE DOSSIER
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                        {['#ffb300', '#00b300', '#cc0000'].map((c, i) => (
                            <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,0.4)' }} />
                        ))}
                    </div>
                </div>

                {/* CRT content */}
                <div style={{
                    background: '#040f09',
                    backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 4px)',
                    padding: '20px 20px 16px'
                }}>
                    {/* Name row */}
                    <div style={{ marginBottom: 16 }}>
                        <p style={{ color: '#2e6e44', fontSize: '0.6rem', letterSpacing: '0.1em', marginBottom: 4 }}>
                            C:\&gt; OPERATIVE IDENTIFICATION_
                        </p>
                        {editing ? (
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <div style={{
                                    display: 'flex', border: '2px inset #1a5c2a', background: '#071510',
                                    boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.8)'
                                }}>
                                    <span style={{ background: 'linear-gradient(180deg,#2a6e3a,#1a4a28)', color: '#a8ffb8', padding: '6px 10px', fontSize: '0.7rem', fontWeight: 900, borderRight: '2px solid #1a5c2a' }}>{'>'}</span>
                                    <input
                                        autoFocus
                                        value={nameInput}
                                        onChange={e => setNameInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                                        style={{ ...mono, background: 'transparent', border: 'none', outline: 'none', color: '#6be585', fontSize: '1rem', padding: '6px 8px', fontWeight: 900 }}
                                    />
                                </div>
                                <Btn2k8 small onClick={handleSaveName}>SAVE</Btn2k8>
                                <Btn2k8 small onClick={() => setEditing(false)}>CANCEL</Btn2k8>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ color: '#6be585', fontSize: '1.6rem', fontWeight: 900, letterSpacing: '0.05em', textShadow: '0 0 10px rgba(107,229,133,0.6)' }}>
                                    {userData?.username || 'OPERATIVE'}
                                </span>
                                <Btn2k8 small onClick={() => { setNameInput(displayName); setEditing(true); }}>✎ EDIT NAME</Btn2k8>
                            </div>
                        )}
                        {dob && <p style={{ color: '#2e6e44', fontSize: '0.6rem', marginTop: 4 }}>DOB: {dob}</p>}
                        <p style={{ color: '#1a5c2a', fontSize: '0.6rem', marginTop: 2 }}>EMAIL: {user?.email}</p>
                    </div>

                    {/* Stats row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                        {[
                            { label: 'EPISODES LOGGED', val: watchedEpisodes.length, color: '#6be585' },
                            { label: 'FAVORITES SAVED', val: favorites.length, color: '#ffd700' },
                        ].map(s => (
                            <div key={s.label} style={{
                                border: `2px solid ${s.color}33`,
                                background: `${s.color}08`,
                                padding: '12px',
                                boxShadow: `inset 2px 2px 4px rgba(0,0,0,0.5), 0 0 8px ${s.color}22`
                            }}>
                                <p style={{ color: s.color, fontSize: '2rem', fontWeight: 900, textShadow: `0 0 10px ${s.color}` }}>{s.val}</p>
                                <p style={{ color: `${s.color}88`, fontSize: '0.6rem', letterSpacing: '0.1em', marginTop: 2 }}>{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Sign out */}
                    <Btn2k8 danger onClick={handleLogout}>⏻ SIGN OUT</Btn2k8>
                </div>
            </div>

            {/* ── Shareable Card ── */}
            <div style={{
                background: 'linear-gradient(145deg,#3a3a3a,#1a1a1a)',
                border: '4px solid #555',
                borderRadius: 10,
                boxShadow: '0 0 0 2px #222, 6px 6px 20px rgba(0,0,0,0.7)',
                overflow: 'hidden',
                marginBottom: 16
            }}>
                <div style={{
                    background: 'linear-gradient(180deg,#4a3f18,#2a2510)',
                    padding: '6px 12px',
                    borderBottom: '2px solid #2a1f08',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <span style={{ color: '#ffd700', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em' }}>
                        📸  BB_SHARE.EXE — INSTAGRAM STORY CARD
                    </span>
                </div>

                {/* The actual card that gets screenshotted */}
                <div ref={progressRef} style={{
                    background: '#040f09',
                    backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.1) 2px,rgba(0,0,0,0.1) 4px)',
                    padding: '24px',
                    ...mono
                }}>
                    {/* Header */}
                    <div style={{ borderBottom: '2px solid #1a5c2a', paddingBottom: 12, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <p style={{ color: '#2e6e44', fontSize: '0.55rem', letterSpacing: '0.15em', marginBottom: 4 }}>BREAKING BAD TRACKER v1.0 © 2008</p>
                            <p style={{ color: '#6be585', fontSize: '1.4rem', fontWeight: 900, textShadow: '0 0 12px rgba(107,229,133,0.6)', letterSpacing: '0.05em' }}>
                                {userData?.username?.toUpperCase() || 'OPERATIVE'}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ color: '#6be585', fontSize: '2rem', fontWeight: 900, textShadow: '0 0 15px rgba(107,229,133,0.8)', lineHeight: 1 }}>{pct}%</p>
                            <p style={{ color: '#2e6e44', fontSize: '0.55rem', letterSpacing: '0.1em' }}>COMPLETE</p>
                        </div>
                    </div>

                    {/* Retro segment bar */}
                    <p style={{ color: '#2e6e44', fontSize: '0.55rem', letterSpacing: '0.1em', marginBottom: 6 }}>C:\&gt; SERIES PROGRESS_</p>
                    <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
                        {Array.from({ length: SEG }).map((_, i) => (
                            <div key={i} style={{
                                flex: 1, height: 24,
                                background: i < filled
                                    ? 'linear-gradient(180deg,#a8ff78 0%,#3dba4e 50%,#1e7a2f 100%)'
                                    : '#071510',
                                border: i < filled ? '1px solid #155726' : '1px solid #0a2010',
                                boxShadow: i < filled ? '0 0 4px rgba(107,229,133,0.5)' : 'none',
                            }} />
                        ))}
                    </div>

                    {/* Stats row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #1a5c2a', paddingTop: 10, marginTop: 4 }}>
                        <span style={{ color: '#6be585', fontSize: '0.6rem' }}>EPISODES: <span style={{ color: '#a8ffc0', fontWeight: 900 }}>{watchedEpisodes.length}</span> / {TOTAL}</span>
                        <span style={{ color: '#6be585', fontSize: '0.6rem' }}>FAV: <span style={{ color: '#ffd700', fontWeight: 900 }}>{favorites.length}</span></span>
                        {dob && <span style={{ color: '#2e6e44', fontSize: '0.6rem' }}>DOB: {dob}</span>}
                    </div>
                    <p style={{ color: '#0f3020', fontSize: '0.5rem', marginTop: 8, textAlign: 'right', letterSpacing: '0.1em' }}>
                        HEISENBERG TRACKING SYSTEM — SECURE OUTPUT
                    </p>
                </div>

                {/* Share button area */}
                <div style={{ background: '#111', borderTop: '2px solid #222', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ ...mono, color: '#333', fontSize: '0.6rem' }}>
                        {sharing ? 'C:\\&gt; GENERATING..._' : 'C:\\&gt; READY TO EXPORT_'}
                    </p>
                    <button
                        onClick={handleShare}
                        disabled={sharing}
                        style={{
                            background: 'linear-gradient(180deg,#d080f0 0%,#9b46cc 45%,#6a1fa0 100%)',
                            border: '2px solid #450880',
                            boxShadow: '0 4px 0 #220055, inset 0 1px 0 rgba(230,190,255,0.5)',
                            color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.6)',
                            padding: '13px 36px', ...mono,
                            fontWeight: 900, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.18em',
                            cursor: sharing ? 'not-allowed' : 'pointer', opacity: sharing ? 0.7 : 1,
                            display: 'flex', alignItems: 'center', gap: 10, borderRadius: '4px',
                            minWidth: '220px', justifyContent: 'center'
                        }}
                    >
                        📤 {sharing ? 'PROCESSING...' : 'SHARE TO INSTAGRAM'}
                    </button>
                </div>
            </div>

            <p style={{ ...mono, color: '#1a5c2a', fontSize: '0.6rem', textAlign: 'center' }}>
                [i] On mobile: share menu opens. On desktop: image is downloaded for manual upload.
            </p>
        </div>
    );
}
