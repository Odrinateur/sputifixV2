import {MainContainerWithNav} from "@/components/MainContainer.tsx";
import UserCard from "@/components/UserCard.tsx";


export default function Home() {
    return (
        <MainContainerWithNav>
            <UserCard/>
        </MainContainerWithNav>
    );
}