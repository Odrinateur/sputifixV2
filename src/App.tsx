import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";
import {ThemeProvider} from '@/context/ThemeContext';
import Home from '@/pages/Home.tsx';
import Login from '@/pages/Login';
import Settings from '@/pages/Settings';
import Callback from "@/pages/Callback.tsx";
import {AuthProvider} from "@/context/AuthContext.tsx";
import {StorageProvider} from "@/context/StorageContext.tsx";


export default function App() {
    return (
        <AuthProvider>
            <StorageProvider>
                <ThemeProvider>
                    <Router>
                        <Routes>
                            <Route path="/" element={secureLocalStorage.getItem('logged_in') === null ? <Login/> : <Home/>}/>
                            <Route path="/callback" element={<Callback />} />
                            <Route path="/settings" element={<Settings/>}/>
                        </Routes>
                    </Router>
                </ThemeProvider>
            </StorageProvider>
        </AuthProvider>
    );
}