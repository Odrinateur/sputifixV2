export interface UserResponse {
    country: string;
    display_name: string;
    email: string;
    external_urls: {
        spotify: string;
    }
    followers: {
        total: number;
    }
    id: string;
    images: {
        url: string;
        height: number | null;
        width: number | null;
    }[];
    product: string;
    uri: string;
}

export default class User {
    country: string;
    display_name: string;
    email: string;
    url: string;
    followers: number;
    id: string;
    imageUrl: string;
    product: string;
    lastUpdated: number = Date.now();

    constructor(response: UserResponse) {
        this.country = response.country;
        this.display_name = response.display_name;
        this.email = response.email;
        this.url = response.external_urls.spotify;
        this.followers = response.followers.total;
        this.id = response.id;
        this.imageUrl = response.images.sort((a, b) => (b.height ?? 0) - (a.height ?? 0))[0].url;
        this.product = response.product;
    }
}