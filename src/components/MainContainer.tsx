import React from 'react';
import NavBar from "@/components/NavBar.tsx";

interface MainContainerProps {
    children: React.ReactNode;
    withNav?: boolean;
    className?: string;
}

function MainContainer({children, withNav, className}: MainContainerProps) {
    return (
        <main
            className={`${className} flex p-10 w-full h-full ${withNav ? 'flex-row justify-start items-start overflow-y-auto' : 'flex-col justify-start items-center'}`}>
            {children}
        </main>
    );
}

function MainContainerWithNav({children, className}: MainContainerProps) {
    return (
        <MainContainer className={className + " gap-5"} withNav>
            <div className={"w-4/5 h-full overflow-y-auto"}>
                {children}
            </div>
            <NavBar/>
        </MainContainer>
    );
}

export {MainContainer, MainContainerWithNav};