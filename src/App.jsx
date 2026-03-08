import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Episodes from './pages/Episodes';
import Favorites from './pages/Favorites';
import Characters from './pages/Characters';

function App() {
    return (
        <AppProvider>
            <Router>
                <div className="bg-bb-dark text-white min-h-screen">
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="episodes" element={<Episodes />} />
                            <Route path="favorites" element={<Favorites />} />
                            <Route path="characters" element={<Characters />} />
                        </Route>
                    </Routes>
                </div>
            </Router>
        </AppProvider>
    );
}

export default App;
