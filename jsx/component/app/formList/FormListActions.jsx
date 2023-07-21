import StorageIcon from '@mui/icons-material/Storage';
import {
    SpeedDial, SpeedDialAction, SpeedDialIcon, Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useMemo } from 'react';
import { useSetRecoilState } from 'recoil';
import { allFormsState } from '../context/FormStates';
import { loadDBForms } from '../lib/form';

export default React.memo(styled(props => {
    const { hidden, className } = props;

    const setAllForms = useSetRecoilState(allFormsState);

    const loadFromDB = useCallback(async () => {
        let forms = await loadDBForms();
        setAllForms(forms);
    }, []);

    const actions = useMemo(() => [
        { key: 'loadFromDB', icon: <StorageIcon />, tooltipTitle: <Typography variant='subtitle1'>讀取 DB 表單</Typography>, onClick: loadFromDB },
    ], []);

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