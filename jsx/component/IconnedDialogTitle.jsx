/**
 * Iconned Dialog Title Component
 */
import React from 'react'
import { DialogTitle, Box, Typography } from '@mui/material'
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useScaleSpring } from 'Hook/useAnimations.jsx';
import { animated } from '@react-spring/web';

const IconnedDialogTitle = React.memo(styled(React.forwardRef((props, ref) => {
    const { className, icon: IconComponent, title, actions, children, springRef, ...others } = props;

    // 微動畫效果
    const animProps = useScaleSpring({
        ref: springRef,
        config: { tension: 150, friction: 8 }
    });

    return (
        <DialogTitle {...others} ref={ref} component="div" className={className}>
            <IconComponent className="icon" />
            <animated.div style={animProps}>
                {
                    React.isValidElement ? title : <Typography variant="h6">{title}</Typography>
                }
            </animated.div>
            <Box flexGrow={1} />
            <div className="actions">
                {children}
            </div>
        </DialogTitle>
    );
}))`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px 8px;

    .icon {
        filter: drop-shadow(${({ theme: { palette: { mode } } }) => mode == 'light' ? '6px 6px 2px #72777f' : 'rgb(1 3 10) 6px 6px 2px'});
    }

    .MuiButtonBase-root, .MuiButtonGroup-root {
        box-shadow: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '4px 4px 4px 0px #72777f' : '#161616 4px 4px 4px 0px'};

        :hover {
            box-shadow: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '4px 4px 4px 0px #72777f' : '#161616 4px 4px 4px 0px'} !important;
        }
    }

    .actions {
        display: flex;
        gap: inherit;
        overflow: auto hidden;
        padding: 0 6px 6px 0;
    }
`);

IconnedDialogTitle.propTypes = {
    icon: PropTypes.object.isRequired,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
}

export default animated(IconnedDialogTitle);