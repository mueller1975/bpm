import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useMemo, useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import AddComponentButton from '../AddComponentButton.jsx';
import { fieldsetState } from '../context/FormStates.jsx';
import { propertiesState } from '../context/PropertiesState';
import { generateField } from '../lib/formUI.jsx';
import Fieldset from './Fieldset.jsx';

export default React.memo(styled(props => {
    const { uuid, noBorder = false, title = '無標題', formId, formUUID,
        fields: fields3, cols, available: parentAvailable = true, className } = props;

    const [fieldset, updateFieldset] = useRecoilState(fieldsetState([formUUID, uuid]));
    const { fields } = fieldset;
    console.log({ fieldset })

    const setFieldsetProperties = useSetRecoilState(propertiesState('FIELDSET'));

    const gridSpacing = 1.5;

    console.log({ fields })

    useEffect(() => {
        if (formUUID && uuid) {
            editProperties();
        }
    }, []);

    const addField = () => {
        let field = { uuid: uuidv4(), name: "testField", label: '新增欄位', };
        // update2([...fields, field]);
        updateFieldset({ fields: [...fields, field] });
    }

    const editProperties = () => {
        setFieldsetProperties([formUUID, uuid]);
    };

    let gridContainer = useMemo(() => (
        // NOT available 時, "隱藏" Grid 而非 return null, 因欄位的狀態為 uncontrolled
        <Grid container spacing={gridSpacing} className={`gridContainer ${!title ? className : ''}`}>
            <Grid item {...cols}>
                <AddComponentButton onClick={addField} />
            </Grid>

            {
                fields.map((field, idx) => {
                    let { uuid, name } = field;
                    return generateField({ cols, field, formId });
                })
            }
        </Grid>
    ), [fields]);

    const actions = [
        { action: () => console.log(1), icon: <DeleteIcon color="error" /> },
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