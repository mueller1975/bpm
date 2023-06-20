import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { createAppTheme, DARK, NORMAL } from 'Themes';
import FormBuilder from 'Component/formBuilder/FormBuilder.jsx';
import { ServiceContextProvider } from 'Context/ServiceContext.jsx';
import { PreferencesContextProvider } from 'Context/PreferencesContext.jsx';
import { StyledSnackbarProvider } from 'Components';

const theme = createAppTheme(DARK, NORMAL, NORMAL);

const Page = props => {

    return (
        <ThemeProvider theme={theme}>
            <RecoilRoot>
                <ServiceContextProvider>
                    <PreferencesContextProvider>
                        <StyledSnackbarProvider>
                            <FormBuilder />
                        </StyledSnackbarProvider>
                    </PreferencesContextProvider>
                </ServiceContextProvider>
            </RecoilRoot>
        </ThemeProvider>
    );
};

const root = createRoot(document.querySelector('#root'));
root.render(<Page />);