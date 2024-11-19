import { TopItemsType } from '@/types/common.ts';
import { Track } from '@spotify/web-api-ts-sdk';
import { TracksGrid } from '@/components/ui/items-grid';
import TopItems from '@/components/top-items/top-items';

export function TopTracks({ isHome = true }: { isHome?: boolean }) {
    return (
        <TopItems<Track>
            isHome={isHome}
            itemType={'tracks' as TopItemsType}
            title="Top Tracks"
            GridComponent={TracksGrid}
        />
    );
}
