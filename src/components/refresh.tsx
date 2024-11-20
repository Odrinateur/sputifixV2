import { useState } from 'react';
import { Button } from './ui/button';
import clsx from 'clsx';
import { RefreshCcw } from 'lucide-react';
import { useStorage } from '@/context/StorageContext';

interface RefreshButtonProps {
    onClick: () => Promise<void>;
    setEndLoading: (loading: boolean) => void;
}

function RefreshButton({ onClick, setEndLoading }: RefreshButtonProps) {
    const [loading, setLoadingState] = useState(false);

    const handleClick = async () => {
        setLoadingState(true);
        await onClick();
        setLoadingState(false);
        setEndLoading(true);
    };

    return (
        <Button variant="default" onClick={handleClick} disabled={loading}>
            <RefreshCcw className={'h-4 w-4' + clsx(loading && ' animate-spin')} />
        </Button>
    );
}

export const RefreshTopArtistsButton = ({ setEndLoading }: { setEndLoading: (loading: boolean) => void }) => {
    const { refreshUserTopItems } = useStorage();
    const handleRefresh = async () => {
        await refreshUserTopItems('artists', 50);
    };
    return <RefreshButton onClick={handleRefresh} setEndLoading={setEndLoading} />;
};

export const RefreshTopTracksButton = ({ setEndLoading }: { setEndLoading: (loading: boolean) => void }) => {
    const { refreshUserTopItems } = useStorage();
    const handleRefresh = async () => {
        await refreshUserTopItems('tracks', 50);
    };
    return <RefreshButton onClick={handleRefresh} setEndLoading={setEndLoading} />;
};

export const RefreshLikesButton = ({ setEndLoading }: { setEndLoading: (loading: boolean) => void }) => {
    const { refreshLikes } = useStorage();
    const handleRefresh = async () => {
        await refreshLikes();
    };
    return <RefreshButton onClick={handleRefresh} setEndLoading={setEndLoading} />;
};
