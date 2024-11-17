import type {Artist, Playlist, Track} from "@spotify/web-api-ts-sdk";
import {CardContent} from "@/components/ui/card.tsx";
import {
    ArtistCard,
    ArtistSkeleton,
    PlaylistCard,
    PlaylistSkeleton,
    TrackCard,
    TrackSkeleton
} from "@/components/ui/item-card.tsx";

interface ItemsGridProps {
    items: Artist[] | Track[] | Playlist[] | null;
    type: "Artists" | "Tracks" | "Playlists";
}

export default function ItemsGrid({items, type}: ItemsGridProps) {
    return <CardContent
        className={"grid grids-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full p-4 gap-4"}>
        {items ?
            items.map((item, index) => {
                switch (type) {
                    case "Artists":
                        return <ArtistCard artist={item as Artist} key={index}/>;
                    case "Tracks":
                        return <TrackCard track={item as Track} key={index}/>;
                    case "Playlists":
                        return <PlaylistCard playlist={item as Playlist} key={index}/>;
                }
            })
            :
            Array.from({length: 8}).map((_, index) => {
                switch (type) {
                    case "Artists":
                        return <ArtistSkeleton key={index}/>;
                    case "Tracks":
                        return <TrackSkeleton key={index}/>;
                    case "Playlists":
                        return <PlaylistSkeleton key={index}/>;
                }
            })
        }
    </CardContent>
}