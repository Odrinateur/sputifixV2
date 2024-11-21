import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { Home } from '@/pages/Home.tsx';
import { Settings } from '@/pages/Settings';
import { useSpotify } from '@/hooks/useSpotify.ts';
import { StorageProvider } from '@/context/StorageContext.tsx';
import { Likes } from '@/pages/Likes.tsx';
import { TopArtistsPage, TopTracksPage } from '@/pages/TopItems.tsx';
import { PlaylistsPage } from '@/pages/Playlists';

export default function App() {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUrl = import.meta.env.VITE_REDIRECT_URL;
    const scopes = import.meta.env.VITE_SPOTIFY_SCOPES.split(' ');
    const sdk = useSpotify(clientId, redirectUrl, scopes);

    return sdk ? (
        <StorageProvider sdk={sdk}>
            <ThemeProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/likes" element={<Likes />} />
                        <Route path="/playlists" element={<PlaylistsPage />} />
                        <Route path="/top/artists" element={<TopArtistsPage />} />
                        <Route path="/top/tracks" element={<TopTracksPage />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </Router>
            </ThemeProvider>
        </StorageProvider>
    ) : (
        <></>
    );
}
