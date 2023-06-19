import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { createAppTheme, DARK, NORMAL } from 'Themes';
import FormBuilder from '../component/formBuilder/FormBuilder.jsx';

const theme = createAppTheme(DARK, NORMAL, NORMAL);

const Page = props => {

    return (
        <ThemeProvider theme={theme}>
            <RecoilRoot>
                <FormBuilder />
            </RecoilRoot>
        </ThemeProvider>
    );
};

const root = createRoot(document.querySelector('#root'));
root.render(<Page />);