import { Badge, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { LOG_ACTION } from '../lib/formConsts';

const ANCHOR_ORIGIN = { vertical: 'top', horizontal: 'right' };
/**
 * 歷程動作 Chip
 */
export default styled(props => {
    const { action: { code, name }, count, selected = false, onSelect, onDeselect, ...others } = props;

    const logAction = LOG_ACTION[code];
    const { text: actionName, icon: ActionIcon, style: { color: actionColor } } = logAction;

    const clickHandler = () => {
        selected && onDeselect(code);
        !selected && onSelect(code);
    };

    return <Chip {...others} clickable disabled={count == 0}
        icon={<ActionIcon fontSize="small" />}
        label={<Badge badgeContent={count} color="secondary" anchorOrigin={ANCHOR_ORIGIN}>{name}</Badge>}
        sx={{ bgcolor: selected ? actionColor : 'default' }}
        onClick={clickHandler} />;
})`
    width: 100%;

    .MuiChip-label {
        flex-grow: 1;
        padding: 12px;
    }

    .MuiBadge-root {
        width: 100%;
    }
`