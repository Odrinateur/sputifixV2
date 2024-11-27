import type { Artist, SimplifiedPlaylist, Track } from '@spotify/web-api-ts-sdk';
import { CardContent } from '@/components/ui/card.tsx';
import {
    ArtistCard,
    ArtistSkeleton,
    ArtistWithSelectCard,
    PlaylistCard,
    PlaylistSkeleton,
    PlaylistWithSelectCard,
    TrackCard,
    TrackSkeleton,
} from '@/components/ui/item-card.tsx';

interface ItemsGridProps<T> {
    items: T[] | null;
    ItemComponent: React.ComponentType<{ item: T }>;
    SkeletonComponent: React.ComponentType;
}

function ItemsGrid<T>({ items, ItemComponent, SkeletonComponent }: ItemsGridProps<T>) {
    return (
        <CardContent className="grid grids-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full p-4 gap-4">
            {items
                ? items.map((item, index) => <ItemComponent item={item} key={index} />)
                : Array.from({ length: 8 }).map((_, index) => <SkeletonComponent key={index} />)}
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

export const ArtistsWithSelectGrid = ({
    items,
    addArtist,
    removeArtist,
    selectedArtists,
}: {
    items: Artist[] | null;
    addArtist: (artist: Artist) => void;
    removeArtist: (artist: Artist) => void;
    selectedArtists: Artist[] | null;
}) => (
    <ItemsGrid
        items={items}
        ItemComponent={({ item }) => (
            <ArtistWithSelectCard
                artist={item}
                addArtist={addArtist}
                removeArtist={removeArtist}
                isSelected={selectedArtists?.some((a) => a.id === item.id) ?? false}
            />
        )}
        SkeletonComponent={() => <></>}
    />
);

export const PlaylistsGrid = ({ items }: { items: SimplifiedPlaylist[] | null }) => (
    <ItemsGrid
        items={items}
        ItemComponent={({ item }) => <PlaylistCard playlist={item} />}
        SkeletonComponent={PlaylistSkeleton}
    />
);

export const PlaylistWithSelectGrid = ({
    items,
    addPlaylist,
    removePlaylist,
    selectedPlaylists,
}: {
    items: SimplifiedPlaylist[] | null;
    addPlaylist: (playlist: SimplifiedPlaylist) => void;
    removePlaylist: (playlist: SimplifiedPlaylist) => void;
    selectedPlaylists: SimplifiedPlaylist[] | null;
}) => (
    <ItemsGrid
        items={items}
        ItemComponent={({ item }) => (
            <PlaylistWithSelectCard
                playlist={item}
                addPlaylist={addPlaylist}
                removePlaylist={removePlaylist}
                isSelected={selectedPlaylists?.some((p) => p.id === item.id) ?? false}
            />
        )}
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
