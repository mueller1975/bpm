import { FilledInput, FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import RadioGroup from './RadioGroup.jsx';

export default React.memo(props => {
    const { name, label, value, items = [], onChange } = props;

    return (
        <FormControl component="fieldset" size="small" variant="filled">
            <InputLabel shrink>{label}</InputLabel>
            <FilledInput
                value={value}
                inputComponent={RadioGroup}
                inputProps={{
                    items,
                    onChange
                }}
            />
        </FormControl>
    )
});