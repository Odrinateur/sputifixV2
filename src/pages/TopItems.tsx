import {MainContainerWithNav} from "@/components/ui/main-container.tsx";
import TopItems from "@/components/top-items.tsx";
import {TopItemsType} from "@/types/common.ts";


export default function Top({type}: { type: TopItemsType }) {
    return (
        <MainContainerWithNav>
            <TopItems type={type} isHome={false}/>
        </MainContainerWithNav>
    );
}