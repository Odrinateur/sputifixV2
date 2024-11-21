import { useStorage } from '@/context/StorageContext';
import { LoadingStates } from '@/types/common';
import { SimplifiedPlaylist, User } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';
import { PlaylistsGrid } from './ui/items-grid';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { RefreshPlaylistsButton } from './refresh';
import { Checkbox } from './ui/checkbox';

export function Playlists() {
    const { getUser, getUserPlaylists } = useStorage();
    const [playlists, setPlaylists] = useState<SimplifiedPlaylist[] | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [loadingState, setLoadingState] = useState<LoadingStates>('idle');
    const [originalPlaylists, setOriginalPlaylists] = useState<SimplifiedPlaylist[] | null>(null);
    const [showOnlyYours, setShowOnlyYours] = useState(false);

    useEffect(() => {
        (async () => {
            if (originalPlaylists) return;
            setLoadingState('loading');
            await getUserPlaylists().then((playlists) => {
                setOriginalPlaylists(playlists);
                setPlaylists(playlists);
                setLoadingState('idle');
            });
            getUser().then((user) => setUser(user));
        })();
    }, [getUserPlaylists, originalPlaylists, getUser]);

    useEffect(() => {
        (async () => {
            if (loadingState === 'loading') setPlaylists(null);
            else if (loadingState === 'end') {
                await getUserPlaylists().then((playlists) => {
                    setPlaylists(playlists);
                    setLoadingState('idle');
                });
            } else if (loadingState === 'idle') return;
        })();
    }, [loadingState, getUserPlaylists]);

    useEffect(() => {
        if (!originalPlaylists) return;
        let filteredPlaylists = originalPlaylists;

        if (globalFilter !== '') {
            filteredPlaylists = filteredPlaylists.filter((playlist) =>
                playlist.name.toLowerCase().includes(globalFilter.toLowerCase())
            );
        }

        if (showOnlyYours && user) {
            filteredPlaylists = filteredPlaylists.filter((playlist) => playlist.owner.id === user.id);
        }

        setPlaylists(filteredPlaylists);
    }, [globalFilter, originalPlaylists, showOnlyYours, user]);

    return (
        <div className="w-full space-y-4">
            <div className={'flex items-center gap-4'}>
                <Input
                    placeholder="Search tracks, artists or albums..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="w-full"
                />
                <div className="flex items-center space-x-2">
                    <Checkbox id="yours" onCheckedChange={(checked: boolean) => setShowOnlyYours(checked)} />
                    <label htmlFor="yours" className="text-sm font-medium w-max cursor-pointer">
                        Only yours
                    </label>
                </div>
                <RefreshPlaylistsButton setLoadingState={setLoadingState} />
            </div>
            <Card className={'w-full'}>
                <CardContent>
                    <PlaylistsGrid items={playlists} />
                </CardContent>
            </Card>
        </div>
    );
}
