import { TopItemsType } from "@/types/common.ts";
import { Artist, Track } from "@spotify/web-api-ts-sdk";
import { ArtistsGrid, TracksGrid } from "@/components/ui/items-grid";
import TopItems from "@/components/top-items";

export function TopArtists({ isHome = true }: { isHome?: boolean }) {
    return (
        <TopItems<Artist>
            isHome={isHome}
            itemType={"Artists" as TopItemsType}
            title="Top Artists"
            GridComponent={ArtistsGrid}
        />
    );
}

export function TopTracks({ isHome = true }: { isHome?: boolean }) {
    return (
        <TopItems<Track>
            isHome={isHome}
            itemType={"Tracks" as TopItemsType}
            title="Top Tracks"
            GridComponent={TracksGrid}
        />
    );
}
