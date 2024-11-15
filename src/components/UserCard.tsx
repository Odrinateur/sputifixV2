import {UserProfile} from "@spotify/web-api-ts-sdk";
import {useEffect, useState} from "react";
import {useSpotifySdk} from "@/context/SpotifyContext.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {H1, H4} from "@/components/ui/typography.tsx";
import {BadgeCheck, Link2} from "lucide-react";
import {Link} from "react-router-dom";

export default function UserCard() {
    const sdk = useSpotifySdk();
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        if (!sdk) return;
        sdk.currentUser.profile().then((user) => setUser(() => user));
    }, [sdk]);

    return <Card className={"w-full h-2/5"}>
        <CardContent className={"w-full h-full p-4 flex justify-start gap-4"}>
            {user ?
                <img src={user.images[0]?.url} alt={user.display_name} className={"w-2/5 h-full rounded-xl"}/>
                :
                <Skeleton className={"w-2/5 h-full"}/>
            }
            <div className={"w-3/5 h-full p-2 flex flex-col items-start gap-1"}>
                {user ?
                    <>
                        <H1 className={"flex justify-center items-center gap-4"}>
                            {user.display_name}
                            <span className={"flex flex-col justify-between items-center"}>
                                {user.product === "premium" ?
                                    <BadgeCheck/>
                                    :
                                    <></>
                                }
                                <H4>{user.country}</H4>
                            </span>
                            <Link to={user.external_urls.spotify} target="_blank">
                                <Link2 className={"!w-12 !h-12"}/>
                            </Link>
                        </H1>
                        <H4 className={"mt-auto"}>id : {user.id}</H4>
                        <H4>email : {user.email}</H4>
                        <H4>{user.followers.total} followers</H4>
                    </>
                    :
                    <>
                        <Skeleton className={"w-1/2 h-1/5"}/>
                        <Skeleton className={"w-1/2 h-1/5 mt-auto"}/>
                        <Skeleton className={"w-1/2 h-1/5"}/>
                        <Skeleton className={"w-1/2 h-1/5"}/>
                    </>
                }
            </div>

        </CardContent>
    </Card>
}