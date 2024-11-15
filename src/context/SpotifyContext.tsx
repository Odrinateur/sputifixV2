import React, {createContext, useContext} from 'react';
import {SpotifyApi} from "@spotify/web-api-ts-sdk";

const SpotifySdkContext = createContext<SpotifyApi | null>(null);

export const useSpotifySdk = () => {
    return useContext(SpotifySdkContext);
};

export const SpotifySdkProvider = ({sdk, children}: { sdk: SpotifyApi, children: React.ReactNode }) => {
    return (
        <SpotifySdkContext.Provider value={sdk}>
            {children}
        </SpotifySdkContext.Provider>
    );
};