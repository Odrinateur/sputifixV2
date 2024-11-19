import { MainContainerWithNav } from '@/components/ui/main-container';
import { TopArtists } from '@/components/top-items/top-artists';

export function TopArtistsPage() {
    return (
        <MainContainerWithNav>
            <TopArtists isHome />
        </MainContainerWithNav>
    );
}

export function TopTracksPage() {
    return (
        <MainContainerWithNav>
            <TopArtists isHome />
        </MainContainerWithNav>
    );
}
