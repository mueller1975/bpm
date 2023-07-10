import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Button, DialogContent, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DraggableDialog, IconnedDialogTitle, LoadableView, Loading } from 'Components';
import { useAsyncDownload } from 'Hook/useTools.jsx';
import React, { useCallback, useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

const FILE_OPENING = <Loading message="文件開啟中..." />;

const fetchDownloadDocument = ({ date, id, filename }) => fetch(`/${date}/${id}`, {
    method: 'POST',
    redirect: 'manual',
    body: `filename=${filename}`,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        [CSRF_HEADER]: CSRF_TOKEN
    }
});

export default React.memo(styled(({ path, file, ...others }) => {
    const [url, setUrl] = useState();
    const [pageCount, setPageCount] = useState(0);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageScale, setPageScale] = useState(1.5);
    const [error, setError] = useState();

    const downloadFunc = useCallback(() => fetchDownloadDocument({ path, file }), [path, file]);
    const { execute, pending: downloading, value: fileBlob, error: downloadError } = useAsyncDownload(downloadFunc, 0, false);

    useEffect(() => {
        downloadError && setError(downloadError.message);

        if (fileBlob) {
            setUrl(window.URL.createObjectURL(fileBlob));
        }
    }, [fileBlob, downloadError]);

    const documentLoaded = count => setPageCount(count);

    const clearStates = () => {
        setPageCount(0);
        setPageIndex(0);
        setPageScale(1.5);
        setError();
        setUrl();
    }

    return (
        <DraggableDialog {...others} TransitionProps={{ onEntered: execute, onExited: clearStates }}>
            <IconnedDialogTitle icon={VisibilityOutlinedIcon} title={file}>
                <Button variant="contained" startIcon={<VisibilityOutlinedIcon />} onClick={others.onClose}>關閉</Button>
            </IconnedDialogTitle>

            <DialogContent>
                <LoadableView loading={downloading} message="下載中..." error={error} className="documentView">
                    <Fade in={url != undefined}>
                        <div>
                            <Document file={url} loading={FILE_OPENING} onLoadSuccess={documentLoaded}>
                                <Page pageIndex={pageIndex} scale={pageScale} />
                            </Document>
                        </div>
                    </Fade>
                </LoadableView>
            </DialogContent>
        </DraggableDialog>
    );
})`

    .documentView {
        min-width: 600px;
        min-height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

`);