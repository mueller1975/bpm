import GetAppIcon from '@mui/icons-material/GetApp';
import { IconButton } from '@mui/material';
import { MaskModal } from 'Components';
import { useAsyncDownload, useNotification } from 'Hook/useTools.jsx';
import React, { useCallback, useEffect } from 'react';

const ATTACHMENT_DOWNLOAD_URL = '';

const fetchDownloadAttachment = ({ date, id, filename }) => fetch(`${ATTACHMENT_DOWNLOAD_URL}/${date}/${id}`, {
    method: 'POST',
    redirect: 'manual',
    body: `filename=${filename}`,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        [CSRF_HEADER]: CSRF_TOKEN
    }
});

export default React.memo(React.forwardRef((props, ref) => {
    const { date, id, filename, disabled = false } = props;
    const { showError } = useNotification();

    const downloadFunc = useCallback(() => fetchDownloadAttachment({ date, id, filename }), [date, id]);
    const { execute, pending, error } = useAsyncDownload(downloadFunc);

    useEffect(() => {
        error && showError(error.message)
    }, [error]);

    return (
        <>
            <MaskModal open={pending} />
            <IconButton ref={ref} onClick={() => execute()} color="warning" disabled={disabled}>
                <GetAppIcon />
            </IconButton>
        </>
    );
}));