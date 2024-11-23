import { MainContainerWithNav } from '@/components/ui/main-container';
import { TopArtists } from '@/components/top-items/top-artists';
import { TopTracks } from '@/components/top-items/top-tracks';

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
            <TopTracks isHome={false} />
        </MainContainerWithNav>
    );
}
