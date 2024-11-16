import {MainContainerWithNav} from "@/components/ui/main-container.tsx";
import UserCard from "@/components/user-card.tsx";


export default function Home() {
    return (
        <MainContainerWithNav>
            <UserCard/>
        </MainContainerWithNav>
    );
}