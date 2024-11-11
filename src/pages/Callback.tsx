import {useAuth} from "@/context/AuthContext.tsx";
import {useEffect} from "react";
import {MainContainer} from "@/components/MainContainer.tsx";
import {LoadingSpinner} from "@/components/ui/spinner.tsx";

export default function Callback() {
    const {setCode} = useAuth();
    const code = new URLSearchParams(window.location.search).get('code');

    useEffect(() => {
        const setCodeAsync = async (code: string) => {
            console.log(code);
            await setCode(code);
            window.location.href = '/';
        };
        if (code) {
            setCodeAsync(code as string).then();
        }
    }, [code, setCode]);

    if (!code) {
        window.location.href = '/';
    }

    return <MainContainer justifyCenter>
        <LoadingSpinner size={100}/>
    </MainContainer>
}