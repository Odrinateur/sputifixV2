import React from 'react';

interface HeadingProps {
    children: React.ReactNode;
    className?: string;
}

const defaultClasses = {
    h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
    h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
    h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
    p: 'leading-7 [&:not(:first-child)]:mt-6',
};

export function H1({ children, className = '' }: HeadingProps) {
    return <h1 className={`${defaultClasses.h1} ${className}`}>{children}</h1>;
}

export function H2({ children, className = '' }: HeadingProps) {
    return <h2 className={`${defaultClasses.h2} ${className}`}>{children}</h2>;
}

export function H3({ children, className = '' }: HeadingProps) {
    return <h3 className={`${defaultClasses.h3} ${className}`}>{children}</h3>;
}

export function H4({ children, className = '' }: HeadingProps) {
    return <h4 className={`${defaultClasses.h4} ${className}`}>{children}</h4>;
}

export function P({ children, className = '' }: HeadingProps) {
    return <p className={`${defaultClasses.p} ${className}`}>{children}</p>;
}
