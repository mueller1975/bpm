import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Fab, Popper } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { jiggle } from "../styled/Animations.jsx";
import { formPropertiesState } from "./context/PropertiesState.js";

export default React.memo(styled(props => {
    const { form, open, anchorEl, className } = props;

    const setFormProperties = useSetRecoilState(formPropertiesState);

    // 編輯表單屬性
    const editForm = useCallback(e => {
        e.stopPropagation();
        console.log({ form })
        setFormProperties({ ...form });
    }, [form]);

    // 刪除表單
    const deleteForm = useCallback(e => {
        e.stopPropagation();
    });

    return (
        <Popper open={open} anchorEl={anchorEl} placement="right"
            className={`MT-FormListItemActions ${className}`}>
            <div className="toolbar">
                <Fab size="small" color="error" onClick={deleteForm}><DeleteIcon /></Fab>
                <Fab size="small" color="warning" onClick={editForm}><EditIcon /></Fab>
            </div>
        </Popper>
    );
})`
    &.MT-FormListItemActions {
        z-index: 1;

        >.toolbar {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px;

            >button {
                transition: all .5s;
                color: lightgray;

                :hover {
                    animation: ${jiggle} .15s 3;
                    color: white;
                }
            }
        }
    }
`);