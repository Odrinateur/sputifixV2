import { TopArtists } from '@/components/top-items/top-artists';
import { TopTracks } from '@/components/top-items/top-tracks';
import { MainContainerWithNav } from '@/components/ui/main-container.tsx';
import UserCard from '@/components/user-card.tsx';

export default function Home() {
    return (
        <MainContainerWithNav>
            <UserCard />
            <TopArtists isHome />
            <TopTracks isHome />
        </MainContainerWithNav>
    );
}
