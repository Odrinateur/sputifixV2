import {PaginatedResponse} from "@/types/common.ts";

export async function sampleGetRequest<T>(token: string, url: string): Promise<T | undefined> {
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
        return undefined;
    }
}

export async function sampleGetRequestWithPagination<T extends PaginatedResponse<K>, K>(token: string, url: string, requestedObjectCount: number = 50): Promise<Array<K> | undefined> {
    const items: Array<K> = [];
    let currentUrl = url;

    while (items.length < requestedObjectCount) {
        const data = await sampleGetRequest<T>(token, currentUrl);
        if (!data) {
            break;
        }

        const array: Array<K> = data['items'] as Array<K>;
        items.push(...array);

        if (!data['next']) {
            break;
        }

        currentUrl = data.next;
    }

    return items;
}

