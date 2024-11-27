import { MainContainerWithNav } from '@/components/ui/main-container';
import { H1, H3, H4 } from '@/components/ui/typography';
import { Card, CardContent } from '@/components/ui/card';
import { useStorage } from '@/context/StorageContext';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import {
    HomeDisplayLimits,
    HomeDisplayLimitType,
    TimeRangeType,
    TopDisplayLimit,
    TopDisplayLimits,
} from '@/types/common';

export function Settings() {
    const { getSettings, setSettings } = useStorage();
    const [isLoading, setIsLoading] = useState(true);

    const [homePageTimeRange, setHomePageTimeRange] = useState<TimeRangeType>('medium_term');
    const [homePageLimit, setHomePageLimit] = useState<HomeDisplayLimitType>(HomeDisplayLimits[0]);
    const [topItemsTimeRange, setTopItemsTimeRange] = useState<TimeRangeType>('medium_term');
    const [topItemsLimit, setTopItemsLimit] = useState<TopDisplayLimit>(TopDisplayLimits[0]);
    // const [statsFMEnabled, setStatsFMEnabled] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            const homePageTimeRange = (await getSettings('home', 'timeRange')) as TimeRangeType;
            const homePageLimit = parseInt(await getSettings('home', 'limit')) as HomeDisplayLimitType;
            const topItemsTimeRange = (await getSettings('top_items', 'timeRange')) as TimeRangeType;
            const topItemsLimit = parseInt(await getSettings('top_items', 'limit')) as TopDisplayLimit;
            // const statsFMEnabled = (await getSettings('statsFM', 'display')) as unknown as boolean;

            setHomePageTimeRange(homePageTimeRange);
            setHomePageLimit(homePageLimit);
            setTopItemsTimeRange(topItemsTimeRange);
            setTopItemsLimit(topItemsLimit);
            setIsLoading(false);
            // setStatsFMEnabled(statsFMEnabled);
        })();
    }, [getSettings]);

    // const handleStatsFMSwitch = () => {
    //     setStatsFMEnabled(!statsFMEnabled);
    //     setSettings('statsFM', !statsFMEnabled as unknown as string, 'display');
    // };

    if (isLoading) {
        return (
            <MainContainerWithNav>
                <H1>Loading...</H1>
            </MainContainerWithNav>
        );
    }

    return (
        <MainContainerWithNav>
            <H1>Settings</H1>
            <Card>
                <CardContent className={'w-full h-full p-4 flex flex-col justify-start gap-4'}>
                    <H3 className={'w-full text-center'}>Home page</H3>
                    <div className={'w-full flex flex-col sm:flex-row justify-center items-center gap-4'}>
                        <H4>Time range</H4>
                        <Select
                            onValueChange={(value) => {
                                setHomePageTimeRange(value as TimeRangeType);
                                setSettings('home', value, 'timeRange');
                            }}
                            defaultValue={homePageTimeRange}
                        >
                            <SelectTrigger className={'w-40'}>
                                {homePageTimeRange === 'short_term'
                                    ? '4 weeks'
                                    : homePageTimeRange === 'medium_term'
                                      ? '6 months'
                                      : '1 year'}
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="short_term">4 weeks</SelectItem>
                                <SelectItem value="medium_term">6 months</SelectItem>
                                <SelectItem value="long_term">1 year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className={'w-full flex flex-col sm:flex-row justify-center items-center gap-4'}>
                        <H4>Limit</H4>
                        <Select
                            onValueChange={(value) => {
                                setHomePageLimit(parseInt(value) as HomeDisplayLimitType);
                                setSettings('home', value, 'limit');
                            }}
                            defaultValue={homePageLimit.toString()}
                        >
                            <SelectTrigger className={'w-20'}>{homePageLimit}</SelectTrigger>
                            <SelectContent>
                                {HomeDisplayLimits.map((limit) => (
                                    <SelectItem key={limit} value={limit.toString()}>
                                        {limit}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <H3 className={'w-full text-center'}>Top items</H3>
                    <div className={'w-full flex flex-col sm:flex-row justify-center items-center gap-4'}>
                        <H4>Time range</H4>
                        <Select
                            onValueChange={(value) => {
                                setTopItemsTimeRange(value as TimeRangeType);
                                setSettings('top_items', value, 'timeRange');
                            }}
                            defaultValue={topItemsTimeRange}
                        >
                            <SelectTrigger className={'w-40'}>
                                {topItemsTimeRange === 'short_term'
                                    ? '4 weeks'
                                    : topItemsTimeRange === 'medium_term'
                                      ? '6 months'
                                      : '1 year'}
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="short_term">4 weeks</SelectItem>
                                <SelectItem value="medium_term">6 months</SelectItem>
                                <SelectItem value="long_term">1 year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className={'w-full flex flex-col sm:flex-row justify-center items-center gap-4'}>
                        <H4>Limit</H4>
                        <Select
                            onValueChange={(value) => {
                                setTopItemsLimit(parseInt(value) as TopDisplayLimit);
                                setSettings('top_items', value, 'limit');
                            }}
                            defaultValue={topItemsLimit.toString()}
                        >
                            <SelectTrigger className={'w-20'}>{topItemsLimit}</SelectTrigger>
                            <SelectContent>
                                {TopDisplayLimits.map((limit) => (
                                    <SelectItem key={limit} value={limit.toString()}>
                                        {limit}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* <div className={'w-full flex flex-col sm:flex-row justify-center items-center gap-4'}>
                        <H4>Stats.fm</H4>
                        <Switch checked={statsFMEnabled} onCheckedChange={handleStatsFMSwitch} />
                    </div> */}
                </CardContent>
            </Card>
        </MainContainerWithNav>
    );
}
