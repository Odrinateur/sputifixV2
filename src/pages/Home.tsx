import {MainContainerWithNav} from "@/components/MainContainer.tsx";
import {H1} from "@/components/ui/typography.tsx";
import {useAuth} from "@/context/AuthContext.tsx";
import {useStorage} from "@/context/StorageContext.tsx";
import {useEffect, useState} from "react";
import User from "@/types/User.ts";

export default function Home() {
    const {getAccessToken} = useAuth();
    const {getUser} = useStorage();

    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchToken = async () => {
            setToken(await getAccessToken());
        }
        const fetchUser = async () => {
            if (user || !token) return;
            getUser(token).then(user => setUser(user));
        }

        fetchToken().then();
        fetchUser().then();
    }, [getAccessToken, getUser, token, user]);

    return (
        <MainContainerWithNav>
            <H1>Home</H1>
        </MainContainerWithNav>
    );
}