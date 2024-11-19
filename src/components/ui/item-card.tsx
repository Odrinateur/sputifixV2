import { Artist, Playlist, Track } from '@spotify/web-api-ts-sdk';
import { ReactNode } from 'react';
import { Cover } from '@/components/ui/cover.tsx';
import { H3, H4 } from '@/components/ui/typography.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';

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
            className={`h-fit flex flex-col justify-start items-center text-card-foreground rounded-lg text-center ${
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
                className={'w-max aspect-square rounded-lg brightness-[0.8]'}
            />
            <H3 className={'absolute bottom-2'}>{artist.name}</H3>
        </Container>
    );
}

function PlaylistCard({ playlist }: { playlist: Playlist }) {
    return (
        <Container>
            <Cover images={playlist.images} coverType={'playlist'} className={'w-max aspect-square rounded-lg'} />
            <H3>{playlist.name}</H3>
            <H4>{playlist.owner.display_name}</H4>
        </Container>
    );
}

function TrackCard({ track }: { track: Track }) {
    return (
        <Container>
            <Cover images={track.album.images} coverType={'track'} className={'w-max aspect-square rounded-lg'} />
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

export { ArtistCard, PlaylistCard, TrackCard, ArtistSkeleton, PlaylistSkeleton, TrackSkeleton };
