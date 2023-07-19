import { GlobalStyles } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import App from 'Component/app/App.jsx';
import MPBForm from 'Component/app/MPBForm.jsx';
import { StyledSnackbarProvider } from 'Components';
import { PreferencesContextProvider } from 'Context/PreferencesContext.jsx';
import { ServiceContextProvider } from 'Context/ServiceContext.jsx';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { createAppTheme, DARK, NORMAL } from 'Themes';
import globalStyles from './lib/globalStyles';
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
                            <App />
                        </StyledSnackbarProvider>
                    </PreferencesContextProvider>
                </ConfirmDialogContextProvider>
            </ServiceContextProvider>
        </RecoilRoot>
    </ThemeProvider>
));

const root = createRoot(document.querySelector('#root'));
root.render(<Page />);