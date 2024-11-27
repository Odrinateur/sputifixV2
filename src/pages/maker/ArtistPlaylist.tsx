import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArtistsWithSelectGrid, PlaylistWithSelectGrid } from '@/components/ui/items-grid';
import { MainContainerWithNav } from '@/components/ui/main-container';
import { Separator } from '@/components/ui/separator';
import { H1, H3 } from '@/components/ui/typography';
import { useStorage } from '@/context/StorageContext';
import { Artist, SimplifiedPlaylist } from '@spotify/web-api-ts-sdk';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useMaker } from '@/context/MakerContext';
import { useNavigate } from 'react-router-dom';

type Step = 1 | 2 | 3;

export function ArtistPlaylist() {
    const [step, setStep] = useState<Step>(1);
    const [selectedPlaylists, setSelectedPlaylists] = useState<SimplifiedPlaylist[]>([]);
    const [selectedArtists, setSelectedArtists] = useState<Artist[]>([]);

    return (
        <MainContainerWithNav>
            <H1>Make playlists with all tracks from an artist</H1>
            <Card className={'w-full flex flex-col py-4 gap-4 justify-center items-center'}>
                <H3 className={'flex justify-center items-center gap-4'}>
                    <Button
                        variant="ghost"
                        className={'p-0 px-2'}
                        onClick={() => setStep((prevStep) => (prevStep > 1 ? ((prevStep - 1) as Step) : prevStep))}
                        disabled={step !== 2}
                    >
                        <ChevronLeft className={'!w-6 !h-6'} />
                    </Button>
                    Step {step}
                    <Button
                        variant="ghost"
                        className={'p-0 px-2'}
                        onClick={() => setStep((prevStep) => (prevStep < 3 ? ((prevStep + 1) as Step) : prevStep))}
                        disabled={step === 3}
                    >
                        <ChevronRight className={'!w-6 !h-6'} />
                    </Button>
                </H3>
                {step === 1 && (
                    <Step1
                        selectedPlaylists={selectedPlaylists}
                        setSelectedPlaylists={setSelectedPlaylists}
                        setStep={setStep}
                    />
                )}
                {step === 2 && (
                    <Step2
                        selectedArtists={selectedArtists}
                        setSelectedArtists={setSelectedArtists}
                        setStep={setStep}
                    />
                )}
                {step === 3 && <Step3 selectedPlaylists={selectedPlaylists} selectedArtists={selectedArtists} />}
            </Card>
        </MainContainerWithNav>
    );
}

