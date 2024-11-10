import React from 'react';

interface MainContainerProps {
    children: React.ReactNode;
    justifyCenter?: boolean;
    className?: string;
}

function MainContainer({ children, justifyCenter, className }: MainContainerProps) {
    return (
        <main className={`flex flex-col p-2 items-center ${justifyCenter ? 'justify-center' : 'justify-start'} h-full ${className}`}>
            {children}
        </main>
    );
}

function MainContainerWithNav({ children, justifyCenter, className }: MainContainerProps) {
    return (
        <MainContainer className={className} justifyCenter={justifyCenter}>
            <nav></nav>
            {children}
        </MainContainer>
    );
}

export { MainContainer, MainContainerWithNav };