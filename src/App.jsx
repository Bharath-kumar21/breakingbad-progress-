import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Episodes from './pages/Episodes';
import Favorites from './pages/Favorites';
import Characters from './pages/Characters';
import Profile from './pages/Profile';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
    return (
        <AppProvider>
            <Router>
                <div className="bg-bb-dark text-white min-h-screen">
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="episodes" element={<Episodes />} />
                            <Route path="characters" element={<Characters />} />

                            {/* Auth Routes */}
                            <Route path="login" element={<AuthPage isLogin={true} />} />
                            <Route path="signup" element={<AuthPage isLogin={false} />} />

                            {/* Protected Routes */}
                            <Route path="favorites" element={
                                <ProtectedRoute>
                                    <Favorites />
                                </ProtectedRoute>
                            } />
                            <Route path="profile" element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            } />
                            <Route path="admin" element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            } />
                        </Route>
                    </Routes>
                </div>
            </Router>
        </AppProvider>
    );
}

export default App;
