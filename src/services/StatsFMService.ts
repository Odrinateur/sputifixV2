import { StatsFM, StatsFMResponse } from '@/types/common';

export async function getUserStats(id: string): Promise<[StatsFM | null, StatsFM | null]> {
    const endpoint = `https://api.stats.fm/api/v1/users/${id}/streams/stats`;

    const weeksRangeResponse = await fetch(`${endpoint}?range=weeks`, {
        method: 'GET',
        headers: {
            'User-Agent': '',
        },
    });
    const lifetimeRangeResponse = await fetch(`${endpoint}?range=lifetime`, {
        method: 'GET',
        headers: {
            'User-Agent': '',
        },
    });

    if (!weeksRangeResponse.ok || !lifetimeRangeResponse.ok) return [null, null];

    const weeksRangeData = (await weeksRangeResponse.json()) as StatsFMResponse;
    const lifetimeRangeData = (await lifetimeRangeResponse.json()) as StatsFMResponse;

    return [new StatsFM(weeksRangeData), new StatsFM(lifetimeRangeData)];
}
