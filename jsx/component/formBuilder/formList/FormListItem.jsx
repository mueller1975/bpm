import {
    Avatar, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Tooltip, Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { animated } from '@react-spring/web';
import { stringToColor } from 'Tools';
import React, { useMemo, useRef, useCallback } from 'react';
import { getIconComponent } from '../lib/formUI.jsx';
import { targetFormUUIDState } from '../context/BuilderStates';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { propsHierarchyState } from "../context/PropsHierarchyState";

const AnimatedAvatar = animated(Avatar);
const AnimatedListItemText = animated(ListItemText);

export default React.memo(styled(props => {
    const { form, tooltipDisabled = true, showProps, hideProps, className } = props;

    const propsHierarchy = useRecoilValue(propsHierarchyState('FORM'));
    const setTargetFormUUID = useSetRecoilState(targetFormUUIDState);
    const itemRef = useRef();

    const { uuid, id, title, icon } = form;

    const AnimatedItemIcon = useMemo(() => animated(getIconComponent(icon)), [icon]);
    const formColor = id ? stringToColor(id) : '#fff'; // 個別 form 圖示顏色

    const itemClickHandler = useCallback(e => setTargetFormUUID(uuid), []);

    return (
        <>
            <ListItem disablePadding component="div" className={`MT-FormListItem ${className}`}>

                <Tooltip arrow disableHoverListener={tooltipDisabled || !title} placement="right"
                    title={<Typography variant="subtitle2">{title}</Typography>}>

                    <ListItemButton onClick={itemClickHandler} ref={itemRef} className={uuid === propsHierarchy[0] ? 'editing' : ''}>
                        <ListItemIcon>
                            <div className="iconWrapper">
                                {/* form icon */}
                                <AnimatedItemIcon sx={{ color: formColor }} style={hideProps} />

                                {/* form 名稱第一個字 */}
                                <AnimatedAvatar className="itemAvatar overlapped"
                                    sx={{ bgcolor: `${formColor}40` }} style={showProps}>

                                    <Typography color="textPrimary">{title?.substring(0, 1)}</Typography>
                                </AnimatedAvatar >
                            </div >
                        </ListItemIcon >

                        {/* form 名稱 */}
                        < AnimatedListItemText primary={title} style={hideProps} />
                    </ListItemButton >
                </Tooltip >
            </ListItem >

            <Divider />
        </>
    );
})`
    &.MT-FormListItem {
        
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

            &.editing {
                background-color: #517b45;
            }
        }

        .itemAvatar {
            top: 0;
            width: 36px;
            height: 36px;
        }

        .MuiListItemText-primary {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
`);