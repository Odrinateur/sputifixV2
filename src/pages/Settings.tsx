import React from 'react';
import {useTheme} from '@/context/ThemeContext';

export default function Settings() {
    const {theme, setTheme} = useTheme();

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTheme(event.target.value);
    };

    return (
        <div>
            <h1>Settings</h1>
            <label htmlFor="theme-select">Choose a theme:</label>
            <select id="theme-select" value={theme} onChange={handleThemeChange}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="dark green">Dark green</option>
            </select>
        </div>
    );
}