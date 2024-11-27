import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MainContainerWithNav } from '@/components/ui/main-container';
import { H1 } from '@/components/ui/typography';
import { Link } from 'react-router-dom';

export function Maker() {
    return (
        <MainContainerWithNav>
            <H1>Maker</H1>
            <Card className={'w-full flex flex-col items-center justify-center py-4'}>
                <Link to={'/maker/artist-playlist'} className={'flex items-center gap-4'}>
                    Make playlists with all tracks from an artist
                    <Button>GO</Button>
                </Link>
            </Card>
        </MainContainerWithNav>
    );
}
