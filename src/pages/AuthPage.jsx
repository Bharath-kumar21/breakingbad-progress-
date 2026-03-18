import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../firebase';
import { useAppContext } from '../context/AppContext';

/* ─── helpers ─── */
const mono = { fontFamily: "'Courier New', Courier, monospace" };

/* 2008-style beveled button */
const Btn2k8 = ({ children, type = 'button', disabled, onClick, danger }) => (
    <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        style={{
            ...mono,
            background: danger
                ? 'linear-gradient(180deg,#ff8080 0%,#dd2222 45%,#aa0000 100%)'
                : 'linear-gradient(180deg,#c8ff9a 0%,#4ece60 45%,#228833 100%)',
            border: danger ? '2px solid #770000' : '2px solid #1a6b30',
            boxShadow: disabled ? 'none' : (danger
                ? '0 4px 0 #550000, inset 0 1px 0 rgba(255,210,210,0.5)'
                : '0 4px 0 #0d4a1a, inset 0 1px 0 rgba(210,255,210,0.6)'),
            color: '#fff',
            textShadow: '0 1px 2px rgba(0,0,0,0.6)',
            padding: '12px 32px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontWeight: 900,
            letterSpacing: '0.18em',
            fontSize: '0.78rem',
            textTransform: 'uppercase',
            opacity: disabled ? 0.6 : 1,
            borderRadius: '4px',
            minWidth: '160px',
        }}
    >
        {children}
    </button>
);

/* 2008-style flat input */
const Input2k8 = ({ label, prefix = 'C:\\>', ...props }) => (
    <div style={{ marginBottom: '12px' }}>
        <div style={{
            ...mono,
            fontSize: '0.65rem',
            color: '#6be585',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: '4px',
            textShadow: '0 0 6px rgba(107,229,133,0.7)'
        }}>
            {prefix} {label}
        </div>
        <div style={{
            display: 'flex',
            border: '2px inset #1a5c2a',
            background: '#071510',
            boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.8), inset -1px -1px 0 rgba(107,229,133,0.1)'
        }}>
            <span style={{
                background: 'linear-gradient(180deg,#2a6e3a 0%,#1a4a28 100%)',
                color: '#a8ffb8',
                padding: '6px 10px',
                fontSize: '0.7rem',
                fontWeight: 900,
                ...mono,
                borderRight: '2px solid #1a5c2a',
                userSelect: 'none'
            }}>{'>'}</span>
            <input
                {...props}
                style={{
                    ...mono,
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#6be585',
                    fontSize: '0.85rem',
                    padding: '6px 8px',
                    caretColor: '#6be585',
                }}
            />
        </div>
    </div>
);

