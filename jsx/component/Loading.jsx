/**
 * 載入中
 */
import { Box, CircularProgress, LinearProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useMemo } from 'react';

const LOADING_MESSAGE = "載入中, 請稍候...";

const LinearProgressWithLabel = props => {
    const { value } = props;

    return (
        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', flexDirection: 'column' }}>
            <Typography>{value} %</Typography>
            <LinearProgress variant="determinate" sx={{ width: '100%' }} value={value} />
        </Box>
    );
};

export default styled(props => {
    const { className,  message = LOADING_MESSAGE, effect = <CircularProgress />, progress } = props;

    const messageNode = useMemo(() => React.isValidElement(message) ? message : <Typography color="secondary" noWrap>{message}</Typography>, [message]);
    const animationNode = useMemo(() => typeof progress != 'undefined' ? <LinearProgressWithLabel value={progress} /> : effect, [progress, effect]);

    return (
        <div className={className}>
            <Box sx={{ mb: 2, width: '50%', display: 'flex', justifyContent: 'center' }}>
                {animationNode}
            </Box>
            {messageNode}
        </div >
    );
})`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
    box-sizing: border-box;
`;
