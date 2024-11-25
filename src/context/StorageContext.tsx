import { createContext, ReactNode, useContext } from 'react';
import localForage from 'localforage';
import CryptoJS from 'crypto-js';
import { Artist, SavedTrack, SimplifiedPlaylist, SpotifyApi, Track, UserProfile } from '@spotify/web-api-ts-sdk';
import { LimitType, ThemeType, TimeRangeType, TopItemsType } from '@/types/common.ts';

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
    getUserPlaylists(): Promise<SimplifiedPlaylist[] | null>;
    getPlaylist(id: string): Promise<[SimplifiedPlaylist | null, Track[] | null]>;

    refreshUserTopItems(type: TopItemsType, limit?: number, timeRange?: TimeRangeType): void;
    refreshLikes(): void;
    refreshPlaylists(): void;
    refreshPlaylist(id: string): void;
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
                    statsfm: {
                        display: true,
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
        const jsonToStore = key === 'settings' ? jsonValue : { value: jsonValue, lastUpdated: Date.now() };
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
        console.log('setSettings', key, jsonValue, secondKey);
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

    const getUserPlaylists = async (): Promise<SimplifiedPlaylist[] | null> => {
        const playlistsInStorage = await getItem('playlists');
        if (playlistsInStorage && playlistsInStorage.lastUpdated + 3600 * 1000 > Date.now())
            return JSON.parse(playlistsInStorage.value);

        const playlists = [];
        let response = await sdk.currentUser.playlists.playlists(50, 0);
        playlists.push(...response.items);

        while (response.next) {
            response = await sdk.makeRequest('GET', response.next.replace('https://api.spotify.com/v1/', ''));
            playlists.push(...response.items);
        }
        await setItem('playlists', JSON.stringify(playlists));
        return playlists;
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

    const resetLastUpdated = async (key: string, secondKey?: string) => {
        const item = await getItem(key, secondKey);
        if (item) await setItem(key, item.value, secondKey);
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

    const refreshPlaylists = async () => {
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

        refreshUserTopItems,
        refreshLikes,
        refreshPlaylists,
        refreshPlaylist,
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
