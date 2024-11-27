import { Artist, SimplifiedPlaylist, Track } from '@spotify/web-api-ts-sdk';
import { ReactNode } from 'react';
import { Cover } from '@/components/ui/cover.tsx';
import { H3, H4 } from '@/components/ui/typography.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Link } from 'react-router-dom';
import { Checkbox } from './checkbox';

function Container({
    children,
    className = '',
    isRelative = false,
}: {
    children: ReactNode;
    className?: string;
    isRelative?: boolean;
}) {
    return (
        <div
            className={`h-full flex flex-col justify-start items-center text-card-foreground rounded-lg text-center ${
                isRelative ? 'relative' : ''
            } ${className}`}
        >
            {children}
        </div>
    );
}

function ArtistCard({ artist }: { artist: Artist }) {
    return (
        <Container isRelative>
            <Cover
                images={artist.images}
                coverType={'artist'}
                className={'w-full aspect-square rounded-lg brightness-[0.8]'}
            />
            <H3 className={'absolute bottom-2'}>{artist.name}</H3>
        </Container>
    );
}

function ArtistWithSelectCard({
    artist,
    addArtist,
    removeArtist,
    isSelected,
}: {
    artist: Artist;
    addArtist: (artist: Artist) => void;
    removeArtist: (artist: Artist) => void;
    isSelected: boolean;
}) {
    return (
        <Container>
            <Cover
                images={artist.images}
                coverType={'artist'}
                className={'w-full aspect-square rounded-lg brightness-[0.8]'}
            />
            <div className={'w-full flex justify-center items-center'}>
                <H3 className={'w-4/5 truncate'}>{artist.name}</H3>
                <Checkbox
                    className={'size-6 border-2'}
                    checked={isSelected}
                    onCheckedChange={(checked: boolean) => {
                        if (checked) {
                            addArtist(artist);
                        } else {
                            removeArtist(artist);
                        }
                    }}
                />
            </div>
        </Container>
    );
}

function PlaylistCard({ playlist }: { playlist: SimplifiedPlaylist }) {
    return (
        <Link to={`/playlist/${playlist.id}`}>
            <Container>
                <Cover images={playlist.images} coverType={'playlist'} className={'w-full aspect-square rounded-lg'} />
                <H3>{playlist.name}</H3>
                <H4>{playlist.owner.display_name}</H4>
            </Container>
        </Link>
    );
}

function PlaylistWithSelectCard({
    playlist,
    addPlaylist,
    removePlaylist,
    isSelected,
}: {
    playlist: SimplifiedPlaylist;
    addPlaylist: (playlist: SimplifiedPlaylist) => void;
    removePlaylist: (playlist: SimplifiedPlaylist) => void;
    isSelected: boolean;
}) {
    return (
        <Container>
            <Cover images={playlist.images} coverType={'playlist'} className={'w-full aspect-square rounded-lg'} />
            <div className={'w-full flex justify-center items-center'}>
                <H3 className={'w-4/5 truncate'}>{playlist.name}</H3>
                <Checkbox
                    className={'size-6 border-2'}
                    checked={isSelected}
                    onCheckedChange={(checked: boolean) => {
                        if (checked) {
                            addPlaylist(playlist);
                        } else {
                            removePlaylist(playlist);
                        }
                    }}
                />
            </div>
        </Container>
    );
}

function TrackCard({ track }: { track: Track }) {
    return (
        <Container>
            <Cover images={track.album.images} coverType={'track'} className={'w-full aspect-square rounded-lg'} />
            <H3>{track.name}</H3>
            <H4>{track.artists.map((artist) => artist.name).join(', ')}</H4>
        </Container>
    );
}

function ArtistSkeleton() {
    return (
        <Container isRelative className={'w-full'}>
            <Skeleton className={'w-full aspect-square rounded-lg'} />
            <Skeleton className={'absolute bottom-2 w-2/3 h-6'} />
        </Container>
    );
}

function PlaylistSkeleton() {
    return (
        <Container className={'gap-1'}>
            <Skeleton className={'w-full aspect-square rounded-lg'} />
            <Skeleton className={'w-2/3 h-6'} />
            <Skeleton className={'w-1/2 h-6'} />
        </Container>
    );
}

function TrackSkeleton() {
    return (
        <Container className={'gap-1'}>
            <Skeleton className={'w-full aspect-square rounded-lg'} />
            <Skeleton className={'w-2/3 h-6'} />
            <Skeleton className={'w-1/2 h-6'} />
        </Container>
    );
}

export {
    ArtistCard,
    ArtistWithSelectCard,
    PlaylistCard,
    PlaylistWithSelectCard,
    TrackCard,
    ArtistSkeleton,
    PlaylistSkeleton,
    TrackSkeleton,
};
