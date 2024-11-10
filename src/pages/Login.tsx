import { Button } from "@/components/ui/button"
import {Link} from "react-router-dom";
import {MainContainer} from "@/components/MainContainer.tsx";
import {H1} from "@/components/ui/typography.tsx";

export default function Login() {
    const clientId = import.meta.env.VITE_CLIENT_ID
    const callbackUrl = import.meta.env.VITE_CALLBACK_URL
    const url = `https://accounts.spotify.com/fr/authorize?response_type=code&client_id=${clientId}&scope=ugc-image-upload%20user-read-playback-state%20user-modify-playback-state%20user-read-currently-playing%20user-read-email%20user-read-private%20playlist-read-collaborative%20playlist-modify-public%20playlist-read-private%20playlist-modify-private%20user-library-modify%20user-library-read%20user-top-read%20user-read-playback-position%20user-read-recently-played%20user-follow-read%20user-follow-modify&redirect_uri=${callbackUrl}`

    return (
        <MainContainer className={"gap-10"} justifyCenter>
            <H1>Login</H1>
            <Button asChild>
                <Link to={url}>Login with Spotify</Link>
            </Button>
        </MainContainer>
    );
}