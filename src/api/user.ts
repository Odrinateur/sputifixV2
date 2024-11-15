import {sampleGetRequest, sampleGetRequestWithPagination} from "@/api/sample.ts";
import {ArtistResponse, TopArtistResponse, TopArtists} from "@/types/Artist";
import User, {UserResponse} from "@/types/User.ts";

export async function GetUser(token: string): Promise<User | undefined> {
    const response = await sampleGetRequest<UserResponse>(token, 'https://api.spotify.com/v1/me');
    return response ? new User(response) : undefined;
}

export async function GetUserTopItems(token: string, type: string): Promise<TopArtists | undefined> {
    const response = await sampleGetRequestWithPagination<TopArtistResponse, ArtistResponse>(token, `https://api.spotify.com/v1/me/top/${type}`);
    return response ? new TopArtists(response) : undefined;
}