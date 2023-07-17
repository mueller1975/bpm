import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import SaveIcon from '@mui/icons-material/Save';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import {
    AppBar, IconButton, List, ListItemText, SpeedDial, SpeedDialAction, SpeedDialIcon,
    Toolbar, Typography
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { animated, config, useSpring } from '@react-spring/web';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import FormListItem from './FormListItem.jsx';
import { allFormsState } from './context/FormStates';
import { fieldHierarchyState, fieldsetHierarchyState, formHierarchyState } from './context/PropsHierarchyState.js';
import { useNotification } from 'Hook/useTools.jsx';
import { expandedFormsState } from './context/BuilderStates';

const AnimatedList = animated(List);
const AnimatedIconButton = animated(IconButton);
const AnimatedListItemText = animated(ListItemText);
const springConfig = { friction: 8, tension: 120 };

export default React.memo(styled(({ forms, onItemClick, onLoadData, className }) => {
    const [collapsed, setCollapsed] = useState(true);
    const [firstExpanded, setFirstExpanded] = useState(false);

    const [allForms, setAllForms] = useRecoilState(allFormsState);
    const resetAllForms = useResetRecoilState(allFormsState);
    const resetExpandedForms = useResetRecoilState(expandedFormsState);
    const resetFormProperties = useResetRecoilState(formHierarchyState);
    const resetFieldsetProperties = useResetRecoilState(fieldsetHierarchyState);
    const resetFieldProperties = useResetRecoilState(fieldHierarchyState);

    const theme = useTheme();
    const underMD = useMediaQuery(theme.breakpoints.down('md'));
    const underSM = useMediaQuery(theme.breakpoints.down('sm'));

    const { showSuccess, showWarning } = useNotification();

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

    const save = useCallback(e => {
        e.stopPropagation();
        resetAllForms();
        resetExpandedForms(); // 清除展開 form accordion
    }, []);

    const deleteAll = useCallback(e => {
        e.stopPropagation();
        resetFormProperties();
        resetFieldsetProperties();
        resetFieldProperties();
        setAllForms([]);
        resetExpandedForms(); // 清除展開 form accordion
    }, []);

    const saveToCache = useCallback(e => {
        console.log(`Saving....`, allForms)
        window.localStorage.setItem('allForms', JSON.stringify(allForms));
        showSuccess(`已將 ${allForms.length} 個表單存入暫存區。`)
    }, [allForms]);

    const loadFromCache = useCallback(e => {
        e.stopPropagation();
        let savedForms = window.localStorage.getItem('allForms');

        if (!savedForms) {
            showWarning("尚未暫存任何表單...");
        } else {
            savedForms = JSON.parse(savedForms);
            setAllForms(savedForms);
            showSuccess(`共載入 ${savedForms.length} 個表單。`)
        }
    }, [allForms]);

    const actions = useMemo(() => [
        { key: 'deleteAll', icon: <DeleteForeverIcon />, tooltipTitle: <Typography variant='subtitle1'>刪除全部表單</Typography>, onClick: deleteAll },
        { key: 'save', icon: <SaveIcon />, tooltipTitle: <Typography variant='subtitle1'>儲存表單</Typography>, onClick: save },
        { key: 'saveToCache', icon: <SaveAltIcon />, tooltipTitle: <Typography variant='subtitle1'>暫存表單</Typography>, onClick: saveToCache },
        { key: 'loadFromCache', icon: <OpenInBrowserIcon />, tooltipTitle: <Typography variant='subtitle1'>載入暫存表單</Typography>, onClick: loadFromCache },
    ], [save, deleteAll, saveToCache, loadFromCache]);

    return (
        <div className={`MT-FormList ${className}`}>
            <AnimatedList dense={underMD} style={collapseProps} className="list">
                <AppBar position="relative">
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

            <SpeedDial icon={<SpeedDialIcon />} ariaLabel="表單動作" direction="up" hidden={collapsed}
                FabProps={{ size: 'medium', color: 'warning' }} className="actions">

                {actions.map(action => <SpeedDialAction {...action} />)}
            </SpeedDial>
        </div>
    );
})`
    &.MT-FormList {
        height: 100%;
        padding: 0;
        position: relative;

        border-radius: 4px;
        background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(255 255 255 / 60%)' : 'rgb(11 20 37 / 63%)'};
        box-shadow: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '8px 8px 8px 0px #72777f' : '#121212 8px 8px 8px 0px'};

        >.actions {
            position: absolute;
            right: 16px;
            bottom: 16px;
            
            >button {
                color: #fff;
            }
        }

        >.list {
            padding: 0;
            height: 100%;
            overflow: hidden auto;

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
        }
    }
`);