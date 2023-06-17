import React, { useState, useEffect, useRef, useMemo } from 'react';
import { IconButton, Tooltip, Typography } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FilePreviewer from './FilePreviewer.jsx';

export default props => {
    const { row: { category, document } } = props;
    const [viewerOpen, setViewerOpen] = useState(false);

    const disabled = !category || !document;
    const openPreviewer = () => setViewerOpen(true);
    const closePreviewer = () => setViewerOpen(false);

    return (
        <>
            <FilePreviewer path={category} file={document} open={viewerOpen} onClose={closePreviewer} maxWidth="xl" />

            <IconButton onClick={openPreviewer} disabled={disabled}>
                <Tooltip arrow title={<Typography align="center">檢視 "華新格式" 文件「{document}」</Typography>}>
                    <VisibilityOutlinedIcon color={disabled ? 'disabled' : 'warning'} />
                </Tooltip>
            </IconButton>
        </>
    );
};