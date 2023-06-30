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

const DEFAULT_COLS = { xs: 12, sm: 6, md: 4, lg: 3 };
const AddComponent = styled(({ className, onAdd }) => {

    return (
        <Grid item {...DEFAULT_COLS}>
            <div className={className}>
                <IconButton onClick={onAdd}><AddIcon /></IconButton>
            </div>
        </Grid>
    );
})`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed gray;
    border-radius: 4px;

    :hover {
        border-color: white;
    }
`;

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

    let gridContainer = useMemo(() => (
        // NOT available 時, "隱藏" Grid 而非 return null, 因欄位的狀態為 uncontrolled
        <Grid container spacing={gridSpacing} className={`gridContainer ${!title ? className : ''}`}>
            {
                fields2.length == 0 ? <AddComponent onAdd={addField} /> :
                    fields2.map((field, idx) => {
                        let { uuid, name } = field;

                        return generateField({ cols, ...field, formId, key: uuid });
                    })
            }
        </Grid>
    ), [fields2]);

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