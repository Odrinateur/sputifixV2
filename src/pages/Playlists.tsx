import { Playlists } from '@/components/playlists';
import { MainContainerWithNav } from '@/components/ui/main-container';
import { H1 } from '@/components/ui/typography';

export function PlaylistsPage() {
    return (
        <MainContainerWithNav>
            <H1>Your Playlists</H1>
            <Playlists />
        </MainContainerWithNav>
    );
}
