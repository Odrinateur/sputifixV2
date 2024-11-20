import React from 'react';
import { Navbar } from '@/components/navbar.tsx';

interface MainContainerProps {
    children: React.ReactNode;
    withNav?: boolean;
    className?: string;
}

function MainContainer({ children, withNav, className }: MainContainerProps) {
    return (
        <main
            className={`${className} flex p-10 w-full h-full ${
                withNav
                    ? 'flex-col-reverse lg:flex-row justify-start items-start'
                    : 'flex-col justify-start items-center'
            }`}
        >
            {children}
        </main>
    );
}

function MainContainerWithNav({ children }: MainContainerProps) {
    return (
        <MainContainer className={'gap-10'} withNav>
            <div className={'flex flex-col gap-10 w-full lg:w-4/5 h-full overflow-y-auto'}>{children}</div>
            <Navbar />
        </MainContainer>
    );
}

export { MainContainer, MainContainerWithNav };
