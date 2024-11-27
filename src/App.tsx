import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from '@/pages/Home.tsx';
import { Settings } from '@/pages/Settings';
import { useSpotify } from '@/hooks/useSpotify.ts';
import { StorageProvider } from '@/context/StorageContext.tsx';
import { Likes } from '@/pages/Likes.tsx';
import { TopArtistsPage, TopTracksPage } from '@/pages/TopItems.tsx';
import { PlaylistsPage } from '@/pages/Playlists';
import { PlaylistPage } from './pages/Playlist';
import { Maker } from './pages/maker/Maker';
import { MakerProvider } from './context/MakerContext';
import { ArtistPlaylist } from './pages/maker/ArtistPlaylist';

export default function App() {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUrl = import.meta.env.VITE_REDIRECT_URL;
    const scopes = import.meta.env.VITE_SPOTIFY_SCOPES.split(' ');
    const sdk = useSpotify(clientId, redirectUrl, scopes);

    return sdk ? (
        <StorageProvider sdk={sdk}>
            <MakerProvider sdk={sdk}>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/likes" element={<Likes />} />
                        <Route path="/playlists" element={<PlaylistsPage />} />
                        <Route path="/playlist/:id" element={<PlaylistPage />} />
                        <Route path="/top/artists" element={<TopArtistsPage />} />
                        <Route path="/top/tracks" element={<TopTracksPage />} />
                        <Route path="/settings" element={<Settings />} />

                        <Route path="/maker" element={<Maker />} />
                        <Route path="/maker/artist-playlist" element={<ArtistPlaylist />} />

                        <Route path="*" element={<Home />} />
                    </Routes>
                </Router>
            </MakerProvider>
        </StorageProvider>
    ) : (
        <></>
    );
}
