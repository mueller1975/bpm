import styled from 'styled-components';

export default styled("div")`
    position: absolute;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 4;
    transition: all 1s;
    right: 24px;
    bottom: 8px;
    //bottom: ${({ scrollTriggered }) => scrollTriggered ? '24px' : '90px'};
    opacity: ${({ hidden }) => hidden ? 0 : 1};

    .MuiFab-root {
        color: #fff;
    }
`;