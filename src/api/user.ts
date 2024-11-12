import SampleGetRequest from "@/api/sample.ts";
import User from "@/types/User.ts";

export default async function GetUser(token: string): Promise<User> {
    const response = await SampleGetRequest(token, 'https://api.spotify.com/v1/me');
    return new User(response);
}