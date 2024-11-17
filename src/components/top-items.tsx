import {Artist, Track} from "@spotify/web-api-ts-sdk";
import {useStorage} from "@/context/StorageContext.tsx";
import {useEffect, useState} from "react";
import ItemsGrid from "@/components/ui/items-grid.tsx";
import {Card, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger} from "@/components/ui/select.tsx";
import {TimeRangeType, TopItemsType} from "@/types/common.ts";
import {Link} from "react-router-dom";
import {SquareArrowOutUpRight} from "lucide-react";

interface TopItemsProps {
    type: TopItemsType;
    isHome?: boolean;
}

export default function TopItems({type, isHome = true}: TopItemsProps) {
    const {getSettings, getUserTopItems} = useStorage();
    const [items, setItems] = useState<Artist[] | Track[] | null>(null);
    const [limit] = useState(isHome ? parseInt(getSettings('home', 'limit')) : parseInt(getSettings('top_items', 'limit')));
    const [timeRange, setTimeRange] = useState<TimeRangeType>(isHome ? getSettings('home', 'timeRange') as TimeRangeType : getSettings('top_items', 'timeRange') as TimeRangeType);

    useEffect(() => {
        (async () => {
            if (type === "artists")
                setItems(await getUserTopItems<Artist>(type, limit, timeRange));
            else
                setItems(await getUserTopItems<Track>(type, limit, timeRange));
        })()
    }, [getUserTopItems, type, limit, timeRange]);

    return (
        <Card className={"w-full"}>
            <CardHeader>
                <CardTitle className={"flex justify-between items-center"}>
                    {isHome ?
                        <Link to={`/top/${type}`} className={"flex justify-center items-center gap-2"}>
                            {type === "artists" ? "Top Artists" : "Top Tracks"}
                            <SquareArrowOutUpRight size={20} strokeWidth={3.2}/>
                        </Link>
                        :
                        type === "artists" ? "Top Artists" : "Top Tracks"
                    }
                    <Select
                        onValueChange={(value) => {
                            setTimeRange(value as TimeRangeType);
                            setItems(null);
                        }}
                        defaultValue={timeRange}>
                        <SelectTrigger className={"w-40"}>
                            {timeRange === "short_term" ? "4 weeks" : timeRange === "medium_term" ? "6 months" : "1 year"}
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="short_term">4 weeks</SelectItem>
                            <SelectItem value="medium_term">6 months</SelectItem>
                            <SelectItem value="long_term">1 year</SelectItem>
                        </SelectContent>
                    </Select>
                </CardTitle>
            </CardHeader>
            <ItemsGrid items={items} type={type === "artists" ? "Artists" : "Tracks"}/>
        </Card>
    );
}