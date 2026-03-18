import { NavLink, Outlet } from 'react-router-dom';
import { Film, Home, Users, Star, UserCircle2, LogIn, ShieldAlert } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import '../index.css';

export default function Layout() {
    const { user, isAdmin } = useAppContext();

    const baseNavItems = [
        { name: 'Dashboard', path: '/', icon: Home },
        { name: 'Episodes', path: '/episodes', icon: Film },
        { name: 'Favorites', path: '/favorites', icon: Star },
        { name: 'Characters', path: '/characters', icon: Users },
    ];

    // Dynamically append Profile, Admin, or Login
    const navItems = [
        ...baseNavItems,
        ...(user ? [
            { name: 'Profile', path: '/profile', icon: UserCircle2 },
            ...(isAdmin ? [{ name: 'Admin', path: '/admin', icon: ShieldAlert }] : [])
        ] : [
            { name: 'Log In', path: '/login', icon: LogIn }
        ])
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 glass border-b border-white-5 shadow-lg">
                <div className="container">
                    <div className="flex justify-between items-center h-16">

                        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform">
                            <div className="flex items-center gap-1 font-black text-2xl tracking-tighter">
                                <span className="bg-bb-green text-white px-2 py-1 rounded border border-green-700 shadow-sm drop-shadow-md">Br</span>
                                <span className="bg-bb-green text-white px-2 py-1 rounded border border-green-700 shadow-sm drop-shadow-md">Ba</span>
                                <span className="ml-1 text-white-high drop-shadow-sm font-bold">Tracker</span>
                            </div>
                        </div>

                        <nav className="hidden md:flex space-x-4">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${isActive
                                            ? 'bg-bb-green-20 text-white shadow-md border border-bb-green-30 scale-105'
                                            : 'text-white-med hover:text-white hover:bg-white-5 hover:scale-105'
                                        } ${(item.name === 'Profile' || item.name === 'Log In') && 'ml-4 border-l border-white-10 pl-4'}`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-bb-green' : ''}`} />
                                            {item.name}
                                            {item.name === 'Profile' && <span className="absolute top-2 right-2 w-2 h-2 bg-bb-green rounded-full animate-pulse"></span>}
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </nav>

                        {/* Mobile Nav Button Placeholder */}
                        <div className="md:hidden flex items-center">
                            <span className="text-white-dim text-xs font-medium">Menu below</span>
                        </div>

                    </div>
                </div>
            </header>

            <main className="flex-grow container w-full py-8">
                <div className="fade-in duration-500">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden sticky bottom-0 z-50 glass border-t border-white-5 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.3)]">
                <div className="flex justify-around items-center h-16 px-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `relative flex flex-col items-center gap-1 p-2 rounded-lg min-w-64px transition-all duration-300 ${isActive
                                    ? 'text-bb-green transform -translate-y-1'
                                    : 'text-white-dim hover:text-white-80 hover:-translate-y-0.5'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-xs font-bold whitespace-nowrap">{item.name}</span>
                            {item.name === 'Profile' && <span className="absolute top-1 right-2 w-1.5 h-1.5 bg-bb-green rounded-full"></span>}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </div>
    );
}
