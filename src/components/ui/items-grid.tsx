import type { Artist, Playlist, Track } from "@spotify/web-api-ts-sdk";
import { CardContent } from "@/components/ui/card.tsx";
import {
    ArtistCard,
    ArtistSkeleton,
    PlaylistCard,
    PlaylistSkeleton,
    TrackCard,
    TrackSkeleton,
} from "@/components/ui/item-card.tsx";

interface ItemsGridProps<T> {
    items: T[] | null;
    ItemComponent: React.ComponentType<{ item: T }>;
    SkeletonComponent: React.ComponentType;
}

function ItemsGrid<T>({
    items,
    ItemComponent,
    SkeletonComponent,
}: ItemsGridProps<T>) {
    return (
        <CardContent className="grid grids-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full p-4 gap-4">
            {items
                ? items.map((item, index) => (
                      <ItemComponent item={item} key={index} />
                  ))
                : Array.from({ length: 8 }).map((_, index) => (
                      <SkeletonComponent key={index} />
                  ))}
        </CardContent>
    );
}

export const ArtistsGrid = ({ items }: { items: Artist[] | null }) => (
    <ItemsGrid
        items={items}
        ItemComponent={({ item }) => <ArtistCard artist={item} />}
        SkeletonComponent={ArtistSkeleton}
    />
);

export const PlaylistsGrid = ({ items }: { items: Playlist[] | null }) => (
    <ItemsGrid
        items={items}
        ItemComponent={({ item }) => <PlaylistCard playlist={item} />}
        SkeletonComponent={PlaylistSkeleton}
    />
);

export const TracksGrid = ({ items }: { items: Track[] | null }) => (
    <ItemsGrid
        items={items}
        ItemComponent={({ item }) => <TrackCard track={item} />}
        SkeletonComponent={TrackSkeleton}
    />
);
