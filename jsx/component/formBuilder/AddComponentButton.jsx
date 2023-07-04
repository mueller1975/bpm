import AddIcon from "@mui/icons-material/Add";
import { IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { jiggle } from "../styled/Animations.jsx";

export default styled(({ className, onClick }) => (
    <div className={`MT-AddComponentButton ${className}`}>
        <IconButton onClick={onClick}><AddIcon /></IconButton>
    </div>
))`
    &.MT-AddComponentButton {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px dashed;
        border-radius: 4px;
        padding: 4px;
        box-sizing: border-box;
        opacity: .2;
        transition: all .5s;

        :hover {
            opacity: 1;

            >button {
                animation: ${jiggle} .15s 3;
            }
        }
    }
`;