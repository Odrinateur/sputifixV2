import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Index from '@/pages/Index';
import {ThemeProvider} from '@/context/ThemeContext';
import Settings from '@/pages/Settings';

export default function App() {
    return (
        <ThemeProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Index/>}/>
                    <Route path="/settings" element={<Settings/>}/>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}