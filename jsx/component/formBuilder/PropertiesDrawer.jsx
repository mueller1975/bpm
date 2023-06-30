import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import GpsNotFixedIcon from '@mui/icons-material/GpsNotFixed';
import { AppBar, IconButton, SwipeableDrawer, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import FieldProperties from './FieldProperties.jsx';
import FormProperties from './FormProperties.jsx';

export default React.memo(styled(props => {
    const { open, docked, onOpen, onDock, className } = props;

    /* 顯示 drawer */
    const openDrawer = () => onOpen(true);

    /* 關閉 drawer */
    const claseDrawer = () => onOpen(false);

    /* 點擊側邊 event */
    const touchEdgeHandler = e => !open && onOpen(true);

    const toggleDrawerDocked = () => onDock(!docked);

    return (
        <SwipeableDrawer className={`MT-Properties-Drawer ${className}`}
            variant={docked ? 'permanent' : 'temporary'}
            anchor="right" open={open} onOpen={openDrawer} onClose={claseDrawer}
            PaperProps={{ className: 'drawer-paper' }} SlideProps={{ mountOnEnter: true }}
            SwipeAreaProps={{ onClick: touchEdgeHandler, className: `${className} menuAnchor` }}
            ModalProps={{ keepMounted: true }}>

            <AppBar position="relative" className="header">
                <Toolbar disableGutters variant="dense" className="toolbar">
                    {/* 固定 drawer */}
                    <IconButton onClick={toggleDrawerDocked}>
                        {docked ? <GpsFixedIcon /> : <GpsNotFixedIcon />}
                    </IconButton>

                    {/* darwer 標題 */}
                    <Typography>欄位屬性設定</Typography>
                </Toolbar>
            </AppBar>

            <div className="content">
                <FormProperties />
                <FieldProperties />
            </div>

        </SwipeableDrawer>
    );
})`
    width: 350px;

    &.MuiDrawer-docked {
        .drawer-paper {
            position: unset;
            border-radius: 4px;
        }
    }

    .drawer-paper {
        width: 100%;
        max-width: 360px;
        // padding: 20px;
        // position: relative;
        box-sizing: border-box;
        box-shadow: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '-4px 0 20px rgb(203 217 249 / 73%)' : '-4px 0 20px rgb(83 106 158 / 23%)'};
    }

    .header {
        position: sticky;
        top: 0;
        background: #123665;
        z-index: 2;
    }

    .toolbar>* {
        margin-left: 8px;
    }

    &.menuAnchor {
        border: 1px dashed rgb(190 217 236 / 74%);
        background: rgb(24 35 56 / 62%);

        :hover {            
            cursor: hand;
        }

        &:active {
            background: rgb(104 140 206 / 62%);
        }
    }

    .content {
        padding: 16px 20px 20px;
    }

`);
