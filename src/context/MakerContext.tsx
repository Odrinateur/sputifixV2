import { IncludeGroupsType } from '@/types/common';
import { Artist, SimplifiedPlaylist, SimplifiedTrack, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { createContext, ReactNode, useContext } from 'react';

type MakerContextType = {
    searchArtistByName: (q: string) => Promise<Artist[]>;
    processPlaylists: (playlists: SimplifiedPlaylist[], artists: Artist[]) => void;
};

const MakerContext = createContext<MakerContextType | undefined>(undefined);

export const MakerProvider = ({ sdk, children }: { sdk: SpotifyApi; children: ReactNode }) => {
    const searchArtistByName = async (q: string): Promise<Artist[]> => {
        const results = await sdk.search(q, ['artist']);
        return results.artists.items;
    };

    const processPlaylists = async (playlists: SimplifiedPlaylist[], artists: Artist[]) => {
        if (artists.length === 0 && playlists.length === 0) return;

        const artistTracksCache = new Map<string, SimplifiedTrack[]>();

        if (artists.length === 0) {
            for (const playlist of playlists) await processOnePlaylist(playlist, [], artistTracksCache);
            return;
        } else if (playlists.length === 0) {
            await processOnePlaylist(null, artists, artistTracksCache);
            return;
        }

        for (const playlist of playlists) {
            await processOnePlaylist(playlist, artists, artistTracksCache);
            await new Promise((resolve) => setTimeout(resolve, 30000));
        }
    };

    const processOnePlaylist = async (
        playlist: SimplifiedPlaylist | null,
        artists: Artist[],
        artistTracksCache: Map<string, SimplifiedTrack[]>
    ) => {
        let artistIds: string[] = artists.map((artist) => artist.id);

        if (playlist) {
            let artistsIdsDescription = playlist.description;
            if (artistsIdsDescription && artistsIdsDescription.startsWith('ids: ')) {
                artistsIdsDescription = artistsIdsDescription.replace('ids: ', '');
                const descriptionArtistIds = artistsIdsDescription.split(',');
                if (descriptionArtistIds) {
                    artistIds = [...new Set([...artistIds, ...descriptionArtistIds])];
                }
            }
        }

        console.log(artistIds, playlist, playlist?.name);

        if (artistIds.length === 0) return;

        const artistTracks = [];
        for (const artistId of artistIds) {
            let tracks: SimplifiedTrack[];

            if (artistTracksCache.has(artistId)) {
                tracks = artistTracksCache.get(artistId)!;
            } else {
                tracks = [];
                tracks.push(...(await getArtistUniqueTracks(artistId, 'album')));
                tracks.push(...(await getArtistUniqueTracks(artistId, 'single')));
                tracks.push(...(await getArtistUniqueTracks(artistId, 'appears_on')));
                artistTracksCache.set(artistId, tracks);
            }

            artistTracks.push(...tracks);

            await new Promise((resolve) => setTimeout(resolve, 10000));
        }

        const playlistTracks = playlist ? await getPlaylistTracks(playlist) : undefined;

        const uniqueTracks = removeDuplicates(artistTracks, playlistTracks);

        if (playlist) {
            if (uniqueTracks.length !== 0) {
                const trackUris = uniqueTracks.map((track) => track.uri);
                for (let i = 0; i < trackUris.length; i += 50) {
                    const batch = trackUris.slice(i, i + 50);
                    await sdk.playlists.addItemsToPlaylist(playlist.id, batch);
                }
            }
            await sdk.playlists.changePlaylistDetails(playlist.id, {
                description: `ids: ${artistIds.join(',')}`,
            });
        } else {
            const newPlaylist = await sdk.playlists.createPlaylist((await sdk.currentUser.profile()).id, {
                name: artists.map((artist) => artist.name).join('/ '),
                description: `ids: ${artists.map((artist) => artist.id).join(',')}`,
            });

            const trackUris = uniqueTracks.map((track) => track.uri);
            for (let i = 0; i < trackUris.length; i += 50) {
                const batch = trackUris.slice(i, i + 50);
                await sdk.playlists.addItemsToPlaylist(newPlaylist.id, batch);
            }
        }
    };

    const getArtistUniqueTracks = async (artist_id: string, includeGroups: IncludeGroupsType) => {
        const albums = [];
        let response = await sdk.artists.albums(artist_id, includeGroups, undefined, 50, 0);
        albums.push(...response.items);

        while (response.next) {
            response = await sdk.makeRequest('GET', response.next.replace('https://api.spotify.com/v1', ''));
            albums.push(...response.items);
        }

        const tracks = [];
        for (const album of albums) {
            let response = await sdk.albums.tracks(album.id, undefined, 50, 0);
            if (includeGroups !== 'appears_on') tracks.push(...response.items);
            else tracks.push(...response.items.filter((track) => track.artists.some((a) => a.id === artist_id)));

            while (response.next) {
                response = await sdk.makeRequest('GET', response.next.replace('https://api.spotify.com/v1', ''));
                if (includeGroups !== 'appears_on') tracks.push(...response.items);
                else tracks.push(...response.items.filter((track) => track.artists.some((a) => a.id === artist_id)));
            }
        }
        return tracks;
    };

    const removeDuplicates = (tracks: SimplifiedTrack[], playlistTracks?: SimplifiedTrack[]) => {
        const uniqueTracks: SimplifiedTrack[] = [];

        for (const track of tracks) {
            let isDuplicate = false;

            for (let i = 0; i < uniqueTracks.length; i++) {
                if (track.name === uniqueTracks[i].name) {
                    if (track.explicit) {
                        uniqueTracks.splice(i, 1);
                        uniqueTracks.push(track);
                    }
                    isDuplicate = true;
                    break;
                }
            }

            if (playlistTracks) {
                isDuplicate = playlistTracks.some(
                    (playlistTrack) =>
                        playlistTrack.name.toLowerCase() === track.name.toLowerCase() &&
                        playlistTrack.duration_ms === track.duration_ms
                );
            }

            if (!isDuplicate) {
                uniqueTracks.push(track);
            }
        }

        return uniqueTracks;
    };

    const getPlaylistTracks = async (playlist: SimplifiedPlaylist) => {
        const tracks = [];
        let response = await sdk.playlists.getPlaylistItems(playlist.id, undefined, undefined, 50, 0);
        tracks.push(...response.items);

        while (response.next) {
            response = await sdk.makeRequest('GET', response.next.replace('https://api.spotify.com/v1/', ''));
            tracks.push(...response.items);
        }

        return tracks.map((item) => item.track);
    };

    const maker = {
        searchArtistByName,
        processPlaylists,
    };

    return <MakerContext.Provider value={maker}>{children}</MakerContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMaker = () => {
    const context = useContext(MakerContext);
    if (!context) {
        throw new Error('useMaker must be used within a MakerProvider');
    }
    return context;
};
