// import React from 'react';
// import { useTheme } from '@/context/ThemeContext';
// import { ThemeType } from '@/types/common';
import { MainContainerWithNav } from '@/components/ui/main-container';
import { H1 } from '@/components/ui/typography';
import { Card, CardContent } from '@/components/ui/card';

export function Settings() {
    // const { theme, setTheme } = useTheme();

    // const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     setTheme(event.target.value as ThemeType);
    // };

    return (
        <MainContainerWithNav>
            <H1>Settings</H1>
            <Card>
                <CardContent></CardContent>
            </Card>
        </MainContainerWithNav>
    );
}
