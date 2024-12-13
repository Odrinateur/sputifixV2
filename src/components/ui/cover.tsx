import React from 'react';
import { Image } from '@spotify/web-api-ts-sdk';
import { Disc3, ListMusic, SquareLibrary, SquareUserRound, User } from 'lucide-react';

type CoverType = 'album' | 'track' | 'artist' | 'playlist' | 'user';

interface CoverProps {
    images: Image[];
    coverType: CoverType;
    className?: string;
}

export const Cover: React.FC<CoverProps> = ({ images, coverType, className }) => {
    if (!images || images.length === 0) {
        className = `${className} h-fit`;
        switch (coverType) {
            case 'album':
                return AlbumCover(className);
            case 'track':
                return TrackCover(className);
            case 'artist':
                return ArtistCover(className);
            case 'playlist':
                return PlaylistCover(className);
            case 'user':
                return UserCover(className);
            default:
                return null;
        }
    }
    const bestImage = images.reduce((prev, current) => {
        if (current.height > prev.height) {
            return current;
        }
        return prev;
    });
    const image = bestImage.url;

    if (coverType != 'user') className = `${className} h-max aspect-square`;

    return <img src={image} alt={`${coverType} cover`} className={`object-cover ${className}`} />;
};

function AlbumCover(className: string | undefined) {
    return <SquareLibrary className={`${className}`} />;
}

function TrackCover(className: string | undefined) {
    return <Disc3 className={`${className}`} />;
}

function ArtistCover(className: string | undefined) {
    return <SquareUserRound className={`${className}`} />;
}

function PlaylistCover(className: string | undefined) {
    return <ListMusic className={`${className}`} />;
}

function UserCover(className: string | undefined) {
    return <User className={`${className}`} />;
}
