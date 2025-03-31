import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArtistsWithSelectGrid, PlaylistWithSelectGrid } from '@/components/ui/items-grid';
import { MainContainerWithNav } from '@/components/ui/main-container';
import { Separator } from '@/components/ui/separator';
import { H1, H3, H4 } from '@/components/ui/typography';
import { useStorage } from '@/context/StorageContext';
import { Artist } from '@spotify/web-api-ts-sdk';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useMaker } from '@/context/MakerContext';
import { RefreshPlaylistsButton } from '@/components/refresh';
import { LoadingStates, ProcessedPlaylist, StoredPlaylist } from '@/types/common';
import { TracksTable } from '@/components/tracks-table/tracks-table';
import { Cover } from '@/components/ui/cover';

type Step = 1 | 2 | 3;

export function ArtistPlaylist() {
    const [step, setStep] = useState<Step>(1);
    const [selectedPlaylists, setSelectedPlaylists] = useState<StoredPlaylist[]>([]);
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
    selectedPlaylists: StoredPlaylist[];
    setSelectedPlaylists: (playlists: StoredPlaylist[]) => void;
    setStep: (step: Step) => void;
}) {
    const { getUserPlaylists } = useStorage();
    const [playlists, setPlaylists] = useState<StoredPlaylist[] | null>(null);
    const [isNewPlaylist, setIsNewPlaylist] = useState<boolean>(true);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [filteredPlaylists, setFilteredPlaylists] = useState<StoredPlaylist[] | null>(null);
    const [loadingState, setLoadingState] = useState<LoadingStates>('idle');

    useEffect(() => {
        (async () => {
            if (loadingState === 'loading') {
                setPlaylists(null);
                setFilteredPlaylists(null);
            } else if (loadingState === 'end') {
                await getUserPlaylists(true).then((playlists) => {
                    setPlaylists(playlists);
                    setFilteredPlaylists(playlists);
                    setLoadingState('idle');
                });
            } else if (loadingState === 'idle' && !playlists) {
                await getUserPlaylists(true).then((playlists) => {
                    setPlaylists(playlists);
                    setFilteredPlaylists(playlists);
                });
            }
        })();
    }, [loadingState, getUserPlaylists, playlists]);

    useEffect(() => {
        if (!playlists) return;
        const filtered = playlists.filter((playlist) =>
            playlist.name.toLowerCase().includes(globalFilter.toLowerCase())
        );
        setFilteredPlaylists(filtered);
    }, [globalFilter, playlists]);

    const addPlaylist = (playlist: StoredPlaylist) => {
        setSelectedPlaylists([...selectedPlaylists, playlist]);
    };

    const removePlaylist = (playlist: StoredPlaylist) => {
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
                    <div className={'w-2/3 flex items-center gap-4'}>
                        <Input
                            placeholder="Search playlists..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className=""
                        />
                        <RefreshPlaylistsButton setLoadingState={setLoadingState} />
                    </div>
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
            if (searchQuery.length !== 0) {
                const results = await searchArtistByName(searchQuery);
                setSearchResults(results);
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
    selectedPlaylists: StoredPlaylist[];
    selectedArtists: Artist[];
}) {
    const { processPlaylists } = useMaker();
    const { refreshPlaylists } = useStorage();
    const [processedPlaylists, setProcessedPlaylists] = useState<ProcessedPlaylist[] | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        async function process() {
            setProcessedPlaylists(await processPlaylists(selectedPlaylists, selectedArtists));
            await refreshPlaylists(30);
            setIsCompleted(true);
        }
        process();
    }, [selectedPlaylists, selectedArtists, processPlaylists, refreshPlaylists]);

    return (
        <div className="w-full flex flex-col items-center gap-4">
            {!isCompleted ? (
                <H3>Processing playlists...</H3>
            ) : (
                <>
                    <H3 className={'text-center'}>All playlists have been processed successfully !</H3>
                    <H4 className={'text-center'}> Here are the results :</H4>
                    <section className="w-full flex flex-col items-center">
                        {processedPlaylists ? (
                            processedPlaylists.filter((processedPlaylist) => processedPlaylist.tracks.length > 0)
                                .length > 0 ? (
                                processedPlaylists
                                    .filter((processedPlaylist) => processedPlaylist.tracks.length > 0)
                                    .map((processedPlaylist) => (
                                        <div
                                            key={processedPlaylist.playlist.id}
                                            className={'w-full flex flex-col gap-4 px-10 py-8'}
                                        >
                                            <H3 className={'w-full flex justify-start gap-4'}>
                                                <Cover
                                                    images={processedPlaylist.playlist.images}
                                                    coverType={'playlist'}
                                                    className={'!w-8 !h-8'}
                                                />
                                                {processedPlaylist.playlist.name}
                                            </H3>
                                            <TracksTable tracks={processedPlaylist.tracks} />
                                        </div>
                                    ))
                            ) : (
                                <H3>No tracks added to the playlists</H3>
                            )
                        ) : (
                            <H3>No tracks added to the playlists</H3>
                        )}
                    </section>
                </>
            )}
        </div>
    );
}
