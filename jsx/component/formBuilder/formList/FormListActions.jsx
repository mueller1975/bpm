import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import SaveIcon from '@mui/icons-material/Save';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import {
    SpeedDial, SpeedDialAction, SpeedDialIcon, Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNotification } from 'Hook/useTools.jsx';
import React, { useCallback, useMemo } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { expandedFormsState } from '../context/BuilderStates';
import { allFormsState } from '../context/FormStates';
import { fieldHierarchyState, fieldsetHierarchyState, formHierarchyState } from '../context/PropsHierarchyState';

export default React.memo(styled(props => {
    const { hidden, className } = props;

    const [allForms, setAllForms] = useRecoilState(allFormsState);
    const resetAllForms = useResetRecoilState(allFormsState);
    const resetExpandedForms = useResetRecoilState(expandedFormsState);
    const resetFormProperties = useResetRecoilState(formHierarchyState);
    const resetFieldsetProperties = useResetRecoilState(fieldsetHierarchyState);
    const resetFieldProperties = useResetRecoilState(fieldHierarchyState);

    const { showSuccess, showWarning } = useNotification();

    const save = useCallback(e => {
        e.stopPropagation();
        resetAllForms();
        resetExpandedForms(); // 清除展開 form accordion
    }, []);

    const deleteAll = useCallback(e => {
        e.stopPropagation();
        resetFormProperties();
        resetFieldsetProperties();
        resetFieldProperties();
        setAllForms([]);
        resetExpandedForms(); // 清除展開 form accordion
    }, []);

    const saveToCache = useCallback(e => {
        console.log(`Saving....`, allForms)
        window.localStorage.setItem('allForms', JSON.stringify(allForms));
        showSuccess(`已將 ${allForms.length} 個表單存入暫存區。`)
    }, [allForms]);

    const loadFromCache = useCallback(e => {
        e.stopPropagation();
        let savedForms = window.localStorage.getItem('allForms');

        if (!savedForms) {
            showWarning("尚未暫存任何表單...");
        } else {
            savedForms = JSON.parse(savedForms);
            setAllForms(savedForms);
            showSuccess(`共載入 ${savedForms.length} 個表單。`)
        }
    }, [allForms]);

    const actions = useMemo(() => [
        { key: 'deleteAll', icon: <DeleteForeverIcon />, tooltipTitle: <Typography variant='subtitle1'>刪除全部表單</Typography>, onClick: deleteAll },
        { key: 'save', icon: <SaveIcon />, tooltipTitle: <Typography variant='subtitle1'>儲存表單</Typography>, onClick: save },
        { key: 'saveToCache', icon: <SaveAltIcon />, tooltipTitle: <Typography variant='subtitle1'>暫存表單</Typography>, onClick: saveToCache },
        { key: 'loadFromCache', icon: <OpenInBrowserIcon />, tooltipTitle: <Typography variant='subtitle1'>載入暫存表單</Typography>, onClick: loadFromCache },
    ], [save, deleteAll, saveToCache, loadFromCache]);

    return (
        <SpeedDial className={`MT-FormListActions ${className}`} icon={<SpeedDialIcon />} ariaLabel="表單動作" direction="up" hidden={hidden}
            FabProps={{ size: 'medium', color: 'warning' }}>

            {actions.map(action => <SpeedDialAction {...action} />)}
        </SpeedDial>
    );
})`
    &.MT-FormListActions {
        >button {
            color: #fff;
        }
    }
`);