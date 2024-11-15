import {PaginatedResponse} from "./common";

export interface TopArtistResponse extends PaginatedResponse<ArtistResponse> {
    items: ArtistResponse[];
}

export interface ArtistResponse {
    external_urls: {
        spotify: string;
    };
    followers: {
        href: string | null;
        total: number;
    };
    genres: string[];
    href: string;
    id: string;
    images: {
        height: number | null;
        url: string;
        width: number | null;
    }[];
    name: string;
    popularity: number;
    type: string;
    uri: string;
}

export class TopArtists {
    total: number;
    artists: Artist[];
    lastUpdated: number = Date.now();

    constructor(response: ArtistResponse[]) {
        this.total = response.length;
        this.artists = response.map((artistResponse) => new Artist(artistResponse));
    }
}

export class Artist {
    externalUrl: string;
    followers: number;
    genres: string[];
    id: string;
    imageUrl: string;
    name: string;
    popularity: number;
    type: string;
    uri: string;

    constructor(response: ArtistResponse) {
        this.externalUrl = response.external_urls.spotify;
        this.followers = response.followers.total;
        this.genres = response.genres;
        this.id = response.id;
        this.imageUrl = response.images.sort((a, b) => (b.height ?? 0) - (a.height ?? 0))[0].url;
        this.name = response.name;
        this.popularity = response.popularity;
        this.type = response.type;
        this.uri = response.uri;
    }
}