/* ─── Component ─── */
export default function AuthPage({ isLogin = true }) {
    const { setDisplayName, setDob } = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [dobVal, setDobVal] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                if (name) setDisplayName(name);
                if (dobVal) setDob(dobVal);
            }
            navigate('/');
        } catch (err) {
            const code = err.code;
            if (code === 'auth/email-already-in-use') {
                setError('This email is already registered. Please log in instead.');
            } else if (code === 'auth/invalid-email') {
                setError('Invalid email address. Please check and try again.');
            } else if (code === 'auth/weak-password') {
                setError('Password is too weak. Use at least 6 characters.');
            } else if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
                setError('Incorrect email or password. Please try again.');
            } else {
                setError(err.message.replace('Firebase: ', ''));
            }
        } finally {
            setLoading(false);
        }
    };

    /* ─── Outer shell ─── */
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh', padding: '16px' }}>
            <div style={{ width: '100%', maxWidth: '440px' }}>

                {/* CRT Screen outer bezel */}
                <div style={{
                    background: 'linear-gradient(145deg,#3a3a3a 0%,#1e1e1e 40%,#111 100%)',
                    border: '4px solid #555',
                    borderRadius: '12px 12px 6px 6px',
                    boxShadow: '0 0 0 2px #222, 6px 6px 20px rgba(0,0,0,0.8), 0 0 40px rgba(16,185,129,0.15)',
                    padding: '6px',
                }}>

                    {/* Title bar */}
                    <div style={{
                        background: 'linear-gradient(180deg,#2a6e3a 0%,#1a4a28 100%)',
                        borderRadius: '7px 7px 0 0',
                        padding: '6px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '2px solid #0a3a12',
                    }}>
                        <span style={{ ...mono, fontSize: '0.7rem', color: '#a8ffc0', fontWeight: 900, letterSpacing: '0.1em' }}>
                            {isLogin ? '🖥  BB_AUTH.EXE  —  USER LOGIN' : '🖥  BB_AUTH.EXE  —  REGISTER'}
                        </span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {['#ffb300', '#00b300', '#cc0000'].map((c, i) => (
                                <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,0.4)' }} />
                            ))}
                        </div>
                    </div>

                    {/* Screen interior */}
                    <div style={{
                        background: '#040f09',
                        border: '3px inset #111',
                        padding: '20px',
                        position: 'relative',
                        overflow: 'hidden',
                        // scanlines
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
                    }}>
                        {/* Green glow */}
                        <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', filter: 'blur(30px)', pointerEvents: 'none' }} />

                        <p style={{ ...mono, color: '#6be585', fontSize: '0.65rem', marginBottom: 4, textShadow: '0 0 6px rgba(107,229,133,0.7)', letterSpacing: '0.08em' }}>
                            HEISENBERG SYSTEM v2.0 © 2008
                        </p>
                        <p style={{ ...mono, color: '#2e6e44', fontSize: '0.6rem', marginBottom: 20, letterSpacing: '0.06em' }}>
                            {isLogin ? 'C:\\&gt; INPUT CREDENTIALS TO PROCEED_' : 'C:\\&gt; NEW OPERATIVE REGISTRATION_'}
                        </p>

                        {error && (
                            <div style={{
                                border: '2px solid #cc0000',
                                background: 'rgba(100,0,0,0.4)',
                                color: '#ff9999',
                                padding: '8px 12px',
                                marginBottom: 16,
                                ...mono,
                                fontSize: '0.7rem',
                            }}>
                                !! ERROR: {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {!isLogin && (
                                <>
                                    <Input2k8 label="OPERATIVE NAME" type="text" placeholder="Heisenberg" value={name} onChange={e => setName(e.target.value)} required />
                                    <Input2k8 label="DATE OF BIRTH" type="date" value={dobVal} onChange={e => setDobVal(e.target.value)} required />
                                </>
                            )}
                            <Input2k8 label="EMAIL ADDRESS" type="email" placeholder="walter@white.com" value={email} onChange={e => setEmail(e.target.value)} required />
                            <Input2k8 label="ACCESS KEY" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength="6" />

                            <div style={{ marginTop: 20 }}>
                                <Btn2k8 type="submit" disabled={loading}>
                                    {loading ? 'PROCESSING...' : (isLogin ? '[ ENTER THE EMPIRE ]' : '[ COOK ]')}
                                </Btn2k8>
                            </div>
                        </form>

                        <div style={{ marginTop: 20, borderTop: '1px solid #1a4a28', paddingTop: 12, ...mono, fontSize: '0.65rem', color: '#2e6e44' }}>
                            {isLogin
                                ? <span>C:\&gt; No account? <Link to="/signup" style={{ color: '#6be585', textDecoration: 'underline' }}>REGISTER AS OPERATIVE</Link></span>
                                : <span>C:\&gt; Already registered? <Link to="/login" style={{ color: '#6be585', textDecoration: 'underline' }}>ACCESS THE SYSTEM</Link></span>
                            }
                        </div>
                    </div>

                    {/* Bottom bezel */}
                    <div style={{
                        background: 'linear-gradient(180deg,#2a2a2a 0%,#1a1a1a 100%)',
                        borderRadius: '0 0 8px 8px',
                        padding: '6px 14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                            {[0, 1, 2].map(i => (
                                <div key={i} style={{ width: 4, height: 10, background: i === 0 ? '#00cc44' : '#333', borderRadius: 1 }} />
                            ))}
                        </div>
                        <span style={{ ...mono, color: '#444', fontSize: '0.55rem' }}>BREAKING BAD TRACKER — SECURE TERMINAL</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
