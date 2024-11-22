import { LikeTable } from '@/components/tracks-table/like-table';
import { MainContainerWithNav } from '@/components/ui/main-container';
import { H1 } from '@/components/ui/typography';

export function Likes() {
    return (
        <MainContainerWithNav>
            <H1>Your Likes</H1>
            <LikeTable />
        </MainContainerWithNav>
    );
}
