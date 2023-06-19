import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
    Avatar, Checkbox, Divider, IconButton, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, ListSubheader, Tooltip, Typography
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { animated, config, useSpring } from '@react-spring/web';
import React, { useEffect, useState } from 'react';
import { stringToColor } from 'Tools';

const AnimatedList = animated(List);
const AnimatedIconButton = animated(IconButton);
const AnimatedAvatar = animated(Avatar);
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
        from: { width: 104, zIndex: 0 },
        to: { width: 235, zIndex: 1, },
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
            {/* 選取全部區塊 */}
            <ListSubheader >
                <ListItem disablePadding component="div" className="subheaderTitle">
                    {/* 圖示 */}
                    <ListItemIcon className="iconWrapper">
                        <AnimatedIconButton size="small" disabled={underSM} onClick={toggleCollapsed} style={hideProps}>
                            <ArrowBackIosIcon fontSize="small" />
                        </AnimatedIconButton>

                        <AnimatedIconButton size="small" disabled={underSM} onClick={toggleCollapsed} className="overlapped" style={showProps}>
                            <ArrowForwardIosIcon fontSize="small" />
                        </AnimatedIconButton>
                    </ListItemIcon>

                    {/* 文字 */}
                    <AnimatedListItemText primary="MPB 訊息區塊" primaryTypographyProps={{ color: "primary" }} style={hideProps} />
                </ListItem>
            </ListSubheader>

            {/* <Divider /> */}

            {/* 各 form 區塊 */
                forms.map(({ id, title, icon: ItemIcon }) => {
                    let formColor = stringToColor(id); // 個別 form 圖示顏色
                    const AnimatedItemIcon = animated(ItemIcon);

                    return (
                        <React.Fragment key={id}>
                            <ListItem disablePadding component="div">

                                <Tooltip arrow disableHoverListener={!collapsed && !underSM} placement="right"
                                    title={<Typography variant="subtitle2">{title}</Typography>}>

                                    <ListItemButton onClick={() => onItemClick && onItemClick(id)}>
                                        <ListItemIcon>
                                            <div className="iconWrapper">
                                                {/* form icon */}
                                                <AnimatedItemIcon sx={{ color: formColor }} style={hideProps} />

                                                {/* form 名稱第一個字 */}
                                                <AnimatedAvatar className="itemAvatar overlapped" sx={{ bgcolor: `${formColor}40` }} style={showProps}>
                                                    <Typography color="textPrimary">{title.substring(0, 1)}</Typography>
                                                </AnimatedAvatar>
                                            </div>
                                        </ListItemIcon>

                                        {/* form 名稱 */}
                                        <AnimatedListItemText primary={title} style={hideProps} />
                                    </ListItemButton>
                                </Tooltip>
                            </ListItem>

                            <Divider />
                        </React.Fragment>
                    );
                })
            }
        </AnimatedList>
    );
})`
    height: 100%;
    padding: 0;

    border-radius: 4px;
    background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(255 255 255 / 60%)' : 'rgb(11 20 37 / 63%)'};
    box-shadow: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '8px 8px 8px 0px #72777f' : '#121212 8px 8px 8px 0px'};
    // box-shadow: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '6px 6px 3px 0px rgb(112 112 123 / 51%)' : '6px 6px 3px 0px rgb(21 21 23 / 51%)'};

    .MuiListSubheader-root {
        padding: 4px 0 4px 16px;
        z-index: 2;
        border-radius: 4px 4px 0 0;
        background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '#f6f6f6' : '#10162a'};
        box-shadow: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '1px 1px #b0b0b0' : '1px 1px #5e5e5e'};
    }

    .subheaderTitle {
        padding-right: 48px;
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

    .itemAvatar {
        width: 36px;
        height: 36px;
        // background-color: rgb(54 89 116 / 52%);
    }
`);