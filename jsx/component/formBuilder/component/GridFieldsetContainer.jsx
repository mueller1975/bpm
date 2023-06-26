import { Grid, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { jsonToObject } from '../lib/formUtils';
import { generateField } from '../lib/formUI.jsx';
import Fieldset from './Fieldset.jsx';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import { flatComponentsState, updateFlatComponentsSelector, flatComponentsState2 } from '../context/FormStates.jsx';
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export default React.memo(styled(props => {
    const { uuid, noBorder = false, title = '無標題', formId, formData, editable, fields, cols, available: parentAvailable = true, className } = props;
    // const flatComponents = useRecoilValue(flatComponentsState);
    // const fields2 = useRecoilValue(flatComponentsState2(uuid));
    // const update2 = useSetRecoilState(flatComponentsState2(uuid));

    const [fields2, update2] = useRecoilState(flatComponentsState2(uuid));

    console.log({ fields2 })

    const addField = () => {
        let field = { name: "testField", label: '新增欄位', };
        update2([...fields2, field]);
    }
    // const gridSpacing = title ? 2 : 1.5;
    const gridSpacing = 1.5;

    let gridContainer = (
        // NOT available 時, "隱藏" Grid 而非 return null, 因欄位的狀態為 uncontrolled
        <Grid container spacing={gridSpacing} className={`gridContainer ${!title ? className : ''}`}
        // sx={{ display: hidden ? 'none' : 'flex' }}
        // sx={{ contentVisibility: hidden ? 'hidden' : 'visibile' }}
        >
            {
                fields2.map((field, idx) => {
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

    const actions = [
        { action: () => console.log(1), icon: <DeleteIcon color="error" /> },
        { action: addField, icon: <AddIcon color="success" /> },
        { action: () => console.log(3), icon: <EditIcon color="warning" /> },
    ];

    // return !title ? gridContainer :
    return (
        <Fieldset title={title} noBorder={noBorder} className={className} actions={actions}>
            {gridContainer}
        </Fieldset>
    );
})`
    .gridContainer {
        padding-top: 6px;
    }
    
    &.hidden {
        margin: 0;
        content-visibility: hidden;
    }
`);