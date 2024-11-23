import { PlaylistCard } from '@/components/playlist-card';
import { PlaylistTable } from '@/components/tracks-table/playlist-table';
import { MainContainerWithNav } from '@/components/ui/main-container';
import { useNavigate, useParams } from 'react-router-dom';

export function PlaylistPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    if (!id) {
        navigate('/playlists');
        return null;
    }

    return (
        <MainContainerWithNav>
            <PlaylistCard id={id} />
            <PlaylistTable id={id} />
        </MainContainerWithNav>
    );
}
