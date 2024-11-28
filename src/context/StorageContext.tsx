import { createContext, ReactNode, useContext } from 'react';
import localForage from 'localforage';
import CryptoJS from 'crypto-js';
import { Artist, SavedTrack, SimplifiedPlaylist, SpotifyApi, Track, UserProfile } from '@spotify/web-api-ts-sdk';
import { LimitType, StatsFM, ThemeType, TimeRangeType, TopItemsType } from '@/types/common.ts';
import { getUserStats } from '@/services/StatsFMService';

const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY as string;

const encryptData = (data: string) => {
    return CryptoJS.AES.encrypt(data, encryptionKey).toString();
};

const decryptData = (data: string) => {
    const bytes = CryptoJS.AES.decrypt(data, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

type StorageContextType = {
    getSettings(key: string, secondKey?: string): Promise<string>;
    setSettings(key: string, jsonValue: string, secondKey?: string): Promise<void>;
    getTheme(): Promise<ThemeType>;
    setTheme(theme: string): void;
    getUser(): Promise<UserProfile | null>;
    getUserTopItems<T extends Artist | Track>(
        type: TopItemsType,
        limit: number,
        timeRange?: TimeRangeType
    ): Promise<T[] | null>;
    getUserLikes(): Promise<SavedTrack[] | null>;
    getUserPlaylists(owned?: boolean): Promise<SimplifiedPlaylist[] | null>;
    getPlaylist(id: string): Promise<[SimplifiedPlaylist | null, Track[] | null]>;
    setPinnedUserPlaylist(addOrRemove: 'add' | 'remove', id: string): void;
    getPinnedUserPlaylists(): Promise<SimplifiedPlaylist[] | null>;

    getStatsFM(): Promise<[StatsFM | null, StatsFM | null]>;

    refreshUserTopItems(type: TopItemsType, limit?: number, timeRange?: TimeRangeType): void;
    refreshLikes(): void;
    refreshPlaylists(secondDelay?: number): void;
    refreshPlaylist(id: string): void;
    subscribeToPinnedPlaylistsUpdate: (callback: () => void) => void;
    unsubscribeFromPinnedPlaylistsUpdate: (callback: () => void) => void;
};

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const StorageProvider = ({ sdk, children }: { sdk: SpotifyApi; children: ReactNode }) => {
    const initStorage = () => {
        localForage.getItem('settings').then((settings) => {
            if (!settings) {
                const defaultSettings = {
                    theme: 'dark',
                    home: {
                        limit: 12,
                        timeRange: 'medium_term',
                    },
                    top_items: {
                        limit: 100,
                        timeRange: 'medium_term',
                    },
                    statsFM: {
                        display: false,
                    },
                };
                localForage.setItem('settings', encryptData(JSON.stringify(defaultSettings)));
            }
        });
    };
    initStorage();

    const getItem = async (key: string, secondKey?: string) => {
        const item = await localForage.getItem(key);
        if (item) {
            const itemJson = JSON.parse(decryptData(item as string));
            return secondKey ? itemJson[secondKey] : itemJson;
        }
        return '';
    };

    const setItem = async (key: string, jsonValue: string, secondKey?: string) => {
        const item = await localForage.getItem(key);
        const jsonToStore =
            key === 'settings' || key === 'pinned_playlists'
                ? jsonValue
                : { value: jsonValue, lastUpdated: Date.now() };
        let itemJson = item ? JSON.parse(decryptData(item as string)) : {};
        if (secondKey) itemJson[secondKey] = jsonToStore;
        else itemJson = jsonToStore;
        await localForage.setItem(key, encryptData(JSON.stringify(itemJson)));
    };

    const getSettings = async (key: string, secondKey?: string): Promise<string> => {
        const settings = await localForage.getItem('settings');
        if (settings) {
            const settingsJson = JSON.parse(decryptData(settings as string));
            return secondKey ? settingsJson[key]?.[secondKey] : settingsJson[key];
        }
        return '';
    };

    const setSettings = async (key: string, jsonValue: string, secondKey?: string): Promise<void> => {
        const settings = await getItem('settings');
        const settingsJson = settings ? settings : {};
        if (secondKey) settingsJson[key][secondKey] = jsonValue;
        else settingsJson[key] = jsonValue;
        await localForage.setItem('settings', encryptData(JSON.stringify(settingsJson)));
    };

    const getTheme = async (): Promise<ThemeType> => {
        const theme = await getSettings('theme');
        document.body.className = '';
        document.body.classList.add(theme);
        return theme as ThemeType;
    };

    const setTheme = async (theme: ThemeType) => {
        await setSettings('theme', theme);
        document.body.className = '';
        document.body.classList.add(theme);
    };

    const getCurrentLimit = (limit: number) => Math.min(50, limit) as LimitType;

    const getUser = async (): Promise<UserProfile | null> => {
        const userInStorage = await getItem('user');
        if (userInStorage && userInStorage.lastUpdated + 3600 * 1000 > Date.now()) {
            return JSON.parse(userInStorage.value);
        }

        const user = await sdk.currentUser.profile();
        await setItem('user', JSON.stringify(user));
        return user ?? null;
    };

    const getUserTopItems = async <T extends Artist | Track>(
        type: 'artists' | 'tracks',
        limit: number,
        timeRange: TimeRangeType = 'medium_term'
    ): Promise<T[] | null> => {
        const topItemsInStorage = await getItem(`top_${type}`, timeRange);
        if (topItemsInStorage && topItemsInStorage.lastUpdated + 3600 * 1000 > Date.now()) {
            const topItems = JSON.parse(topItemsInStorage.value);
            if (topItems.length >= limit) return topItems.slice(0, limit) as T[];
        }

        let currentLimit = getCurrentLimit(limit);
        let offset = 0;
        const topItems: T[] = [];

        while (offset < limit) {
            const items = await sdk.currentUser.topItems(type, timeRange, currentLimit, offset);
            topItems.push(...(items.items as T[]));
            offset += currentLimit;
            currentLimit = getCurrentLimit(limit - offset);
        }

        await setItem(`top_${type}`, JSON.stringify(topItems), timeRange);
        return topItems.length > 0 ? topItems : null;
    };

    const getUserLikes = async (): Promise<SavedTrack[] | null> => {
        const likesInStorage = await getItem('likes');
        if (likesInStorage && likesInStorage.lastUpdated + 3600 * 1000 > Date.now())
            return JSON.parse(likesInStorage.value);

        const likes = [];
        let response = await sdk.currentUser.tracks.savedTracks(50, 0);
        likes.push(...response.items);

        while (response.next) {
            response = await sdk.makeRequest('GET', response.next.replace('https://api.spotify.com/v1/', ''));
            likes.push(...response.items);
        }
        await setItem('likes', JSON.stringify(likes));
        return likes ?? null;
    };

    const getUserPlaylists = async (owned = false): Promise<SimplifiedPlaylist[] | null> => {
        const playlistsInStorage = await getItem('playlists');
        if (playlistsInStorage && playlistsInStorage.lastUpdated + 3600 * 1000 > Date.now()) {
            const playlistsJson = JSON.parse(playlistsInStorage.value);
            const user = await getUser();
            return owned
                ? playlistsJson.filter((playlist: SimplifiedPlaylist) => playlist?.owner.id === user?.id)
                : playlistsJson;
        }

        const playlists = [];
        let response = await sdk.currentUser.playlists.playlists(50, 0);
        playlists.push(...response.items);

        while (response.next) {
            response = await sdk.makeRequest('GET', response.next.replace('https://api.spotify.com/v1/', ''));
            playlists.push(...response.items);
        }
        const filteredPlaylists = playlists.filter((playlist) => playlist !== null);
        await setItem('playlists', JSON.stringify(filteredPlaylists));
        return filteredPlaylists;
    };

    const getPlaylistTracks = async (id: string): Promise<Track[] | null> => {
        const tracksInStorage = await getItem(`playlist_tracks_${id}`);
        if (tracksInStorage && tracksInStorage.lastUpdated + 3600 * 1000 > Date.now())
            return JSON.parse(tracksInStorage.value);

        const tracksItems = [];
        let response = await sdk.playlists.getPlaylistItems(id, undefined, undefined, 50, 0);
        tracksItems.push(...response.items);

        while (response.next) {
            response = await sdk.makeRequest('GET', response.next.replace('https://api.spotify.com/v1/', ''));
            tracksItems.push(...response.items);
        }

        const tracks = tracksItems.map((item) => item.track);
        await setItem(`playlist_tracks_${id}`, JSON.stringify(tracks));
        return tracks;
    };

    const getPlaylist = async (id: string): Promise<[SimplifiedPlaylist | null, Track[] | null]> => {
        const userPlaylists = await getUserPlaylists();
        const playlist = userPlaylists?.find((p) => p.id === id);
        if (!playlist) return [null, null];

        const tracks = await getPlaylistTracks(id);
        return [playlist, tracks];
    };

    const pinnedPlaylistsSubscribers: Set<() => void> = new Set();

    const notifyPinnedPlaylistsSubscribers = () => {
        pinnedPlaylistsSubscribers.forEach((callback) => callback());
    };

    const subscribeToPinnedPlaylistsUpdate = (callback: () => void) => {
        pinnedPlaylistsSubscribers.add(callback);
    };

    const unsubscribeFromPinnedPlaylistsUpdate = (callback: () => void) => {
        pinnedPlaylistsSubscribers.delete(callback);
    };

    const setPinnedUserPlaylist = async (addOrRemove: 'add' | 'remove', id: string) => {
        const pinnedPlaylists = await getItem('pinned_playlists');
        let pinnedIds = pinnedPlaylists ? JSON.parse(pinnedPlaylists) : [];
        if (addOrRemove === 'add') {
            if (!pinnedIds.includes(id)) {
                pinnedIds.push(id);
            }
        } else {
            pinnedIds = pinnedIds.filter((pinnedId: string) => pinnedId !== id);
        }
        await setItem('pinned_playlists', JSON.stringify(pinnedIds));
        notifyPinnedPlaylistsSubscribers();
    };

    const getPinnedUserPlaylists = async (): Promise<SimplifiedPlaylist[]> => {
        const pinnedPlaylists = await getItem('pinned_playlists');
        if (pinnedPlaylists) {
            const pinnedIds = JSON.parse(pinnedPlaylists);
            const userPlaylists = await getUserPlaylists();
            return userPlaylists?.filter((playlist) => pinnedIds.includes(playlist.id)) ?? [];
        }
        return [];
    };

    const getStatsFM = async (): Promise<[StatsFM | null, StatsFM | null]> => {
        const statsInStorage = await getItem('statsfm');
        if (statsInStorage && statsInStorage.lastUpdated + 3600 * 1000 > Date.now())
            return JSON.parse(statsInStorage.value);

        const user = await getUser();
        if (!user) return [null, null];
        const [weeks, lifetime] = await getUserStats(user.id);
        await setItem('statsfm', JSON.stringify([weeks, lifetime]));
        return [weeks, lifetime];
    };

    const resetLastUpdated = async (key: string, secondKey?: string) => {
        const item = await getItem(key, secondKey);
        if (item) await localForage.removeItem(key);
    };

    const refreshUserTopItems = async (
        type: TopItemsType,
        limit: number = 0,
        timeRange: TimeRangeType = 'medium_term'
    ) => {
        if (limit === 0) limit = parseInt(await getSettings('top_items', 'limit'));
        await resetLastUpdated(`top_${type}`, timeRange);
        await getUserTopItems(type, limit, timeRange);
    };

    const refreshLikes = async () => {
        await resetLastUpdated('likes');
        await getUserLikes();
    };

    const refreshPlaylists = async (secondDelay = 0) => {
        if (secondDelay > 0) {
            const item = await localForage.getItem('playlists');
            if (item) {
                const itemJson = JSON.parse(decryptData(item as string));
                // It has to refresh in the next secondDelay seconds
                itemJson.lastUpdated = Date.now() - 3600 * 1000 + secondDelay * 1000;
                await localForage.setItem('playlists', encryptData(JSON.stringify(itemJson)));
                return;
            }
        }
        await resetLastUpdated('playlists');
        await getUserPlaylists();
    };

    const refreshPlaylist = async (id: string) => {
        await resetLastUpdated('playlist_tracks', id);
        await getPlaylist(id);
    };

    const storage = {
        getSettings,
        setSettings,
        getTheme,
        setTheme,
        getUser,
        getUserTopItems,
        getUserLikes,
        getUserPlaylists,
        getPlaylist,
        setPinnedUserPlaylist,
        getPinnedUserPlaylists,

        getStatsFM,

        refreshUserTopItems,
        refreshLikes,
        refreshPlaylists,
        refreshPlaylist,
        subscribeToPinnedPlaylistsUpdate,
        unsubscribeFromPinnedPlaylistsUpdate,
    };

    return <StorageContext.Provider value={storage}>{children}</StorageContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStorage = () => {
    const context = useContext(StorageContext);
    if (!context) {
        throw new Error('useStorage must be used within a StorageProvider');
    }
    return context;
};
