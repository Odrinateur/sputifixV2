import { PlaylistCard } from '@/components/playlist-card';
import { PlaylistTable } from '@/components/tracks-table/playlist-table';
import { MainContainerWithNav } from '@/components/ui/main-container';
import { useNavigate, useParams } from 'react-router-dom';
import { useStorage } from '@/context/StorageContext';
import { useEffect, useState } from 'react';
import { SimplifiedPlaylist, Track } from '@spotify/web-api-ts-sdk';

export function PlaylistPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getPlaylist } = useStorage();
    const [playlist, setPlaylist] = useState<SimplifiedPlaylist | null>(null);
    const [tracks, setTracks] = useState<Track[] | null>(null);

    useEffect(() => {
        if (!id) return;

        (async () => {
            const [playlistData, playlistTracks] = await getPlaylist(id);
            if (!playlistData && !playlistTracks) {
                navigate('/playlists');
                return;
            }
            setPlaylist(playlistData);
            setTracks(playlistTracks);
        })();
    }, [id, getPlaylist, navigate]);

    if (!id) {
        navigate('/playlists');
        return null;
    }

    return (
        <MainContainerWithNav>
            <PlaylistCard playlist={playlist} />
            <PlaylistTable tracks={tracks} id={id} />
        </MainContainerWithNav>
    );
}
