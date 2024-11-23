import { Track } from '@spotify/web-api-ts-sdk';
import { TracksTable } from './tracks-table';
import { RefreshPlaylistButton } from '../refresh';

export function PlaylistTable({ tracks, id }: { tracks: Track[] | null; id: string }) {
    return <TracksTable tracks={tracks} RefreshButton={RefreshPlaylistButton} id={id} />;
}
