import {Artist, Track} from "@spotify/web-api-ts-sdk";
import {useStorage} from "@/context/StorageContext.tsx";
import {useEffect, useState} from "react";
import ItemsGrid from "@/components/ui/items-grid.tsx";
import {Card, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger} from "@/components/ui/select.tsx";

interface TopItemsProps {
    type: "artists" | "tracks";
}

export default function TopItems({type}: TopItemsProps) {
    const {getSettings, getUserTopItems} = useStorage();
    const [items, setItems] = useState<Artist[] | Track[] | null>(null);
    const [limit] = useState(parseInt(getSettings('home', 'limit')));
    const [timeRange, setTimeRange] = useState<'short_term' | 'medium_term' | 'long_term'>(getSettings('home', 'timeRange') as 'short_term' | 'medium_term' | 'long_term');

    useEffect(() => {
        (async () => {
            if (items) return;
            if (type === "artists")
                setItems(await getUserTopItems<Artist>(type, limit, timeRange));
            else
                setItems(await getUserTopItems<Track>(type, limit, timeRange));
        })()
    }, [getUserTopItems, setItems, items, type, limit, timeRange]);

    return (
        <Card className={"w-full"}>
            <CardHeader>
                <CardTitle className={"flex justify-between"}>
                    {type === "artists" ? "Top Artists" : "Top Tracks"}
                    <Select
                        onValueChange={(value) => setTimeRange(value as 'short_term' | 'medium_term' | 'long_term')}
                        defaultValue={timeRange}>
                        <SelectTrigger className={"w-1/4"}>
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