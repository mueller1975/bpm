import {
    AppBar, Toolbar, IconButton, Grid, Box, Checkbox, Divider,
    Accordion, AccordionDetails, AccordionSummary, Drawer, List, ListItem, ListItemIcon, ListItemSecondaryAction,
    ListItemText, ListSubheader, MenuItem, Popover, Slider, Switch, TextField, Typography, SwipeableDrawer
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useCallback, useState } from 'react';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import GpsNotFixedIcon from '@mui/icons-material/GpsNotFixed';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormProperties from './FormProperties.jsx';
import FieldProperties from './FieldProperties.jsx';

// Popover 位置
const anchorOrigin = { vertical: 'bottom', horizontal: 'right' },
    transformOrigin = { vertical: 'top', horizontal: 'right' };

export default React.memo(styled(props => {
    const { className } = props;
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerDocked, setDrawerDocked] = useState(false);

    /* 顯示 drawer */
    const openDrawer = () => setDrawerOpen(true);

    /* 關閉 drawer */
    const claseDrawer = () => setDrawerOpen(false);

    /* 點擊側邊 event */
    const touchEdgeHandler = e => !drawerOpen && openDrawer();

    const toggleDrawerDocked = () => setDrawerDocked(!drawerDocked);

    return (
        <SwipeableDrawer className={`MT-Properties-Drawer ${className}`}
            variant={drawerDocked ? 'permanent' : 'temporary'}
            anchor="right" open={drawerOpen} onOpen={openDrawer} onClose={claseDrawer}
            PaperProps={{ className: 'drawer-paper' }} SlideProps={{ mountOnEnter: true }}
            SwipeAreaProps={{ onClick: touchEdgeHandler, className: `${className} menuAnchor` }}
            ModalProps={{ keepMounted: true }}>

            <AppBar position="relative" className="header">
                <Toolbar disableGutters variant="dense" className="toolbar">
                    {/* 固定 drawer */}
                    <IconButton onClick={toggleDrawerDocked}>
                        {drawerDocked ? <GpsFixedIcon /> : <GpsNotFixedIcon />}
                    </IconButton>

                    {/* darwer 標題 */}
                    <Typography>欄位屬性設定</Typography>
                </Toolbar>
            </AppBar>

            <Box className="content">
                <FormProperties />
                <FieldProperties />
            </Box>

        </SwipeableDrawer>
    );
})`
    width: 350px;

    .drawer-paper {
        width: 100%;
        max-width: 360px;
        // padding: 20px;
        // position: relative;
        box-sizing: border-box;
        box-shadow: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '-4px 0 20px rgb(203 217 249 / 73%)' : '-4px 0 20px rgb(83 106 158 / 23%)'};
    }

    .header {
        background: #123665;
    }

    .toolbar>* {
        margin-left: 8px;
    }

    &.menuAnchor {
        &:hover {
            border: 1px dashed rgb(190 217 236 / 74%);
            background: rgb(24 35 56 / 62%);
        }

        &:active {
            background: rgb(104 140 206 / 62%);
        }
    }

    .content {
        padding: 16px 20px 20px;
    }

    .divider-title {
        display: inline-flex;
        align-items: center;
        gap: 4px;
    }
`);
