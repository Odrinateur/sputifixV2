export type TimeRangeType = "short_term" | "medium_term" | "long_term";
export type ThemeType = "light" | "dark" | "dark green";
export type TopItemsType = "artists" | "tracks";
export type LimitType =
    0
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

export const HomeDisplayLimits: HomeDisplayLimitType[] = [4, 8, 12, 16, 20];
export const TopDisplayLimits: TopDisplayLimit[] = [50, 100, 150, 200, 250];
