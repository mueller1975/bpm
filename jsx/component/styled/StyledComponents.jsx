import {
    BottomNavigation
} from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { fadeIn } from './Animations.jsx';

export const StyledBottomNavigation = styled(BottomNavigation)`
    height: auto;
    background: linear-gradient(30deg,rgb(18 33 78 / 95%),rgb(35 62 105 / 95%),rgb(18 33 78/ 95%));

    button.Mui-selected {
        color: #ff327b;
    }
`;

export const BLUE1 = '#41526d';
export const BLUE2 = '#4b5b73';
export const BLUE3 = '#556275';

export const StyledOverlapContainer = styled(props => {
    const { className, children, value } = props;

    return (
        <div className={className}>
            {
                children && children.map(child => (
                    <div key={child.props.value} className="content" hidden={value !== child.props.value}>
                        {child}
                    </div>
                ))
            }
        </div>
    );
})`
    .content {
        animation: ${fadeIn} 1000ms cubic-bezier(0.4, 0, 0.2, 1);
    }
`;