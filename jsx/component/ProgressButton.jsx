/**
 * Button showing progress status
 */
import { Button, CircularProgress } from '@mui/material';
import React from 'react';
import { styled } from '@mui/material/styles';

export default styled(props => {
    const { classes, text, icon: StartIcon, isProgressing, disabled, className, style, ...others } = props

    return (
        <div className={className} style={style}>
            <Button fullWidth disabled={disabled || isProgressing} {...others} className={`button ${classes?.button ?? ''}`}
                startIcon={StartIcon ? <StartIcon /> : undefined}>
                {text}
                {
                    isProgressing &&
                    <CircularProgress color="secondary" size={36} className="actionProgress" />
                }
            </Button>
        </div>
    )
})`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    .actionProgress {
        position: absolute;
        margin: auto;
        z-index: 1;
    }

    .button {
        display: flex;
        justify-content: center;
        align-items: center;
        // color: #fff;
    }
`;
