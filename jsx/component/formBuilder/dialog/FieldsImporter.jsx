import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import TransformIcon from '@mui/icons-material/Transform';
import ClearIcon from '@mui/icons-material/Clear';
import { Button, DialogContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DraggableDialog, ErrorBoundary, IconnedDialogTitle } from 'Components';
import React, { useState } from 'react';
import CSVTransformer from './CSVTransformer.jsx';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { fieldState, fieldsetState, formState } from '../context/FormStates';

export default styled(props => {
    const { formUUID, fieldsetUUID, onClose, ...others } = props;
    const [value, setValue] = useState('');

    const [fieldset, setFieldset] = useRecoilState(fieldsetState([formUUID, fieldsetUUID]));

    const [key, setKey] = useState(new Date().getTime());

    const confirmValue = () => {
        console.log('Added...')

        let fields = [...fieldset.fields, ...value];
        setFieldset({ fieldset: { fields } });
        onClose();
    };

    const valueTransformHandler = v => {
        console.log('VALUE transformed:', v);
        setValue(v);
    };

    return (
        <ErrorBoundary>
            <DraggableDialog  {...others}>
                <IconnedDialogTitle title="原始資料轉換 JSON" icon={TransformIcon}>
                    <Button variant="contained" startIcon={<ClearIcon />} color="secondary" onClick={onClose}>取消</Button>
                    <Button variant="contained" startIcon={<CancelOutlinedIcon />} onClick={confirmValue}>確定</Button>
                </IconnedDialogTitle>

                <DialogContent>
                    <div className="content">
                        <CSVTransformer key={key} category="FIELD" onTransform={valueTransformHandler} />
                    </div>
                </DialogContent>
            </DraggableDialog>
        </ErrorBoundary>
    );
})`
    .content {
        padding-top: 8px;
    }
`;