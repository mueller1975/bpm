import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { jsonToObject } from '../lib/formUtils';
import { generateField } from '../lib/formUI.jsx';
import Fieldset from './Fieldset.jsx';

export default React.memo(styled(props => {
    const { noBorder = false, title, formId, formData, editable, fields, cols, available: parentAvailable = true, className } = props;

    // const gridSpacing = title ? 2 : 1.5;
    const gridSpacing = 1.5;

    let gridContainer = (
        // NOT available 時, "隱藏" Grid 而非 return null, 因欄位的狀態為 uncontrolled
        <Grid container spacing={gridSpacing} className={`gridContainer ${!title ? className : ''}`}
        // sx={{ display: hidden ? 'none' : 'flex' }}
        // sx={{ contentVisibility: hidden ? 'hidden' : 'visibile' }}
        >
            {
                fields.map((field, idx) => {
                    let { defaultValue, name } = field;

                    // let value = formData ? (jsonToObject(formData[name]) || '') : defaultValue ?? '';
                    let value = (formData ? jsonToObject(formData[name]) : defaultValue) ?? '';
                    let disabled = field.disabled || !editable;

                    return generateField({
                        cols, ...field, formId,
                        key: `${name}-${idx}`, // key 為欄位 name + index, 目的為避免當存在相同 name 的欄位時所造成的 warning
                        defaultValue: value, disabled
                    });
                })
            }
        </Grid>
    );

    return !title ? gridContainer :
        <Fieldset title={title} noBorder={noBorder} className={className}>
            {gridContainer}
        </Fieldset>;
})`
    .gridContainer {
        padding-top: 6px;
    }
    
    &.hidden {
        margin: 0;
        content-visibility: hidden;
    }
`);