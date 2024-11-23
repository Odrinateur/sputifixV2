import { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { H1, H4 } from '@/components/ui/typography.tsx';
import { Link2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Cover } from '@/components/ui/cover.tsx';
import { useStorage } from '@/context/StorageContext.tsx';

export function PlaylistCard({ id }: { id: string }) {
    const { getPlaylist } = useStorage();
    const [playlist, setPlaylist] = useState<SimplifiedPlaylist | null>(null);

    useEffect(() => {
        (async () => {
            if (playlist) return;
            await getPlaylist(id).then(([playlist]) => {
                setPlaylist(playlist);
            });
        })();
    }, [getPlaylist, playlist, id]);

    return (
        <Card className={'w-full h-2/5'}>
            <CardContent className={'w-full h-full p-4 flex flex-col sm:flex-row justify-start gap-4'}>
                {playlist ? (
                    <Cover images={playlist.images} coverType={'playlist'} className={'rounded-xl !h-full'} />
                ) : (
                    <Skeleton className={'w-32 h-32 sm:w-40 sm:h-40'} />
                )}
                <div className={'w-3/5 h-full p-2 flex flex-col items-start gap-4'}>
                    {playlist ? (
                        <>
                            <H1 className={'flex justify-center items-center gap-4'}>
                                {playlist.name}
                                <Link to={playlist.external_urls.spotify} target="_blank">
                                    <Link2 className={'!w-12 !h-12'} />
                                </Link>
                            </H1>
                            <H4 className={'mt-auto'}>
                                owner : {playlist.owner.display_name}
                                <Link to={playlist.owner.external_urls.spotify} target="_blank">
                                    <Link2 className={'!w-12 !h-12'} />
                                </Link>
                            </H4>
                            <H4>ower id : {playlist.owner.id}</H4>
                            <H4>{playlist.collaborative ? 'Collaborative' : 'N@ot collaborative'}</H4>
                        </>
                    ) : (
                        <>
                            <Skeleton className={'w-1/2 h-1/6'} />
                            <Skeleton className={'w-1/2 h-1/6 mt-auto'} />
                            <Skeleton className={'w-1/2 h-1/6'} />
                            <Skeleton className={'w-1/2 h-1/6'} />
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
