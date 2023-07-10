import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { Button, ButtonGroup, ListItemIcon, MenuItem, MenuList, Popover } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useMemo, useRef, useState } from 'react';

const ANCHOR_ORIGIN = {
    vertical: 'bottom',
    horizontal: 'left',
};

/**
 * 審批按鈕
 */
export default React.memo(styled(props => {
    const { onAgree, onDisagree, disabled = false, className } = props;
    const [actionIdx, setActionIdx] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);

    const btnGroupRef = useRef();

    const openMenu = useCallback(() => setMenuOpen(true), []);
    const closeMenu = useCallback(() => setMenuOpen(false), []);

    const actions = useMemo(() => [
        // { name: '審批', color: 'warning', icon: <PersonSearchIcon fontSize='small' />, action: openMenu },
        {
            name: '同意', color: 'success', icon: <ThumbUpAltIcon fontSize='small' />,
            action: () => {
                setActionIdx(0);
                closeMenu();
                onAgree();
            }
        },
        {
            name: '不同意', color: 'error', icon: <ThumbDownIcon fontSize='small' />,
            action: () => {
                setActionIdx(1);
                closeMenu();
                onDisagree();
            }
        },
    ], [onAgree, onDisagree]);

    return (
        <>
            <ButtonGroup ref={btnGroupRef} variant="contained" color="success" disabled={disabled} className={className}>
                <Button startIcon={actions[actionIdx].icon} color={actions[actionIdx].color} onClick={actions[actionIdx].action}>
                    {actions[actionIdx].name}
                </Button>
                <Button size="small" color={actions[actionIdx].color} onClick={openMenu}>
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>

            <Popover open={menuOpen} anchorEl={btnGroupRef?.current} onClose={closeMenu}
                anchorOrigin={ANCHOR_ORIGIN}>

                <MenuList>
                    <MenuItem onClick={actions[0].action}>
                        <ListItemIcon>{actions[0].icon}</ListItemIcon>{actions[0].name}
                    </MenuItem>
                    <MenuItem onClick={actions[1].action}>
                        <ListItemIcon>{actions[1].icon}</ListItemIcon>{actions[1].name}
                    </MenuItem>
                </MenuList>
            </Popover>
        </>
    );
})`
    >button {
        white-space: nowrap;
    }
`);