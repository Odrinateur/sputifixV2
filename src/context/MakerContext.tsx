import { IncludeGroupsType, ProcessedPlaylist, StoredPlaylist } from '@/types/common';
import { Artist, SpotifyApi, Track } from '@spotify/web-api-ts-sdk';
import { createContext, ReactNode, useContext, useRef } from 'react';
import { useStorage } from './StorageContext';

type MakerContextType = {
    searchArtistByName: (q: string) => Promise<Artist[]>;
    processPlaylists: (playlists: StoredPlaylist[], artists: Artist[]) => Promise<ProcessedPlaylist[]>;
};

const MakerContext = createContext<MakerContextType | undefined>(undefined);

export const MakerProvider = ({ sdk, children }: { sdk: SpotifyApi; children: ReactNode }) => {
    const storage = useStorage();
    const requestCounter = useRef(0);

    const handleRequestCount = async () => {
        requestCounter.current++;
        if (requestCounter.current >= 70) {
            await new Promise((resolve) => setTimeout(resolve, 20000));
            requestCounter.current = 0;
        }
    };

    const searchArtistByName = async (q: string): Promise<Artist[]> => {
        await handleRequestCount();
        const results = await sdk.search(q, ['artist']);
        return results.artists.items;
    };

    const removeArtistNotUpdatedSinceLastPlaylistUpdate = async (
        artistIds: string[],
        playlist: StoredPlaylist
    ): Promise<string[]> => {
        const lastUpdatedValue = playlist.lastUpdated;
        const updatedArtistIds: string[] = [];

        for (const artistId of artistIds) {
            await handleRequestCount();
            const albumResponse = await sdk.artists.albums(artistId, 'album', undefined, 10, 0);
            await handleRequestCount();
            const singleResponse = await sdk.artists.albums(artistId, 'single', undefined, 10, 0);
            await handleRequestCount();
            const appearsResponse = await sdk.artists.albums(artistId, 'appears_on', undefined, 10, 0);

            const albums = [...albumResponse.items, ...singleResponse.items, ...appearsResponse.items];
            const lastUpdated = albums.reduce((latest, album) => {
                if (album.release_date && new Date(album.release_date).getTime() > latest) {
                    return new Date(album.release_date).getTime();
                }
                return latest;
            }, 0);

            if (lastUpdated > lastUpdatedValue) {
                updatedArtistIds.push(artistId);
            }
        }

        return updatedArtistIds;
    };

    const processPlaylists = async (playlists: StoredPlaylist[], artists: Artist[]): Promise<ProcessedPlaylist[]> => {
        if (artists.length === 0 && playlists.length === 0) return [];

        const artistTracksCache = new Map<string, Track[]>();
        const resultAddedArtistsByPlaylist: ProcessedPlaylist[] = [];

        if (artists.length === 0) {
            for (const playlist of playlists) {
                const processedPlaylist = await processOnePlaylist(playlist, [], artistTracksCache);
                if (processedPlaylist) {
                    resultAddedArtistsByPlaylist.push(processedPlaylist);
                    await storage.saveUpdatedPlaylistLastUpdated(processedPlaylist.playlist);
                }
            }
            return resultAddedArtistsByPlaylist;
        } else if (playlists.length === 0) {
            const processedPlaylist = await processOnePlaylist(null, artists, artistTracksCache);
            if (processedPlaylist) {
                resultAddedArtistsByPlaylist.push(processedPlaylist);
                await storage.saveUpdatedPlaylistLastUpdated(processedPlaylist.playlist);
            }
            return resultAddedArtistsByPlaylist;
        }

        for (const playlist of playlists) {
            const processedPlaylist = await processOnePlaylist(playlist, artists, artistTracksCache);
            if (processedPlaylist) {
                resultAddedArtistsByPlaylist.push(processedPlaylist);
                await storage.saveUpdatedPlaylistLastUpdated(processedPlaylist.playlist);
            }
        }

        return resultAddedArtistsByPlaylist;
    };

    const processOnePlaylist = async (
        playlist: StoredPlaylist | null,
        artists: Artist[],
        artistTracksCache: Map<string, Track[]>
    ): Promise<ProcessedPlaylist | undefined> => {
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

        if (playlist) {
            artistIds = await removeArtistNotUpdatedSinceLastPlaylistUpdate(artistIds, playlist);
        }

        if (artistIds.length === 0) {
            if (playlist) {
                playlist.lastUpdated = Date.now();
                return {
                    playlist,
                    tracks: [],
                };
            }
            return;
        }

        const artistTracks = [];
        for (const artistId of artistIds) {
            let tracks: Track[];

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
        }

        const playlistTracks = playlist ? await getPlaylistTracks(playlist) : undefined;

        const uniqueTracks = removeDuplicates(artistTracks, playlistTracks);

        if (playlist) {
            if (uniqueTracks.length !== 0) {
                const trackUris = uniqueTracks.map((track) => track.uri);
                for (let i = 0; i < trackUris.length; i += 50) {
                    const batch = trackUris.slice(i, i + 50);
                    await handleRequestCount();
                    await sdk.playlists.addItemsToPlaylist(playlist.id, batch);
                }
            }
            await handleRequestCount();
            await sdk.playlists.changePlaylistDetails(playlist.id, {
                description: `ids: ${artistIds.join(',')}`,
            });

            playlist.lastUpdated = Date.now();

            return {
                playlist,
                tracks: uniqueTracks,
            };
        } else {
            await handleRequestCount();
            const newPlaylist = await sdk.playlists.createPlaylist((await sdk.currentUser.profile()).id, {
                name: artists.map((artist) => artist.name).join(' / '),
                description: `ids: ${artists.map((artist) => artist.id).join(',')}`,
                public: false,
            });

            const trackUris = uniqueTracks.map((track) => track.uri);
            for (let i = 0; i < trackUris.length; i += 50) {
                const batch = trackUris.slice(i, i + 50);
                await handleRequestCount();
                await sdk.playlists.addItemsToPlaylist(newPlaylist.id, batch);
            }

            return {
                playlist: {
                    ...newPlaylist,
                    lastUpdated: Date.now(),
                },
                tracks: uniqueTracks,
            };
        }
    };

    const getArtistUniqueTracks = async (artist_id: string, includeGroups: IncludeGroupsType): Promise<Track[]> => {
        const albums = [];
        await handleRequestCount();
        let response = await sdk.artists.albums(artist_id, includeGroups, undefined, 50, 0);
        albums.push(...response.items);

        while (response.next) {
            await handleRequestCount();
            response = await sdk.makeRequest('GET', response.next.replace('https://api.spotify.com/v1/', ''));
            albums.push(...response.items);
        }

        const tracks: Track[] = [];
        for (const album of albums) {
            await handleRequestCount();
            let response = await sdk.albums.tracks(album.id, undefined, 50, 0);
            const tracksToAdd = response.items.map((track) => ({
                ...track,
                album: {
                    ...album,
                    available_markets: track.available_markets,
                },
            }));

            if (includeGroups !== 'appears_on') {
                tracks.push(...(tracksToAdd as Track[]));
            } else {
                tracks.push(
                    ...(tracksToAdd.filter((track) => track.artists.some((a) => a.id === artist_id)) as Track[])
                );
            }

            while (response.next) {
                await handleRequestCount();
                response = await sdk.makeRequest('GET', response.next.replace('https://api.spotify.com/v1/', ''));
                const nextTracksToAdd = response.items.map((track) => ({
                    ...track,
                    album: {
                        ...album,
                        available_markets: track.available_markets,
                    },
                }));

                if (includeGroups !== 'appears_on') {
                    tracks.push(...(nextTracksToAdd as Track[]));
                } else {
                    tracks.push(
                        ...(nextTracksToAdd.filter((track) => track.artists.some((a) => a.id === artist_id)) as Track[])
                    );
                }
            }
        }
        return tracks;
    };

    const removeDuplicates = (tracks: Track[], playlistTracks?: Track[]) => {
        const uniqueTracks: Track[] = [];

        for (const track of tracks) {
            let isDuplicate = false;
            let isAlreadyInPlaylist = false;

            for (let i = 0; i < uniqueTracks.length; i++) {
                if (
                    track.name.toLowerCase() === uniqueTracks[i].name.toLowerCase() &&
                    Math.abs(track.duration_ms - uniqueTracks[i].duration_ms) <= 2000
                ) {
                    if (track.explicit) {
                        uniqueTracks.splice(i, 1);
                        uniqueTracks.push(track);
                    }
                    isDuplicate = true;
                    break;
                }
            }

            if (playlistTracks) {
                isAlreadyInPlaylist = playlistTracks.some(
                    (playlistTrack) =>
                        playlistTrack.name.toLowerCase() === track.name.toLowerCase() &&
                        Math.abs(playlistTrack.duration_ms - track.duration_ms) <= 2000
                );
            }

            if (!isDuplicate && !isAlreadyInPlaylist) {
                uniqueTracks.push(track);
            }
        }

        console.log(uniqueTracks);
        return uniqueTracks;
    };

    const getPlaylistTracks = async (playlist: StoredPlaylist): Promise<Track[]> => {
        await handleRequestCount();
        const tracks: Track[] = [];
        await handleRequestCount();
        let response = await sdk.playlists.getPlaylistItems(playlist.id, undefined, undefined, 50, 0);
        tracks.push(...response.items.map((item) => item.track));

        while (response.next) {
            await handleRequestCount();
            response = await sdk.makeRequest('GET', response.next.replace('https://api.spotify.com/v1/', ''));
            tracks.push(...response.items.map((item) => item.track));
        }

        return tracks;
    };

    const maker = {
        searchArtistByName,
        processPlaylists,
    };

    return <MakerContext.Provider value={maker}>{children}</MakerContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useMaker() {
    const context = useContext(MakerContext);
    if (!context) {
        throw new Error('useMaker must be used within a MakerProvider');
    }
    return context;
}
