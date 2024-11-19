import { TopItemsType } from '@/types/common.ts';
import { Artist } from '@spotify/web-api-ts-sdk';
import { ArtistsGrid } from '@/components/ui/items-grid';
import { TopItems } from '@/components/top-items/top-items';

export function TopArtists({ isHome = true }: { isHome?: boolean }) {
    return (
        <TopItems<Artist>
            isHome={isHome}
            itemType={'artists' as TopItemsType}
            title="Top Artists"
            GridComponent={ArtistsGrid}
        />
    );
}
