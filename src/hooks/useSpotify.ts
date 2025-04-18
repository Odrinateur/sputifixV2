import { useEffect, useRef, useState } from 'react';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

export function useSpotify(clientId: string, redirectUrl: string, scopes: string[]) {
    const [sdk, setSdk] = useState<SpotifyApi | null>(null);
    const { current: activeScopes } = useRef(scopes);

    useEffect(() => {
        (async () => {
            try {
                const internalSdk = SpotifyApi.withUserAuthorization(clientId, redirectUrl, activeScopes);
                const { authenticated } = await internalSdk.authenticate();

                if (authenticated) {
                    setSdk(() => internalSdk);
                }
            } catch (e: Error | unknown) {
                const error = e as Error;
                console.error('Authentication error:', error);
            }
        })();
    }, [clientId, redirectUrl, activeScopes]);

    return sdk;
}
