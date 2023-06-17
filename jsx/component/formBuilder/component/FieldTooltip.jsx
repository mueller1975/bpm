import { Grow, Tooltip, Typography } from '@mui/material';
import React, { useMemo } from 'react';

export default React.memo(({ title, children }) => {

    const tips = title && useMemo(() => {
        let tips = !Array.isArray(title) ? [title] : title;
        return tips.map((tip, idx) => <Typography key={idx} variant="subtitle2" align="center">{tip}</Typography>);
    }, []);

    return (
        !title ? children : (
            <Tooltip title={tips} arrow
                TransitionComponent={Grow} TransitionProps={{ timeout: 600 }}
                PopperProps={{ disablePortal: true }} // *** 必須指定 disablePortal 為 true, 否則當欄位為下拉選單(dropdown or autocomplete)時, 選單會被 tooltip 遮住!!!
            >
                {children}
            </Tooltip>
        )
    );
});