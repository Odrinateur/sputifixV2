import {createContext, ReactNode, useContext} from "react";
import User from "@/types/User.ts";
import secureLocalStorage from "react-secure-storage";
import {GetUser, GetUserTopItems} from "@/api/user.ts";
import {TopArtists} from "@/types/Artist.ts";

type StorageContextType = {
    getUser(token: string): Promise<User | null>;
    getUserTopArtists(token: string, limit: number): Promise<TopArtists | null>;
};

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const StorageProvider = ({children}: { children: ReactNode }) => {
    secureLocalStorage.setItem('storage', '');

    const getItem = (key: string) => {
        const storage = secureLocalStorage.getItem('storage');
        if (storage && typeof storage === 'string') {
            const storageJson = JSON.parse(storage);
            return storageJson[key];
        }
    }

    const setItem = (key: string, jsonValue: string) => {
        const storage = secureLocalStorage.getItem('storage');
        if (storage && typeof storage === 'string') {
            const storageJson = JSON.parse(storage);
            storageJson[key] = jsonValue;
            secureLocalStorage.setItem('storage', JSON.stringify(storageJson));
        }
    }

    const getUser = async (token: string): Promise<User | null> => {
        const userInStorage = getItem('user');
        if (userInStorage) {
            const user = JSON.parse(userInStorage) as User;
            if (user.lastUpdated + 3600 * 1000 > Date.now()) {
                return user;
            }
        }

        const user = await GetUser(token);
        setItem('user', JSON.stringify(user));
        return user ?? null;
    }

    const getUserTopArtists = async (token: string, limit: number): Promise<TopArtists | null> => {
        const userInStorage = getItem('topArtists');
        if (userInStorage) {
            const topArtists = JSON.parse(userInStorage) as TopArtists;
            if (topArtists.lastUpdated + 3600 * 1000 > Date.now()) {
                return topArtists.artists.length > limit ? {
                    total: topArtists.total,
                    artists: topArtists.artists.slice(0, limit)
                } as TopArtists : topArtists;
            }
        }

        const topArtists = await GetUserTopItems(token, 'artists');
        setItem('topArtists', JSON.stringify(topArtists));
        return topArtists ?? null
    }

    const storage = {
        getUser,
        getUserTopArtists,
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