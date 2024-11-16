import {Artist, Playlist, Track} from "@spotify/web-api-ts-sdk";
import {ReactNode} from "react";
import Cover from "@/components/ui/cover.tsx";
import {H3, H4} from "@/components/ui/typography.tsx";

function Container({children}: { children: ReactNode }) {
    return <div
        className="h-fit flex flex-col justify-start items-center p-2 gap-2 border text-card-foreground shadow-sm rounded-lg text-center">{children}</div>;
}

function ArtistCard({artist}: { artist: Artist }) {
    return <Container>
        <Cover images={artist.images} coverType={"artist"} className={"w-max aspect-square rounded-lg"}/>
        <H3>{artist.name}</H3>
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