import { Dialog, Paper, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import Draggable from 'react-draggable';

/* mouse down event handler */
const mouseDownHandler = e => e.stopPropagation(); // 防止 swipeable-views 左右滑動

const PaperComponent = React.memo(styled(props => (
    <Draggable handle=".MuiDialogTitle-root" cancel={'[class*="MuiDialogContent-root"]'} onMouseDown={mouseDownHandler}>
        <Paper {...props} />
    </Draggable >
))`
    &>.MuiDialogTitle-root {
        cursor: move;
    }
`);

export default React.memo(props => {
    const { fullScreenUnderWidth, fullScreen, ...otherProps } = props;

    const theme = useTheme();
    const dlgFullScreen = fullScreen || (fullScreenUnderWidth && useMediaQuery(theme.breakpoints.down(fullScreenUnderWidth)));

    return <Dialog PaperComponent={PaperComponent} fullScreen={dlgFullScreen} {...otherProps} />;
});
