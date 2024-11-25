import { useStorage } from '@/context/StorageContext';
import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { H3, H4 } from './ui/typography';
import { ChartBar, Clock, Disc3, Repeat, SquareLibrary, SquareUserRound } from 'lucide-react';
import { StatsFM } from '@/types/common';
import { Skeleton } from './ui/skeleton';

export function StatsFMCard() {
    const { getSettings, getStatsFM } = useStorage();
    const [isStatsFMEnabled, setIsStatsFMEnabled] = useState<boolean>(false);
    const [weeks, setWeeks] = useState<StatsFM | null>(null);
    const [lifetime, setLifetime] = useState<StatsFM | null>(null);

    useEffect(() => {
        (async () => {
            setIsStatsFMEnabled((await getSettings('statsFM', 'display')) as unknown as boolean);
            const [weeks, lifetime] = await getStatsFM();
            setWeeks(weeks);
            setLifetime(lifetime);
        })();
    }, [getSettings, getStatsFM]);

    return (
        <>
            {isStatsFMEnabled && (
                <Card
                    className={'w-full max-h-[200px] hidden lg:flex flex-col py-4 gap-2 items-center overflow-x-auto'}
                >
                    <H3 className={'flex items-center gap-2'}>
                        <ChartBar className={'!w-6 !h-6'} />
                        Stats.fm
                    </H3>
                    <H4>Weekly</H4>
                    <div className={'w-full flex flex-col gap-1'}>
                        {weeks ? (
                            <>
                                <H4 className={'w-full flex justify-center items-center gap-2'}>
                                    <Clock /> {weeks.minutes}
                                </H4>
                                <H4 className={'w-full flex justify-center items-center gap-2'}>
                                    <Repeat /> {weeks.count}
                                </H4>
                                <H4 className={'w-full flex justify-center items-center gap-2'}>
                                    <Disc3 /> {weeks.tracks}
                                </H4>
                                <H4 className={'w-full flex justify-center items-center gap-2'}>
                                    <SquareUserRound /> {weeks.artists}
                                </H4>
                                <H4 className={'w-full flex justify-center items-center gap-2'}>
                                    <SquareLibrary /> {weeks.albums}
                                </H4>
                            </>
                        ) : (
                            <>
                                <Skeleton className={'w-full h-10'} />
                                <Skeleton className={'w-full h-10'} />
                                <Skeleton className={'w-full h-10'} />
                                <Skeleton className={'w-full h-10'} />
                                <Skeleton className={'w-full h-10'} />
                            </>
                        )}
                    </div>
                    <H4>Lifetime</H4>
                    <div className={'w-full flex flex-col justify-center items-center gap-1'}>
                        {lifetime ? (
                            <>
                                <H4 className={'w-full flex justify-center items-center gap-2'}>
                                    <Clock /> {lifetime.minutes}
                                </H4>
                                <H4 className={'w-full flex justify-center items-center gap-2'}>
                                    <Repeat /> {lifetime.count}
                                </H4>
                                <H4 className={'w-full flex justify-center items-center gap-2'}>
                                    <Disc3 /> {lifetime.tracks}
                                </H4>
                                <H4 className={'w-full flex justify-center items-center gap-2'}>
                                    <SquareUserRound /> {lifetime.artists}
                                </H4>
                                <H4 className={'w-full flex justify-center items-center gap-2'}>
                                    <SquareLibrary /> {lifetime.albums}
                                </H4>
                            </>
                        ) : (
                            <>
                                <Skeleton className={'w-full h-10'} />
                                <Skeleton className={'w-full h-10'} />
                                <Skeleton className={'w-full h-10'} />
                                <Skeleton className={'w-full h-10'} />
                                <Skeleton className={'w-full h-10'} />
                            </>
                        )}
                    </div>
                </Card>
            )}
        </>
    );
}
