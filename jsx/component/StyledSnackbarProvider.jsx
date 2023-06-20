import ClearIcon from '@mui/icons-material/Clear';
import FeedbackIcon from '@mui/icons-material/Feedback';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import SmileIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SadIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import React, { useCallback, useMemo, useRef } from 'react';

const anchorOrigin = { vertical: 'bottom', horizontal: 'right' };

const iconVariant = {
    success: <SmileIcon className="icon" />,
    error: <SadIcon className="icon" />,
    warning: <NewReleasesIcon className="icon" />,
    info: <FeedbackIcon className="icon" />
};

export default React.memo(styled(props => {
    const { className, children, ...otherProps } = props;
    const notistackRef = useRef()

    const classes = useMemo(() => ({
        variantSuccess: 'successSnack',
        variantError: 'errorSnack',
        variantWarning: 'warningSnack',
        variantInfo: 'infoSnack',
        containerRoot: `${className} container`,
        message: 'message'
    }), [className]);

    const action = useCallback(key =>
        <IconButton color="inherit" onClick={() => notistackRef.current.closeSnackbar(key)}><ClearIcon /></IconButton>
        , [notistackRef]);

    return (
        <SnackbarProvider ref={notistackRef} maxSnack={8} autoHideDuration={3000}
            anchorOrigin={anchorOrigin} iconVariant={iconVariant} action={action} classes={classes} {...otherProps}>
            {children}
        </SnackbarProvider >
    )
})`
    &.container {        
        ${({ theme }) => theme.breakpoints.up('sm')} {
            max-width: 80%;
        }

        &.SnackbarContent-root {
            flex-wrap: nowrap;
        }
    }

    .message {
        flex-grow: 1;
    }
    
    .icon {
        margin-right: 8px;
    }

    .successSnack {
        padding: 0 16px;
        background: linear-gradient(30deg,rgb(5 45 5 / 90%),rgb(9 144 13 / 70%),rgb(64 214 89 / 80%));
    }

    .errorSnack {
        padding: 0 16px;
        background: linear-gradient(30deg,rgb(45, 5, 10, .9),rgba(245, 0, 0, 0.7),rgba(255, 118, 118, 0.8));
    }

    .warningSnack {
        padding: 0 16px;
        background: linear-gradient(30deg,rgb(144 55 1 / 90%),rgb(241 103 25 / 70%),rgb(189 141 75 / 80%));
    }

    .infoSnack {
        padding: 0 16px;
        background: linear-gradient(30deg,rgb(2 4 60 / 90%),rgb(36 76 146 / 70%),rgb(75 113 189 / 80%));
    }
`);