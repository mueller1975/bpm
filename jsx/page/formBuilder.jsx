import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createAppTheme, DARK, NORMAL } from 'Themes';
import FormBuilder from '../component/formBuilder/FormBuilder.jsx';
import { FormContextProvider } from 'Component/formBuilder/context/FormContext.jsx';

const theme = createAppTheme(DARK, NORMAL, NORMAL);

const Index = props => {

    return (
        <ThemeProvider theme={theme}>
            <FormContextProvider>
                <FormBuilder />
            </FormContextProvider>
        </ThemeProvider>
    );
};

const root = createRoot(document.querySelector('#root'));
root.render(<Index />);