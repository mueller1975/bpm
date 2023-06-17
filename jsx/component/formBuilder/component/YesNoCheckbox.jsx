import { Checkbox, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

export default styled(React.forwardRef((props, ref) => {
    const { name, label, defaultValue, color, hidden, disabled, available, required, onChange, className } = props;

    return (
        <label className={`${className} label`}>
            <Checkbox
                name={name}
                disabled={disabled}
                color={color}
                value='Y'
                defaultChecked={defaultValue === 'Y'}
                inputProps={{ hidden, required, "data-available": available.toString() }}
                onChange={onChange}
            />
            <Typography noWrap>{label}</Typography>
        </label>);
}))`
    &.label {
        color: rgb(125 139 230);
        display: inline-flex;
        padding: 13px 12px 12px 2px;

        :hover {
            cursor: pointer;
        }
    }
`;