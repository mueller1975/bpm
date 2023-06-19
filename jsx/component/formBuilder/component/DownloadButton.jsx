import GetAppIcon from '@mui/icons-material/GetApp';
import { IconButton } from '@mui/material';
import { MaskModal } from 'Components';
import { useNotification } from 'Hook/useTools.jsx';
import React from 'react';

export default React.memo(React.forwardRef((props, ref) => {
    const { date, id, filename, disabled = false } = props;
    const { showError } = useNotification();

    const download = () => console.log('Downloading...');

    return (
        <>
            <MaskModal open={pending} />
            <IconButton ref={ref} onClick={download} color="warning" disabled={disabled}>
                <GetAppIcon />
            </IconButton>
        </>
    );
}));