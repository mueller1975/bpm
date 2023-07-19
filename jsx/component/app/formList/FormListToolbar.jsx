import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
    IconButton, ListItemText, Toolbar, Checkbox
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { animated } from '@react-spring/web';
import React, { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { formListCollapsedSelector, checkedFormsState } from '../context/BuilderStates';
import { allFormUUIDsState } from '../context/FormStates';

const AnimatedIconButton = animated(IconButton);
const AnimatedListItemText = animated(ListItemText);

export default React.memo(styled(props => {
    const { disabled, showProps, hideProps, className } = props;
    const [collapsed, setCollapsed] = useRecoilState(formListCollapsedSelector);
    const [checkedForms, setCheckedForms] = useRecoilState(checkedFormsState);
    const allFormUUIDs = useRecoilValue(allFormUUIDsState);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    // 全選/全不選
    const checkboxChangeHandler = useCallback((e, checked) => {
        e.stopPropagation();

        if (checked) {
            setCheckedForms([...allFormUUIDs]);
        } else {
            setCheckedForms([]);
        }
    }, [allFormUUIDs]);

    return (
        <Toolbar disableGutters variant="dense" className={`MT-FormListToolbar ${className}`}>
            <AnimatedIconButton disabled={disabled} onClick={toggleCollapsed} style={hideProps}>
                <ArrowBackIosIcon />
            </AnimatedIconButton>

            <AnimatedIconButton disabled={disabled} onClick={toggleCollapsed} className="overlapped" style={showProps}>
                <ArrowForwardIosIcon />
            </AnimatedIconButton>

            {/* title */}
            <AnimatedListItemText primary="表單分區" primaryTypographyProps={{ color: "textSecondary" }} style={hideProps} />

            {/* 全選/全不選 checkbox */}
            <Checkbox color="primary" checked={allFormUUIDs.length == checkedForms.length}
                indeterminate={checkedForms.length > 0 && checkedForms.length < allFormUUIDs.length}
                onChange={checkboxChangeHandler} />
        </Toolbar>
    );
})`
    &.MT-FormListToolbar {
        background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '#f6f6f6' : '#10162a'};
        padding: 0 4px 0 8px;

        >.overlapped {
            position: absolute;
        }

        .MuiListItemText-primary {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
`);