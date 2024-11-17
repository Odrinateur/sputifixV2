import {createContext, ReactNode, useContext} from "react";
import secureLocalStorage from "react-secure-storage";
import {Artist, SpotifyApi, Track, UserProfile} from "@spotify/web-api-ts-sdk";
import {LimitType, TimeRangeType, TopItemsType} from "@/types/common.ts";

type StorageContextType = {
    getSettings(key: string, secondKey?: string): string;
    setSettings(key: string, jsonValue: string, secondKey?: string): void;
    getUser(): Promise<UserProfile | null>;
    getUserTopItems<T extends Artist | Track>(type: TopItemsType, limit: number, timeRange?: TimeRangeType): Promise<T[] | null>;
};

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const StorageProvider = ({sdk, children}: { sdk: SpotifyApi, children: ReactNode }) => {
    const initStorage = () => {
        if (!secureLocalStorage.getItem('storage'))
            secureLocalStorage.setItem('storage', JSON.stringify({}));
        if (!secureLocalStorage.getItem('settings'))
            secureLocalStorage.setItem('settings', JSON.stringify({
                theme: 'dark',
                home: {
                    limit: 12,
                    timeRange: 'medium_term'
                },
                top_items: {
                    limit: 100,
                    timeRange: 'medium_term'
                },
                statsfm: {
                    display: true
                }
            }));
    }
    initStorage();

    const getItem = (key: string, secondKey?: string) => {
        const storage = secureLocalStorage.getItem('storage');
        if (storage && typeof storage === 'string') {
            const storageJson = JSON.parse(storage);
            return secondKey ? storageJson[key]?.[secondKey] : storageJson[key];
        }
    }

    const setItem = (key: string, jsonValue: string, secondKey?: string) => {
        const storage = secureLocalStorage.getItem('storage');
        if (storage && typeof storage === 'string') {
            const storageJson = JSON.parse(storage);
            const jsonToStore = {value: jsonValue, lastUpdated: Date.now()};
            if (secondKey) {
                storageJson[key] = storageJson[key] || {};
                storageJson[key][secondKey] = jsonToStore;
            } else
                storageJson[key] = jsonToStore;
            secureLocalStorage.setItem('storage', JSON.stringify(storageJson));
        }
    }

    const getSettings = (key: string, secondKey?: string) => {
        const settings = secureLocalStorage.getItem('settings');
        if (settings && typeof settings === 'string') {
            const settingsJson = JSON.parse(settings);
            return secondKey ? settingsJson[key]?.[secondKey] : settingsJson[key];
        }
        return '';
    }

    const setSettings = (key: string, jsonValue: string, secondKey?: string) => {
        const settings = secureLocalStorage.getItem('settings');
        if (settings && typeof settings === 'string') {
            const settingsJson = JSON.parse(settings);
            const jsonToStore = {value: jsonValue, lastUpdated: Date.now()};
            if (secondKey) {
                settingsJson[key] = settingsJson[key] || {};
                settingsJson[key][secondKey] = jsonToStore;
            } else
                settingsJson[key] = jsonToStore;
            secureLocalStorage.setItem('settings', JSON.stringify(settingsJson));
        }
    }

    const getCurrentLimit = (limit: number) => Math.min(50, limit) as LimitType;

    const getUser = async (): Promise<UserProfile | null> => {
        const userInStorage = getItem('user');
        if (userInStorage && userInStorage.lastUpdated + 3600 * 1000 > Date.now())
            return JSON.parse(userInStorage.value);

        const user = await sdk.currentUser.profile();
        setItem('user', JSON.stringify(user));
        return user ?? null;
    }

    async function getUserTopItems<T extends Artist | Track>(type: 'artists' | 'tracks', limit: number, timeRange: TimeRangeType = 'medium_term'): Promise<T[] | null> {
        const topItemsInStorage = getItem(`top_${type}`, timeRange);
        if (topItemsInStorage && topItemsInStorage.length >= limit && topItemsInStorage.lastUpdated + 3600 * 1000 > Date.now()) {
            return JSON.parse(topItemsInStorage.value);
        }

        let currentLimit = getCurrentLimit(limit);
        let offset = 0;
        const topItems: T[] = [];

        while (offset < limit) {
            const items = await sdk.currentUser.topItems(type, timeRange, currentLimit, offset);
            topItems.push(...(items.items) as T[]);
            offset += currentLimit;
            currentLimit = getCurrentLimit(limit - offset);
        }

        setItem(`top_${type}`, JSON.stringify({topItems}), timeRange);
        return topItems.length > 0 ? topItems : null;
    }

    const storage = {
        getSettings,
        setSettings,
        getUser,
        getUserTopItems,
    }

    return (
        <StorageContext.Provider value={storage}>
            {children}
        </StorageContext.Provider>
    );
};

export const useStorage = () => {
    const context = useContext(StorageContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
