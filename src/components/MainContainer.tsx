import React from 'react';

interface MainContainerProps {
    children: React.ReactNode;
    isJustifyCenter?: boolean;
    className?: string;
}

function MainContainer({ children, isJustifyCenter, className }: MainContainerProps) {
    return (
        <main className={`flex flex-col p-2 items-center ${isJustifyCenter ? 'justify-center' : 'justify-start'} h-full ${className}`}>
            {children}
        </main>
    );
}

function MainContainerWithNav({ children, isJustifyCenter, className }: MainContainerProps) {
    return (
        <MainContainer className={className} isJustifyCenter={isJustifyCenter}>
            <nav></nav>
            {children}
        </MainContainer>
    );
}

export { MainContainer, MainContainerWithNav };