function Step1({
    selectedPlaylists,
    setSelectedPlaylists,
    setStep,
}: {
    selectedPlaylists: SimplifiedPlaylist[];
    setSelectedPlaylists: (playlists: SimplifiedPlaylist[]) => void;
    setStep: (step: Step) => void;
}) {
    const { getUserPlaylists } = useStorage();
    const [playlists, setPlaylists] = useState<SimplifiedPlaylist[] | null>(null);
    const [isNewPlaylist, setIsNewPlaylist] = useState<boolean>(true);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [filteredPlaylists, setFilteredPlaylists] = useState<SimplifiedPlaylist[] | null>(null);

    useEffect(() => {
        (async () => {
            await getUserPlaylists(true).then((playlists) => {
                setPlaylists(playlists);
                setFilteredPlaylists(playlists);
            });
        })();
    }, [getUserPlaylists]);

    useEffect(() => {
        if (!playlists) return;
        const filtered = playlists.filter((playlist) =>
            playlist.name.toLowerCase().includes(globalFilter.toLowerCase())
        );
        setFilteredPlaylists(filtered);
    }, [globalFilter, playlists]);

    const addPlaylist = (playlist: SimplifiedPlaylist) => {
        setSelectedPlaylists([...selectedPlaylists, playlist]);
    };

    const removePlaylist = (playlist: SimplifiedPlaylist) => {
        setSelectedPlaylists(selectedPlaylists.filter((p) => p.id !== playlist.id));
    };

    const handleNext = () => {
        if (isNewPlaylist || (!isNewPlaylist && selectedPlaylists.length > 0)) {
            setStep(2);
        }
    };

    return (
        <>
            <H3 className={'flex justify-center items-center gap-4'}>
                Review all playlists
                <Button
                    onClick={() => {
                        setSelectedPlaylists(playlists || []);
                        setStep(3);
                    }}
                    disabled={!playlists}
                >
                    Go
                </Button>
            </H3>
            <Separator className={'w-2/3'} />
            <H3 className={'flex justify-center items-center gap-4'}>
                Make a new playlist
                <Checkbox
                    checked={isNewPlaylist}
                    onCheckedChange={(checked: boolean) => {
                        setIsNewPlaylist(checked);
                        setSelectedPlaylists([]);
                    }}
                />
                <Button
                    disabled={!playlists || (!isNewPlaylist && (selectedPlaylists || []).length === 0)}
                    onClick={handleNext}
                >
                    Next
                </Button>
            </H3>

            {!isNewPlaylist && (
                <>
                    <Input
                        placeholder="Search playlists..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="w-2/3"
                    />
                    <PlaylistWithSelectGrid
                        items={filteredPlaylists}
                        addPlaylist={addPlaylist}
                        removePlaylist={removePlaylist}
                        selectedPlaylists={selectedPlaylists}
                    />
                </>
            )}
        </>
    );
}

function Step2({
    selectedArtists,
    setSelectedArtists,
    setStep,
}: {
    selectedArtists: Artist[];
    setSelectedArtists: (artists: Artist[]) => void;
    setStep: (step: Step) => void;
}) {
    const { searchArtistByName } = useMaker();
    const [searchResults, setSearchResults] = useState<Artist[] | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        const delaySearch = setTimeout(async () => {
            if (searchQuery.length > 2) {
                const results = await searchArtistByName(searchQuery);
                setSearchResults(results);
            } else {
                setSearchResults(null);
            }
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [searchQuery, searchArtistByName]);

    const addArtist = (artist: Artist) => {
        setSelectedArtists([...selectedArtists, artist]);
    };

    const removeArtist = (artist: Artist) => {
        setSelectedArtists(selectedArtists.filter((a) => a.id !== artist.id));
    };

    return (
        <>
            <div className={'w-full flex justify-center items-center gap-4'}>
                <Input
                    placeholder="Search for artists..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-2/3"
                />
                <Button disabled={(selectedArtists || []).length === 0} onClick={() => setStep(3)}>
                    Next
                </Button>
            </div>
            <ArtistsWithSelectGrid
                selectedArtists={selectedArtists}
                items={searchResults}
                addArtist={addArtist}
                removeArtist={removeArtist}
            />
        </>
    );
}

function Step3({
    selectedPlaylists,
    selectedArtists,
}: {
    selectedPlaylists: SimplifiedPlaylist[];
    selectedArtists: Artist[];
}) {
    const { processPlaylists } = useMaker();
    const { refreshPlaylists } = useStorage();
    const [isCompleted, setIsCompleted] = useState(false);

    const navigator = useNavigate();

    useEffect(() => {
        async function process() {
            await processPlaylists(selectedPlaylists, selectedArtists);
            await refreshPlaylists();
            setIsCompleted(true);
        }
        process();
    }, [selectedPlaylists, selectedArtists, processPlaylists, refreshPlaylists]);

    useEffect(() => {
        if (isCompleted) {
            setTimeout(() => {
                navigator('/maker');
            }, 2000);
        }
    }, [isCompleted, navigator]);

    return (
        <div className="flex flex-col items-center gap-4">
            {!isCompleted ? <H3>Processing playlists...</H3> : <H3>All playlists have been processed successfully!</H3>}
        </div>
    );
}
