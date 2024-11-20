import { MainContainerWithNav } from '@/components/ui/main-container';
import { TopArtists } from '@/components/top-items/top-artists';

export function TopArtistsPage() {
    return (
        <MainContainerWithNav>
            <TopArtists isHome={false} />
        </MainContainerWithNav>
    );
}

export function TopTracksPage() {
    return (
        <MainContainerWithNav>
            <TopArtists isHome={false} />
        </MainContainerWithNav>
    );
}
