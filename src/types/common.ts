export type TimeRangeType = 'short_term' | 'medium_term' | 'long_term';
export type ThemeType = 'light' | 'dark';
export type TopItemsType = 'artists' | 'tracks';
export type LimitType =
    | 0
    | 50
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26
    | 27
    | 28
    | 29
    | 30
    | 31
    | 32
    | 33
    | 34
    | 35
    | 36
    | 37
    | 38
    | 39
    | 40
    | 41
    | 42
    | 43
    | 44
    | 45
    | 46
    | 47
    | 48
    | 49;
export type HomeDisplayLimitType = 4 | 8 | 12 | 16 | 20;
export type TopDisplayLimit = 50 | 100 | 150 | 200 | 250;

export type LoadingStates = 'idle' | 'loading' | 'end';

export const HomeDisplayLimits: HomeDisplayLimitType[] = [4, 8, 12, 16, 20];
export const TopDisplayLimits: TopDisplayLimit[] = [50, 100, 150, 200, 250];

export type IncludeGroupsType = 'album' | 'single' | 'appears_on' | 'compilation';

export interface StatsFMResponse {
    items: {
        durationMs: number;
        count: number;
        playedMs: {
            percentiles: {
                values: {
                    '1.0': number;
                    '5.0': number;
                    '25.0': number;
                    '50.0': number;
                    '75.0': number;
                    '95.0': number;
                    '99.0': number;
                };
            };
            count: number;
            min: number;
            max: number;
            avg: number;
            sum: number;
        };
        cardinality: {
            tracks: number;
            artists: number;
            albums: number;
        };
    };
}

export class StatsFM {
    minutes: number;
    count: number;
    tracks: number;
    artists: number;
    albums: number;

    constructor(data: StatsFMResponse) {
        this.minutes = Math.round(data.items.durationMs / 60000);
        this.count = data.items.count;
        this.tracks = data.items.cardinality.tracks;
        this.artists = data.items.cardinality.artists;
        this.albums = data.items.cardinality.albums;
    }
}
