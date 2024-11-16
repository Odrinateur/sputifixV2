import {MainContainerWithNav} from "@/components/ui/main-container.tsx";
import UserCard from "@/components/user-card.tsx";
import TopItems from "@/components/top-items.tsx";


export default function Home() {
    return (
        <MainContainerWithNav>
            <UserCard/>
            <TopItems type={"artists"}/>
            <TopItems type={"tracks"}/>
        </MainContainerWithNav>
    );
}