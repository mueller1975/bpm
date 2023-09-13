import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

export default React.memo(styled(React.forwardRef((props, ref) => {
    const { name, label, value = [], items = [], onChange, className } = props;

    return (
        <FormGroup ref={ref} row className={className}>
            {
                items.map(({ name, label }) =>
                    <FormControlLabel key={name} label={label}
                        slotProps={{ typography: { noWrap: true } }}
                        control={
                            <Checkbox checked={value.includes(name)} size="small"
                                name={name} />
                        } />)
            }
        </FormGroup>
    )
}))`
    &.MuiFormGroup-root {
        padding: 23px 12px 2px 24px;
        display: flex;
        flex-wrap: nowrap;
    }
`);