import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { createAppTheme, DARK, NORMAL } from 'Themes';
import FormBuilder from 'Component/formBuilder/FormBuilder.jsx';
import { ServiceContextProvider } from 'Context/ServiceContext.jsx';
import { PreferencesContextProvider } from 'Context/PreferencesContext.jsx';
import { StyledSnackbarProvider } from 'Components';
import globalStyles from './lib/globalStyles';
import { GlobalStyles } from '@mui/material';
import { ConfirmDialogContextProvider } from 'Context/ConfirmDialogContext.jsx';

const theme = createAppTheme(DARK, NORMAL, NORMAL);
const gStyles = globalStyles(theme.palette.mode); // global theme styles

const Page = React.memo(props => (
    <ThemeProvider theme={theme}>
        {/* Global CSS */}
        <GlobalStyles styles={gStyles} />

        <RecoilRoot>
            <ServiceContextProvider>
                <ConfirmDialogContextProvider>
                    <PreferencesContextProvider>
                        <StyledSnackbarProvider>
                            <FormBuilder />
                        </StyledSnackbarProvider>
                    </PreferencesContextProvider>
                </ConfirmDialogContextProvider>
            </ServiceContextProvider>
        </RecoilRoot>
    </ThemeProvider>
));

const root = createRoot(document.querySelector('#root'));
root.render(<Page />);