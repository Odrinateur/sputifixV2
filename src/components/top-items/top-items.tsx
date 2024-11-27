import {
    HomeDisplayLimits,
    HomeDisplayLimitType,
    LoadingStates,
    TimeRangeType,
    TopDisplayLimit,
    TopDisplayLimits,
    TopItemsType,
} from '@/types/common.ts';
import { useStorage } from '@/context/StorageContext';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { SquareArrowOutUpRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Artist, Track } from '@spotify/web-api-ts-sdk';
import { RefreshTopArtistsButton, RefreshTopTracksButton } from '../refresh';
import { H1 } from '../ui/typography';

export function TopItems<T extends Artist | Track>({
    isHome = true,
    itemType,
    title,
    GridComponent,
}: {
    isHome?: boolean;
    itemType: TopItemsType;
    title: string;
    GridComponent: React.ComponentType<{ items: T[] | null }>;
}) {
    const { getSettings, getUserTopItems } = useStorage();
    const [items, setItems] = useState<T[] | null>(null);

    const [limit, setLimit] = useState<HomeDisplayLimitType | TopDisplayLimit>(
        isHome ? HomeDisplayLimits[0] : TopDisplayLimits[0]
    );
    const [timeRange, setTimeRange] = useState<TimeRangeType>('medium_term');

    useEffect(() => {
        (async () => {
            const settingsLimit = isHome
                ? (parseInt(await getSettings('home', 'limit')) as HomeDisplayLimitType)
                : (parseInt(await getSettings('top_items', 'limit')) as TopDisplayLimit);
            const settingsTimeRange = isHome
                ? ((await getSettings('home', 'timeRange')) as TimeRangeType)
                : ((await getSettings('top_items', 'timeRange')) as TimeRangeType);

            setLimit(settingsLimit);
            setTimeRange(settingsTimeRange);
        })();
    }, [isHome, getSettings]);

    const [loadingState, setLoadingState] = useState<LoadingStates>('idle');

    useEffect(() => {
        (async () => {
            await getUserTopItems<T>(itemType, limit, timeRange).then((items) => {
                setItems(items);
                setLoadingState('idle');
            });
        })();
    }, [getUserTopItems, itemType, limit, timeRange]);

    useEffect(() => {
        (async () => {
            if (loadingState === 'loading') setItems(null);
            else if (loadingState === 'end') {
                await getUserTopItems<T>(itemType, limit, timeRange).then((items) => {
                    setItems(items);
                    setLoadingState('idle');
                });
            } else if (loadingState === 'idle') return;
        })();
    }, [loadingState, getUserTopItems, itemType, limit, timeRange]);

    return (
        <div className={'w-full flex flex-col gap-4'}>
            {!isHome && <H1>{title} </H1>}
            <div className={`w-full flex justify-end ${isHome && 'sm:justify-between'} items-center`}>
                {isHome && (
                    <Link
                        to={`/top/${itemType.toLowerCase()}`}
                        className={'hidden sm:flex justify-center items-center gap-2 text-2xl'}
                    >
                        {title}
                        <SquareArrowOutUpRight size={20} strokeWidth={3.2} />
                    </Link>
                )}
                <div className={'flex justify-center items-center gap-2'}>
                    <Select
                        onValueChange={(value) => {
                            setTimeRange(value as TimeRangeType);
                            setItems(null);
                        }}
                        defaultValue={timeRange}
                    >
                        <SelectTrigger className={'w-40'}>
                            {timeRange === 'short_term'
                                ? '4 weeks'
                                : timeRange === 'medium_term'
                                  ? '6 months'
                                  : '1 year'}
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="short_term">4 weeks</SelectItem>
                            <SelectItem value="medium_term">6 months</SelectItem>
                            <SelectItem value="long_term">1 year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        onValueChange={(value) => {
                            setLimit(parseInt(value) as HomeDisplayLimitType | TopDisplayLimit);
                            setItems(null);
                        }}
                        defaultValue={limit.toString()}
                    >
                        <SelectTrigger className={'w-20'}>{limit}</SelectTrigger>
                        <SelectContent>
                            {isHome
                                ? HomeDisplayLimits.map((limit) => (
                                      <SelectItem key={limit} value={limit.toString()}>
                                          {limit}
                                      </SelectItem>
                                  ))
                                : TopDisplayLimits.map((limit) => (
                                      <SelectItem key={limit} value={limit.toString()}>
                                          {limit}
                                      </SelectItem>
                                  ))}
                        </SelectContent>
                    </Select>
                    {!isHome && itemType === 'artists' ? (
                        <RefreshTopArtistsButton setLoadingState={setLoadingState} />
                    ) : !isHome && itemType === 'tracks' ? (
                        <RefreshTopTracksButton setLoadingState={setLoadingState} />
                    ) : null}
                </div>
            </div>
            <Card className={'w-full'}>
                <GridComponent items={loadingState == 'loading' ? null : items} />
            </Card>
        </div>
    );
}
