import { useStorage } from '@/context/StorageContext';
import { SavedTrack } from '@spotify/web-api-ts-sdk';
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
import { Cover } from './ui/cover';
import { Input } from '@/components/ui/input';
import { RefreshLikesButton } from './refresh';
import { Skeleton } from './ui/skeleton';

const columns: ColumnDef<SavedTrack>[] = [
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
                <Cover coverType="track" images={row.original.track.album.images} className={'!w-8 !h-8 rounded-sm'} />
            </div>
        ),
    },
    {
        id: 'titleAndArtists',
        accessorFn: (row) => `${row.track.name} - ${row.track.artists.map((a) => a.name).join(', ')}`,
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
                    href={row.original.track.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                >
                    {row.original.track.name}
                </a>
                {' - '}
                {row.original.track.artists.map((artist, idx) => (
                    <React.Fragment key={artist.id}>
                        <a
                            href={artist.external_urls.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                        >
                            {artist.name}
                        </a>
                        {idx < row.original.track.artists.length - 1 ? ', ' : ''}
                    </React.Fragment>
                ))}
            </div>
        ),
    },
    {
        id: 'album',
        accessorFn: (row) => row.track.album.name,
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
                    href={row.original.track.album.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                >
                    {row.original.track.album.name}
                </a>
            </div>
        ),
    },
    {
        id: 'duration_ms',
        accessorFn: (row) => row.track.duration_ms,
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

const fuzzyFilter: FilterFn<SavedTrack> = (row, _columnId, value: string) => {
    const searchValue = value.toLowerCase();
    const track = row.original.track;
    return (
        track.name.toLowerCase().includes(searchValue) ||
        track.artists.some((artist) => artist.name.toLowerCase().includes(searchValue)) ||
        track.album.name.toLowerCase().includes(searchValue)
    );
};

export function LikeTable() {
    const { getUserLikes } = useStorage();
    const [likes, setLikes] = useState<SavedTrack[] | null>(null);
    const [endLoading, setEndLoading] = useState(false);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');

    useEffect(() => {
        (async () => {
            if (likes) return;
            setLikes(await getUserLikes());
        })();
    }, [getUserLikes, likes]);

    useEffect(() => {
        console.log('endLoading', endLoading);
        (async () => {
            if (likes && !endLoading) return;
            const newLikes = await getUserLikes();
            setLikes(newLikes);
            setEndLoading(false);
        })();
    }, [getUserLikes, endLoading, likes]);

    const table = useReactTable({
        data: likes || [],
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
            <div className={'flex items-center gap-4'}>
                <Input
                    placeholder="Search tracks, artists or albums..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="w-full"
                />
                <RefreshLikesButton setEndLoading={setEndLoading} />
            </div>
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
                        {table.getRowModel().rows?.length ? (
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
                            <>
                                {likes ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No results found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    Array.from({ length: 20 }).map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell colSpan={columns.length}>
                                                <Skeleton className={'w-full h-10'} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
