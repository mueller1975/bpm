import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import GpsNotFixedIcon from '@mui/icons-material/GpsNotFixed';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import {
    Accordion, AccordionDetails, AccordionSummary,
    AppBar, IconButton, SwipeableDrawer, Toolbar, Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useState } from 'react';
import FieldProperties from './properties/FieldProperties.jsx';
import FieldsetProperties from './properties/FieldsetProperties.jsx';
import FormProperties from './properties/FormProperties.jsx';

export default React.memo(styled(props => {
    const { open, docked, onOpen, onDock, className } = props;
    const [formExpanded, setFormExpanded] = useState(false);
    const [fieldsetExpanded, setFieldsetExpanded] = useState(false);
    const [fieldExpanded, setFieldExpanded] = useState(false);

    // 顯示 drawer
    const openDrawer = useCallback(() => onOpen(true), []);

    // 關閉 drawer
    const claseDrawer = useCallback(() => onOpen(false), []);

    // 點擊側邊
    const touchEdgeHandler = useCallback(() => onOpen(true), []);

    // 切換 drawer dock 狀態
    const toggleDrawerDocked = useCallback(() => {
        onDock(!docked);
        docked && onOpen(false); // 不長駐時同時關閉 drawer
    }, [docked]);

    const expandForm = expanded => setFormExpanded(expanded); // 表單屬性 Accordion 開合
    const expandFieldset = expanded => setFieldsetExpanded(expanded); // 欄位群屬性 Accordion 開合
    const expandField = expanded => setFieldExpanded(expanded); // 欄位屬性 Accordion 開合

    return (
        <SwipeableDrawer className={`MT-PropertiesDrawer ${className}`}
            variant={docked ? 'permanent' : 'temporary'}
            anchor="right" open={open} onOpen={openDrawer} onClose={claseDrawer}
            PaperProps={{ className: 'drawer-paper' }} SlideProps={{ mountOnEnter: true }}
            SwipeAreaProps={{
                onClick: touchEdgeHandler,
                className: `MT-PropertiesDrawer ${className} menuAnchor`
            }}
            ModalProps={{ keepMounted: true }}>

            <AppBar position="relative" className="header">
                <Toolbar disableGutters variant="dense" className="toolbar">
                    {/* 固定 drawer */}
                    <IconButton color='disabled' onClick={toggleDrawerDocked}>
                        {docked ? <GpsFixedIcon /> : <GpsNotFixedIcon />}
                    </IconButton>

                    {/* darwer 標題 */}
                    <Typography color="textSecondary">元件屬性</Typography>
                </Toolbar>
            </AppBar>

            <div className="content">
                {/* 表單屬性設定 */}
                <Accordion expanded={formExpanded}>
                    <AccordionSummary className="summary">
                        <ListAltIcon />
                        <Typography>表單</Typography>
                    </AccordionSummary>

                    <AccordionDetails className="details">
                        <FormProperties onEdit={expandForm} />
                    </AccordionDetails>
                </Accordion>

                {/* 欄位群屬性設定 */}
                <Accordion expanded={fieldsetExpanded}>
                    <AccordionSummary className="summary">
                        <FolderOpenIcon />
                        <Typography>欄位群</Typography>
                    </AccordionSummary>

                    <AccordionDetails className="details">
                        <FieldsetProperties onEdit={expandFieldset} />
                    </AccordionDetails>
                </Accordion>

                {/* 欄位屬性設定 */}
                <Accordion expanded={fieldExpanded}>
                    <AccordionSummary className="summary">
                        <TextFieldsIcon />
                        <Typography>欄位</Typography>
                    </AccordionSummary>

                    <AccordionDetails className="details">
                        <FieldProperties onEdit={expandField} />
                    </AccordionDetails>
                </Accordion>
            </div>
        </SwipeableDrawer>
    );
})`
    &.MT-PropertiesDrawer {
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
            box-sizing: border-box;
            background: linear-gradient(-45deg,rgb(2 28 2 / 90%),rgb(35 49 34 / 90%),rgb(2 28 2 / 90%));
        }

        .header {
            position: sticky;
            top: 0;
            background: #09160b;
            z-index: 2;
        }

        .toolbar {
            padding-left: 8px;
        }

        &.menuAnchor {
            border: 1px dashed rgb(12 47 4);
            background: rgb(3 39 6 / 62%);

            :hover {            
                cursor: hand;
                border-color: rgb(130 181 119);
            }

            &:active {
                background: rgb(104 140 206 / 62%);
            }
        }

        .content {
            .summary {
                color: rgba(255, 255, 255, 0.7);
                background-color: rgb(2 28 2);
                cursor: default !important;

                >.MuiAccordionSummary-content {
                    gap: 4px;
                }
            }

            .summary[aria-expanded=true] {
                color: #ffa726;
            }

            .details {
                background-color: #102411;
                padding: 16px;
            }
        }
    }
`);
