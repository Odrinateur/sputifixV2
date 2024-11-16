import React from 'react';
import Navbar from "@/components/navbar.tsx";

interface MainContainerProps {
    children: React.ReactNode;
    withNav?: boolean;
    className?: string;
}

function MainContainer({children, withNav, className}: MainContainerProps) {
    return (
        <main
            className={`${className} flex p-10 w-full ${withNav ? 'flex-col-reverse lg:flex-row justify-start items-start overflow-y-auto' : 'h-full flex-col justify-start items-center'}`}>
            {children}
        </main>
    );
}

function MainContainerWithNav({children, className}: MainContainerProps) {
    return (
        <MainContainer className={className + " gap-5"} withNav>
            <div className={"w-full lg:w-4/5 h-full overflow-y-auto"}>
                {children}
            </div>
            <Navbar/>
        </MainContainer>
    );
}

export {MainContainer, MainContainerWithNav};