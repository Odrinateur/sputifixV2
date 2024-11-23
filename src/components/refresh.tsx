import { useState } from 'react';
import { Button } from './ui/button';
import clsx from 'clsx';
import { RefreshCcw } from 'lucide-react';
import { useStorage } from '@/context/StorageContext';
import { LoadingStates } from '@/types/common';

interface RefreshButtonProps {
    onClick: () => Promise<void>;
    setLoadingState?: (value: LoadingStates) => void;
}

function RefreshButton({ onClick, setLoadingState }: RefreshButtonProps) {
    const [isLoading, setIsLoadingState] = useState(false);

    const handleClick = async () => {
        setIsLoadingState(true);
        setLoadingState?.('loading');
        await onClick().then(() => {
            setLoadingState?.('end');
            setIsLoadingState(false);
        });
    };

    return (
        <Button variant="default" onClick={handleClick} disabled={isLoading}>
            <RefreshCcw className={'h-4 w-4' + clsx(isLoading && ' animate-spin')} />
        </Button>
    );
}

export const RefreshTopArtistsButton = ({ setLoadingState }: { setLoadingState?: (value: LoadingStates) => void }) => {
    const { refreshUserTopItems } = useStorage();
    const handleRefresh = async () => {
        await refreshUserTopItems('artists', 50);
    };
    return <RefreshButton onClick={handleRefresh} setLoadingState={setLoadingState} />;
};

export const RefreshTopTracksButton = ({ setLoadingState }: { setLoadingState?: (value: LoadingStates) => void }) => {
    const { refreshUserTopItems } = useStorage();
    const handleRefresh = async () => {
        await refreshUserTopItems('tracks', 50);
    };
    return <RefreshButton onClick={handleRefresh} setLoadingState={setLoadingState} />;
};

export const RefreshLikesButton = ({ setLoadingState }: { setLoadingState?: (value: LoadingStates) => void }) => {
    const { refreshLikes } = useStorage();
    const handleRefresh = async () => {
        await refreshLikes();
    };
    return <RefreshButton onClick={handleRefresh} setLoadingState={setLoadingState} />;
};

export const RefreshPlaylistsButton = ({ setLoadingState }: { setLoadingState?: (value: LoadingStates) => void }) => {
    const { refreshPlaylists } = useStorage();
    const handleRefresh = async () => {
        await refreshPlaylists();
    };
    return <RefreshButton onClick={handleRefresh} setLoadingState={setLoadingState} />;
};

export const RefreshPlaylistButton = ({
    id,
    setLoadingState,
}: {
    id?: string;
    setLoadingState: (value: LoadingStates) => void;
}) => {
    const { refreshPlaylist } = useStorage();
    const handleRefresh = async () => {
        if (!id) return;
        await refreshPlaylist(id);
    };
    return <RefreshButton onClick={handleRefresh} setLoadingState={setLoadingState} />;
};
