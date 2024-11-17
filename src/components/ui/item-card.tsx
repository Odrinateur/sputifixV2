import {Artist, Playlist, Track} from "@spotify/web-api-ts-sdk";
import {ReactNode} from "react";
import Cover from "@/components/ui/cover.tsx";
import {H3, H4} from "@/components/ui/typography.tsx";

function Container({children, isRelative = false}: { children: ReactNode, isRelative?: boolean }) {
    return <div
        className={`h-fit flex flex-col justify-start items-center text-card-foreground rounded-lg text-center ${isRelative ? 'relative' : ''}`}>{children}</div>;
}

function ArtistCard({artist}: { artist: Artist }) {
    return <Container isRelative>
        <Cover images={artist.images} coverType={"artist"}
               className={"w-max aspect-square rounded-lg brightness-[0.8]"}/>
        <H3 className={"absolute bottom-2"}>{artist.name}</H3>
    </Container>
}

function PlaylistCard({playlist}: { playlist: Playlist }) {
    return <Container>
        <Cover images={playlist.images} coverType={"playlist"} className={"w-max aspect-square rounded-lg"}/>
        <H3>{playlist.name}</H3>
        <H4>{playlist.owner.display_name}</H4>
    </Container>
}

function TrackCard({track}: { track: Track }) {
    return <Container>
        <Cover images={track.album.images} coverType={"track"} className={"w-max aspect-square rounded-lg"}/>
        <H3>{track.name}</H3>
        <H4>{track.artists.map(artist => artist.name).join(", ")}</H4>
    </Container>
}

export {ArtistCard, PlaylistCard, TrackCard};