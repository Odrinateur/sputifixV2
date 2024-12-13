import { Track } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';
import * as React from 'react';
import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    FilterFn,
    getFilteredRowModel,
} from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Cover } from '../ui/cover';
import { Input } from '@/components/ui/input';
import { Skeleton } from '../ui/skeleton';
import { LoadingStates } from '@/types/common';

const columns: ColumnDef<Track>[] = [
    {
        id: 'index',
        accessorFn: (_, index) => index,
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    #
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="flex justify-start items-center gap-4">
                {row.index + 1}
                <Cover coverType="track" images={row.original.album.images} className={'!w-8 !h-8 rounded-sm'} />
            </div>
        ),
    },
    {
        id: 'titleAndArtists',
        accessorFn: (row) => `${row.name} - ${row.artists.map((a) => a.name).join(', ')}`,
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Title & Artists
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="max-w-[500px] truncate flex gap-1 flex-wrap">
                <a
                    href={row.original.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                >
                    {row.original.name}
                </a>
                {' - '}
                {row.original.artists.map((artist, idx) => (
                    <React.Fragment key={artist.id}>
                        <a
                            href={artist.external_urls.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                        >
                            {artist.name}
                        </a>
                        {idx < row.original.artists.length - 1 ? ', ' : ''}
                    </React.Fragment>
                ))}
            </div>
        ),
    },
    {
        id: 'album',
        accessorFn: (row) => row.album.name,
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Album
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="max-w-[200px] truncate">
                <a
                    href={row.original.album.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                >
                    {row.original.album.name}
                </a>
            </div>
        ),
    },
    {
        id: 'duration_ms',
        accessorFn: (row) => row.duration_ms,
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Duration
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const ms = row.getValue<number>('duration_ms');
            const minutes = Math.floor(ms / 60000);
            const seconds = Math.floor((ms % 60000) / 1000);
            return <div>{`${minutes}:${seconds.toString().padStart(2, '0')}`}</div>;
        },
    },
];

const fuzzyFilter: FilterFn<Track> = (row, _columnId, value: string) => {
    const searchValue = value.toLowerCase();
    const track = row.original;
    return (
        track.name.toLowerCase().includes(searchValue) ||
        track.artists.some((artist) => artist.name.toLowerCase().includes(searchValue)) ||
        track.album.name.toLowerCase().includes(searchValue)
    );
};

export function TracksTable({
    tracks,
    RefreshButton,
    id,
}: {
    tracks: Track[] | null;
    RefreshButton?: React.ComponentType<{ id?: string; setLoadingState: (state: LoadingStates) => void }> | null;
    id?: string;
}) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [loadingState, setLoadingState] = useState<LoadingStates>('idle');
    const [currentTracks, setCurrentTracks] = useState<Track[] | null>(null);

    useEffect(() => {
        (async () => {
            if (tracks) setLoadingState('end');
            else setLoadingState('loading');
        })();
    }, [tracks]);

    useEffect(() => {
        (async () => {
            if (loadingState === 'loading') setCurrentTracks(null);
            else if (loadingState === 'end') setCurrentTracks(tracks);
            else if (loadingState === 'idle') return;
        })();
    }, [loadingState, tracks]);

    const table = useReactTable({
        data: currentTracks || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        state: {
            sorting,
            globalFilter,
        },
    });

    return (
        <div className="w-full space-y-4">
            {RefreshButton ? (
                <div className={'flex items-center gap-4'}>
                    <Input
                        placeholder="Search tracks, artists or albums..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="w-full"
                    />
                    <RefreshButton id={id} setLoadingState={setLoadingState} />
                </div>
            ) : null}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loadingState == 'loading' ? (
                            Array.from({ length: 20 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell colSpan={columns.length}>
                                        <Skeleton className={'w-full h-10'} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
