import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useMemo, useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import AddComponentButton from '../AddComponentButton.jsx';
import { fieldsetState } from '../context/FormStates';
import { propertiesState } from '../context/PropertiesState';
import { generateField } from '../lib/formUI.jsx';
import Fieldset from './Fieldset.jsx';
import ConfirmDialog from 'Component/ConfirmDialog.jsx';

export default React.memo(styled(props => {
    const { uuid: fieldsetUUID, noBorder = false, title = '無標題', formId, formUUID,
        fields: fields3, cols, available: parentAvailable = true, className } = props;

    const [fieldset, updateFieldset] = useRecoilState(fieldsetState([formUUID, fieldsetUUID]));
    const { fields } = fieldset;
    console.log({ fieldset })

    const setFieldsetProperties = useSetRecoilState(propertiesState('FIELDSET'));

    const gridSpacing = 1.5;

    console.log({ fields })

    useEffect(() => {
        if (formUUID && fieldsetUUID) {
            editProperties();
        }
    }, []);

    const addField = () => {
        let field = { uuid: uuidv4(), name: "", label: '新增欄位', };
        // update2([...fields, field]);
        updateFieldset({ fields: [...fields, field] });
    }

    const editProperties = () => {
        setFieldsetProperties([formUUID, fieldsetUUID]);
    };

    const deleteFieldset = () => {

    }

    let gridContainer = useMemo(() => (
        // NOT available 時, "隱藏" Grid 而非 return null, 因欄位的狀態為 uncontrolled
        <Grid container spacing={gridSpacing} className={`gridContainer`}>
            <Grid item {...cols}>
                <AddComponentButton onClick={addField} />
            </Grid>

            {
                fields.map((field, idx) => {
                    let { uuid, name } = field;
                    return generateField({ cols, field, formId, hierarchy: [formUUID, fieldsetUUID, uuid] });
                })
            }
        </Grid>
    ), [fields]);

    const actions = [
        { action: () => deleteFieldset, icon: <DeleteIcon color="error" /> },
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
    }
`);