import { Card } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';
import { AudioLines, ChartBar, Heart, House, ListMusic, Settings, Users } from 'lucide-react';
import { H3 } from './ui/typography';

export function Navbar() {
    return (
        <nav className={'w-full lg:h-full lg:w-1/5 flex flex-col gap-5 justify-start lg:flex-1'}>
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
            <Card className={'w-full hidden lg:flex flex-col py-4 gap-2 items-center'}>
                <H3 className={'flex items-center gap-2'}>
                    <ChartBar className={'!w-6 !h-6'} />
                    Stats.fm
                </H3>
            </Card>
            <Card className={'w-full flex py-2 justify-center items-start lg:mt-auto'}>
                <NavBarLinkWithIcon
                    to={'/settings'}
                    icon={<Settings className={'!w-6 !h-6'} />}
                    text={'Settings'}
                    isTextHidden={false}
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
