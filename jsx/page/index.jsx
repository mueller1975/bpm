import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createAppTheme, DARK, NORMAL } from 'Themes';
import ExcelFormImporter from '../component/formBuilder/ExcelFormImporter.jsx';

const theme = createAppTheme(DARK, NORMAL, NORMAL);

const Index = props => {

    return (
        <ThemeProvider theme={theme}>
            <ExcelFormImporter />
        </ThemeProvider>
    );
};

const root = createRoot(document.querySelector('#root'));
root.render(<Index />);