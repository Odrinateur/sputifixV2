import { Card } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';
import { AudioLines, Heart, House, ListMusic, Settings, Users } from 'lucide-react';
import { H3 } from './ui/typography';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { useStorage } from '@/context/StorageContext';
import { useEffect, useState } from 'react';
import { ThemeType } from '@/types/common';
import { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk';
import { Cover } from './ui/cover';
import { Skeleton } from './ui/skeleton';

export function Navbar() {
    const {
        getTheme,
        setTheme,
        getPinnedUserPlaylists,
        subscribeToPinnedPlaylistsUpdate,
        unsubscribeFromPinnedPlaylistsUpdate,
    } = useStorage();
    const [currentTheme, setCurrentTheme] = useState<ThemeType>('dark');
    const [pinnedPlaylists, setPinnedPlaylists] = useState<SimplifiedPlaylist[] | null>(null);

    useEffect(() => {
        const updatePinnedPlaylists = async () => {
            setPinnedPlaylists(await getPinnedUserPlaylists());
        };

        (async () => {
            setCurrentTheme(await getTheme());
            updatePinnedPlaylists();
        })();

        subscribeToPinnedPlaylistsUpdate(updatePinnedPlaylists);
        return () => {
            unsubscribeFromPinnedPlaylistsUpdate(updatePinnedPlaylists);
        };
    }, [getPinnedUserPlaylists, getTheme, subscribeToPinnedPlaylistsUpdate, unsubscribeFromPinnedPlaylistsUpdate]);

    const handleThemeSwitch = () => {
        setTheme(currentTheme === 'light' ? 'dark' : 'light');
        setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <nav className={'w-full lg:h-full lg:w-1/5 2xl:w-1/6 flex flex-col gap-5 justify-start lg:flex-1'}>
            <Card className={'w-full flex lg:flex-col py-4 gap-2 justify-center'}>
                <NavBarLinkWithIcon to={'/'} icon={<House className={'!w-6 !h-6'} />} text={'Home'} />
                <NavBarLinkWithIcon to={'/likes'} icon={<Heart className={'!w-6 !h-6'} />} text={'Likes'} />
                <NavBarLinkWithIcon to={'/playlists'} icon={<ListMusic className={'!w-6 !h-6'} />} text={'Playlists'} />
                <NavBarLinkWithIcon to={'/top/artists'} icon={<Users className={'!w-6 !h-6'} />} text={'Top Artists'} />
                <NavBarLinkWithIcon
                    to={'/top/tracks'}
                    icon={<AudioLines className={'!w-6 !h-6'} />}
                    text={'Top Tracks'}
                />
            </Card>
            {pinnedPlaylists ? (
                <Card className="w-full flex px-4 py-4 gap-4 items-center overflow-x-auto">
                    {pinnedPlaylists.map((playlist) => (
                        <Link to={`/playlist/${playlist.id}`} key={playlist.id} className={'w-10 h-10 flex-shrink-0'}>
                            <Cover
                                images={playlist.images}
                                coverType="playlist"
                                key={playlist.id}
                                className="object-cover w-full h-full rounded-md"
                            />
                        </Link>
                    ))}
                </Card>
            ) : (
                <Card className={'w-full flex px-4 py-4 gap-4 items-center overflow-x-auto'}>
                    {[...Array(10)].map((_, index) => (
                        <Skeleton key={index} className={'w-10 h-10 flex-shrink-0'} />
                    ))}
                </Card>
            )}
            {/* <StatsFMCard /> */}
            <Card className={'w-full flex py-2 justify-center items-center lg:mt-auto lg:flex-col 2xl:flex-row'}>
                <NavBarLinkWithIcon
                    to={'/settings'}
                    icon={<Settings className={'!w-6 !h-6'} />}
                    text={'Settings'}
                    isTextHidden={false}
                />
                <Separator orientation="vertical" className={'lg:hidden 2xl:block'} />
                <Switch
                    className={'my-2 mx-4'}
                    checked={currentTheme === 'light'}
                    onCheckedChange={handleThemeSwitch}
                />
            </Card>
        </nav>
    );
}

const NavBarLinkWithIcon = ({
    to,
    icon,
    text,
    isTextHidden = true,
}: {
    to: string;
    icon: React.ReactNode;
    text: string;
    isTextHidden?: boolean;
}) => (
    <Button variant="link" className={'text-2xl'}>
        <Link to={to} className={'w-full flex justify-center items-center gap-2'}>
            {icon}
            <H3 className={isTextHidden ? 'hidden lg:block' : ''}>{text}</H3>
        </Link>
    </Button>
);
