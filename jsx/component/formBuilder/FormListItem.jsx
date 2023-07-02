import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
    Avatar, Divider, IconButton, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, ListSubheader, Tooltip, Typography
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { animated, config, useSpring } from '@react-spring/web';
import { stringToColor } from 'Tools';
import React, { useEffect, useState, useRef } from 'react';
import FormListItemActions from './FormListItemActions.jsx';

const AnimatedAvatar = animated(Avatar);
const AnimatedListItemText = animated(ListItemText);

export default React.memo(styled(props => {
    const { form, tooltipDisabled = true, showProps, hideProps,
        onClick, className } = props;
    const [actionsOpen, setActionsOpen] = useState(false);
    const itemRef = useRef();

    const { uuid, id, title, icon: ItemIcon } = form;
    const AnimatedItemIcon = animated(ItemIcon);
    let formColor = id ? stringToColor(id) : '#fff'; // 個別 form 圖示顏色

    return (
        <React.Fragment key={uuid}>
            <ListItem disablePadding component="div" className={`MT-FormListItem ${className}`}
                onMouseEnter={() => setActionsOpen(true)}
                onMouseLeave={() => setActionsOpen(false)}>

                <Tooltip arrow disableHoverListener={tooltipDisabled} placement="right"
                    title={<Typography variant="subtitle2">{title}</Typography>}>

                    <ListItemButton onClick={() => onClick && onClick(uuid)} ref={itemRef}>
                        <ListItemIcon>
                            <div className="iconWrapper">
                                {/* form icon */}
                                <AnimatedItemIcon sx={{ color: formColor }} style={hideProps} />

                                {/* form 名稱第一個字 */}
                                <AnimatedAvatar className="itemAvatar overlapped" sx={{ bgcolor: `${formColor}40` }} style={showProps}>
                                    <Typography color="textPrimary">{title?.substring(0, 1)}</Typography>
                                </AnimatedAvatar>
                            </div>
                        </ListItemIcon>

                        {/* form 名稱 */}
                        <AnimatedListItemText primary={title} style={hideProps} />

                        <FormListItemActions form={form} open={actionsOpen} anchorEl={itemRef?.current} />
                    </ListItemButton>
                </Tooltip>
            </ListItem>

            <Divider />
        </React.Fragment>
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
        }

        .itemAvatar {
            width: 36px;
            height: 36px;
            // background-color: rgb(54 89 116 / 52%);
        }
    }

`);