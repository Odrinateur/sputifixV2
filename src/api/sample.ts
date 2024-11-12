export default async function SampleGetRequest(token: string, url: string) {
    const defaultHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    try {
        const response = await fetch(url, {
            headers: {
                ...defaultHeaders,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            new Error(`Error: ${errorData.error.message}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
    }
}