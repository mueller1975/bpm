import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

export default React.memo(styled(React.forwardRef((props, ref) => {
    const { name, label, value, items = [], className } = props;

    return (
        <RadioGroup ref={ref} row className={className} value={value}>
            {
                items.map(({ value, label }) =>
                    <FormControlLabel key={value} label={label} value={value}
                        slotProps={{ typography: { noWrap: true } }}
                        control={<Radio size="small" />} />)
            }
        </RadioGroup>
    )
}))`
    &.MuiFormGroup-root {
        padding: 23px 12px 2px 24px;
        display: flex;
        flex-wrap: nowrap;
    }
`);