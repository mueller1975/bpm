import { FilledInput, FormControl, InputLabel } from '@mui/material';
import React from 'react';
import CheckboxGroup from './CheckboxGroup.jsx';

export default React.memo(props => {
    const { name, label, value, items = [], onChange } = props;

    return (
        <FormControl component="fieldset" size="small" variant="filled">
            <InputLabel shrink>{label}</InputLabel>
            <FilledInput
                value={value || []}
                inputComponent={CheckboxGroup}
                inputProps={{
                    items,
                    onChange
                }}
            />
        </FormControl>
    )
});