export async function GetTokenByCode(code: string) {
    const clientId = import.meta.env.VITE_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
    const redirectUri = import.meta.env.VITE_CALLBACK_URL || '';

    const auth = btoa(`${clientId}:${clientSecret}`)

    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
    });

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${auth}`,
            },
            body: body.toString(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${errorData.error}, Description: ${errorData.error_description}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to fetch token:', error);
    }
}

export async function RefreshToken(refreshToken: string) {
    const clientId = import.meta.env.VITE_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

    const auth = btoa(`${clientId}:${clientSecret}`)

    const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
    });

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${auth}`,
            },
            body: body.toString(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${errorData.error}, Description: ${errorData.error_description}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to refresh token:', error);
    }
}