import { useStorage } from '@/context/StorageContext';
import { Track } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';
import { TracksTable } from './tracks-table';
import { RefreshLikesButton } from '../refresh';

export function LikeTable() {
    const { getUserLikes } = useStorage();
    const [likes, setLikes] = useState<Track[] | null>(null);

    useEffect(() => {
        (async () => {
            if (likes) return;
            await getUserLikes().then((tracks) => {
                if (tracks) {
                    setLikes(tracks.map((track) => track.track));
                } else {
                    setLikes([]);
                }
            });
        })();
    }, [getUserLikes, likes]);

    return <TracksTable tracks={likes} RefreshButton={RefreshLikesButton} />;
}
