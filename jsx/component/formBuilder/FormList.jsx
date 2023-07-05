import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
    AppBar, IconButton, List, ListItemText, Toolbar
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { animated, config, useSpring } from '@react-spring/web';
import React, { useEffect, useState } from 'react';
import FormListItem from './FormListItem.jsx';

const AnimatedList = animated(List);
const AnimatedIconButton = animated(IconButton);
const AnimatedListItemText = animated(ListItemText);
const springConfig = { friction: 8, tension: 120 };

export default React.memo(styled(({ forms, onItemClick, onLoadData, ...others }) => {
    const [collapsed, setCollapsed] = useState(true);
    const [firstExpanded, setFirstExpanded] = useState(false);

    const theme = useTheme();
    const underMD = useMediaQuery(theme.breakpoints.down('md'));
    const underSM = useMediaQuery(theme.breakpoints.down('sm'));

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const collapseProps = useSpring({
        // delay: !firstExpanded ? 3000 : 0,
        immediate: !firstExpanded,
        from: { width: 68, zIndex: 0 },
        to: { width: 180, zIndex: 1, },
        reverse: collapsed,
        config: springConfig
        // onStart: () => !firstExpanded && setFirstExpanded(true)
    });

    const hideProps = useSpring({
        // delay: !firstExpanded ? 1000 : 0,
        immediate: !firstExpanded,
        from: { opacity: 0 },
        to: { opacity: 1 },
        reverse: collapsed,
        config: config.wobbly
    });

    const showProps = useSpring({
        // delay: !firstExpanded ? 1000 : 0,
        immediate: !firstExpanded,
        from: { opacity: 1, },
        to: { opacity: 0 },
        reverse: collapsed,
        config: config.wobbly
    });

    useEffect(() => {
        setTimeout(() => {
            setFirstExpanded(true);
            setCollapsed(false);
        }, 1000);
    }, []);

    return (
        <AnimatedList dense={underMD} {...others} style={collapseProps}>
            <AppBar position="relative" className="header">
                <Toolbar disableGutters variant="dense" className="toolbar">
                    <AnimatedIconButton disabled={underSM} onClick={toggleCollapsed} style={hideProps}>
                        <ArrowBackIosIcon />
                    </AnimatedIconButton>

                    <AnimatedIconButton disabled={underSM} onClick={toggleCollapsed} className="overlapped" style={showProps}>
                        <ArrowForwardIosIcon />
                    </AnimatedIconButton>

                    {/* 文字 */}
                    <AnimatedListItemText primary="表單分區" primaryTypographyProps={{ color: "textSecondary" }} style={hideProps} />
                </Toolbar>
            </AppBar>

            {/* 各 form 區塊 */
                forms.map(form =>
                    <FormListItem key={form.uuid} form={form} tooltipDisabled={!collapsed && !underSM}
                        showProps={showProps} hideProps={hideProps} onClick={onItemClick} />
                )
            }
        </AnimatedList>
    );
})`
    height: 100%;
    padding: 0;

    border-radius: 4px;
    background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(255 255 255 / 60%)' : 'rgb(11 20 37 / 63%)'};
    box-shadow: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '8px 8px 8px 0px #72777f' : '#121212 8px 8px 8px 0px'};

    .MuiListSubheader-root {
        padding: 4px 0 4px 16px;
        z-index: 2;
        border-radius: 4px 4px 0 0;
        background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '#f6f6f6' : '#10162a'};
    }

    .subheaderTitle {
        padding-right: 48px;
    }

    .toolbar {
        background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '#f6f6f6' : '#10162a'};
        padding-left: 8px;

        >.overlapped {
            position: absolute;
        }
    }

    .iconWrapper {
        position: relative;
        align-items: center;

        .overlapped {
            position: absolute;
        }
    }

    .MuiListItemIcon-root {
        min-width: 40px;
    }

    .MuiListItemButton-root {
        transition: background-color .3s;
    }

    .MuiListItemText-primary {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        // max-width: 120px;
    }

    .addItemButton {
        padding: 8px;
    }
`);