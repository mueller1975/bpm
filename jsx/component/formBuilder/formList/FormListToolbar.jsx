import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
    IconButton, ListItemText, Toolbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { animated } from '@react-spring/web';
import React from 'react';
import { useRecoilState } from 'recoil';
import { formListCollapsedSelector } from '../context/BuilderStates';

const AnimatedIconButton = animated(IconButton);
const AnimatedListItemText = animated(ListItemText);

export default React.memo(styled(props => {
    const { disabled, showProps, hideProps, className } = props;
    const [collapsed, setCollapsed] = useRecoilState(formListCollapsedSelector);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Toolbar disableGutters variant="dense" className={`MT-FormListToolbar ${className}`}>
            <AnimatedIconButton disabled={disabled} onClick={toggleCollapsed} style={hideProps}>
                <ArrowBackIosIcon />
            </AnimatedIconButton>

            <AnimatedIconButton disabled={disabled} onClick={toggleCollapsed} className="overlapped" style={showProps}>
                <ArrowForwardIosIcon />
            </AnimatedIconButton>

            {/* 文字 */}
            <AnimatedListItemText primary="表單分區" primaryTypographyProps={{ color: "textSecondary" }} style={hideProps} />
        </Toolbar>
    );
})`
    &.MT-FormListToolbar {
        background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '#f6f6f6' : '#10162a'};
        padding-left: 8px;

        >.overlapped {
            position: absolute;
        }

        .MuiListItemText-primary {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
`);