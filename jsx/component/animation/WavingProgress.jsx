/**
 * Wave 效果進度
 */
import { keyframes, styled } from '@mui/material/styles';
import React from 'react';

const wave = keyframes`
    0% {
        transform: scale(0);
    }
    50% {
        transform: scale(1);
    }
    100% {
        transform: scale(0);
    }
`;

export default styled(props => {
    return (
        <div className={props.className}>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
        </div>
    );
})`
    display: flex;
    height: 50px;

    .wave {
        width: 4px;
        height: 100%;
        background: linear-gradient(45deg, cyan, #fff);
        margin: 5px;
        animation: ${wave} 1s linear infinite;
        border-radius: 20px;
        transform: scale(0);
    }

    .wave:nth-of-type(2) {
        animation-delay: 0.1s;
    }
    .wave:nth-of-type(3) {
        animation-delay: 0.2s;
    }
    .wave:nth-of-type(4) {
        animation-delay: 0.3s;
    }
    .wave:nth-of-type(5) {
        animation-delay: 0.4s;
    }
    .wave:nth-of-type(6) {
        animation-delay: 0.5s;
    }
    .wave:nth-of-type(7) {
        animation-delay: 0.6s;
    }
    .wave:nth-of-type(8) {
        animation-delay: 0.7s;
    }
    .wave:nth-of-type(9) {
        animation-delay: 0.8s;
    }
    .wave:nth-of-type(10) {
        animation-delay: 0.9s;
    }
`;