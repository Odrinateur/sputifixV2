import {createContext, ReactNode, useContext} from 'react';
import secureLocalStorage from "react-secure-storage";
import {ApiResponse, ApiSettings} from "@/types/ApiSettings.ts";
import {GetTokenByCode, RefreshToken} from "@/api/auth.ts";

type AuthContextType = {
    getCode: () => string | null;
    setCode: (code: string) => Promise<void>;
    getAccessToken: () => Promise<string | null>;
    isTokenExpired: () => boolean;
    isAuthenticated: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const getCode = () => {
        return secureLocalStorage.getItem('code') as string;
    }

    const setCode = async (code: string) => {
        if (!code) return;
        if (secureLocalStorage.getItem('code') && secureLocalStorage.getItem('api_settings')) return;
        
        secureLocalStorage.setItem('code', code);

        const response = await GetTokenByCode(code);
        const apiSettings = new ApiSettings(response as ApiResponse);
        secureLocalStorage.setItem('api_settings', JSON.stringify(apiSettings));
        secureLocalStorage.setItem('logged_in', 'true');
    }

    const getAccessToken = async () => {
        const apiSettingsJson = secureLocalStorage.getItem('api_settings');
        if (apiSettingsJson && typeof apiSettingsJson === 'string') {
            const apiSettings = JSON.parse(apiSettingsJson) as ApiSettings;

            const expiresAt = apiSettings.expiresAt;
            if (expiresAt < Date.now())
                return await RefreshToken(apiSettings.refreshToken);
            else
                return apiSettings.accessToken;
        }
        return null;
    }

    const isTokenExpired = () => {
        const apiSettingsJson = secureLocalStorage.getItem('api_settings');
        if (apiSettingsJson && typeof apiSettingsJson === 'string') {
            const apiSettings = JSON.parse(apiSettingsJson) as ApiSettings;
            return apiSettings.expiresAt < Date.now();
        }
        return true;
    }

    const isAuthenticated = () => {
        return secureLocalStorage.getItem('logged_in') === 'true';
    }

    const auth = {
        getCode,
        setCode,
        getAccessToken,
        isTokenExpired,
        isAuthenticated,
    }

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};