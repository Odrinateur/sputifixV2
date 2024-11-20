import { Card } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';
import { Heart, House, Settings, TrendingUp } from 'lucide-react';

export function Navbar() {
    return (
        <nav className={'w-full lg:w-1/5 flex flex-col gap-10 justify-start'}>
            <Card
                className={
                    'w-full flex flex-col grid-cols-none sm:grid sm:grid-cols-2 lg:flex-col lg:grid-cols-none py-4 gap-2 justify-start sm:justify-center lg:justify-center'
                }
            >
                <Button variant="link" className={'text-2xl'}>
                    <House className={'!w-6 !h-6'} />
                    <Link to={'/'}>Home</Link>
                </Button>
                <Button variant="link" className={'text-2xl'}>
                    <Heart className={'!w-6 !h-6'} />
                    <Link to={'/likes'}>Likes</Link>
                </Button>
                <Button variant="link" className={'text-2xl'}>
                    <Settings className={'!w-6 !h-6'} />
                    <Link to={'/settings'}>Settings</Link>
                </Button>
                <Button variant="link" className={'text-2xl'}>
                    <TrendingUp className={'!w-6 !h-6'} />
                    <Link to={'/top/artists'}>Top Artists</Link>
                </Button>
                <Button variant="link" className={'text-2xl'}>
                    <TrendingUp className={'!w-6 !h-6'} />
                    <Link to={'/top/tracks'}>Top Tracks</Link>
                </Button>
            </Card>
        </nav>
    );
}
