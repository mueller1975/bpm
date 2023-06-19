import UndoIcon from '@mui/icons-material/Undo';
import { Box, Button, Fade, Typography, Zoom } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Loading } from 'Components';
import React from 'react';

export default React.memo(styled(props => {
    const { loading, message, progress, children, error, loadingEffect, onClear, className, ...others } = props;

    return (
        <Box {...others} className={`${className} loadable-view`}>
            <Fade in={loading || Boolean(error)}>
                <div className="mask">
                    <Zoom in={loading}>
                        <div className="loading">
                            <Loading effect={loadingEffect} message={message} progress={progress} />
                        </div>
                    </Zoom>

                    <Zoom in={Boolean(error)}>
                        <div className="error">
                            {onClear &&
                                <Button variant="contained" color="warning" startIcon={<UndoIcon />} onClick={onClear}>清除訊息</Button>
                            }
                            <Typography color="error" variant="h6" align="center">{error}</Typography>
                        </div>
                    </Zoom>
                </div>
            </Fade>

            <div className="view">
                {children}
            </div>
        </Box>
    )
})`
    position: relative;
    height: 100%;
    overflow: hidden;    
    box-sizing: border-box;
    border: ${props => props.error ? '2px dashed red' : '0'};

    .mask {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        height: 100%;
        z-index: 99;
        background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(122 122 122 / 80%)' : 'rgba(11, 21, 33, 0.8)'};
        border-radius: 4px;
        overflow: auto;

        .error {
            position: absolute;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 16px;
            box-sizing: border-box;
            gap: 8px;
        }
    }
    
    .loading {
        
    }
    
    >.view {
        width: 100%;
        height: 100%;
        overflow: auto;
    }
`);