import { useStorage } from '@/context/StorageContext';
import { Track } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';
import { TracksTable } from './tracks-table';
import { RefreshPlaylistButton } from '../refresh';

export function PlaylistTable({ id }: { id: string }) {
    const { getPlaylist } = useStorage();
    const [tracks, setTracks] = useState<Track[] | null>(null);

    useEffect(() => {
        (async () => {
            if (tracks) return;
            await getPlaylist(id).then(([, playlistTracks]) => setTracks(playlistTracks));
        })();
    }, [getPlaylist, tracks, id]);

    return <TracksTable tracks={tracks} RefreshButton={RefreshPlaylistButton} id={id} />;
}
