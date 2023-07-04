import { Grid, IconButton, } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useMemo, useCallback } from 'react';
import { jsonToObject } from '../lib/formUtils';
import { generateField } from '../lib/formUI.jsx';
import Fieldset from './Fieldset.jsx';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import { flatComponentsState, updateFlatComponentsSelector, flatComponentsState2 } from '../context/FormStates.jsx';
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import AddComponentButton from '../AddComponentButton.jsx';
import { v4 as uuidv4 } from 'uuid';

export default React.memo(styled(props => {
    const { uuid, noBorder = false, title = '無標題', formId, formData, editable, fields, cols, available: parentAvailable = true, className } = props;
    // const flatComponents = useRecoilValue(flatComponentsState);
    // const fields2 = useRecoilValue(flatComponentsState2(uuid));
    // const update2 = useSetRecoilState(flatComponentsState2(uuid));

    const [fields2, update2] = useRecoilState(flatComponentsState2(uuid));
    const gridSpacing = 1.5;

    console.log({ fields2 })

    const addField = () => {
        let field = { uuid: uuidv4(), name: "testField", label: '新增欄位', };
        update2([...fields2, field]);
    }

    const editProperties = () => {

    };

    let gridContainer = useMemo(() => (
        // NOT available 時, "隱藏" Grid 而非 return null, 因欄位的狀態為 uncontrolled
        <Grid container spacing={gridSpacing} className={`gridContainer ${!title ? className : ''}`}>
            <Grid item {...cols}>
                <AddComponentButton onClick={addField} />
            </Grid>

            {
                fields2.map((field, idx) => {
                    let { uuid, name } = field;
                    return generateField({ cols, field, formId });
                })
            }
        </Grid>
    ), [fields2]);

    const actions = [
        { action: () => console.log(1), icon: <DeleteIcon color="error" /> },
        { action: addField, icon: <AddIcon color="success" /> },
        { action: editProperties, icon: <EditIcon color="warning" /> },
    ];

    // return !title ? gridContainer :
    return (
        <Fieldset title={title} noBorder={noBorder} className={`MT-GridFieldsetContainer ${className}`} actions={actions}>
            {gridContainer}
        </Fieldset>
    );
})`
    &.MT-GridFieldsetContainer {
        .gridContainer {
            padding-top: 6px;
        }
        
        &.hidden {
            margin: 0;
            content-visibility: hidden;
        }
    }
`);