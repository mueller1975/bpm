import { styled } from '@mui/material/styles';
import { SpringTransition2 as SpringTransition } from 'Animations';
import React, { useCallback, useEffect, useState } from 'react';
import _ from 'underscore';
import { LOG_ACTION } from '../lib/formConsts';
import MPBLogActionChip from './MPBLogActionChip.jsx';
import DeselectIcon from '@mui/icons-material/Deselect';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import { ButtonGroup, Button } from '@mui/material';

const actionOptions = Object.entries(LOG_ACTION).map(([key, value]) => ({ code: key, name: value.text }));

export default styled(props => {
    const { statistics, onSelect, springRef, className } = props;
    const [selectedActions, setSelectedActions] = useState([]);

    useEffect(() => {
        // 設定預選歷程動作: 歷程中有"保存"以外的動作, 移除"保存"
        let actions = Object.keys(statistics);
        actions = actions.length > 1 ? _.without(actions, 'SAVE') : actions;

        select(actions);
    }, [statistics]);

    const select = useCallback(actions => {
        setSelectedActions(actions);
        onSelect(actions);
    });

    const selectHandler = useCallback(code => {
        let newActions = [...selectedActions, code];
        select(newActions);
    }, [selectedActions]); // 選取動作

    const deselectHandler = useCallback(code => {
        let newActions = selectedActions.filter(s => s != code);
        select(newActions);
    }, [selectedActions]); // 取消選取動作

    const selectAll = useCallback(() => select(Object.keys(statistics)), [statistics]);

    const selectNone = useCallback(() => select([]), []);

    return (
        <div className={className}>
            <div className="buttons">
                <ButtonGroup fullWidth color="warning">
                    <Button startIcon={<SelectAllIcon color='info' />} onClick={selectAll}>全</Button>
                    <Button startIcon={<DeselectIcon color='disabled' />} onClick={selectNone}>無</Button>
                </ButtonGroup>
            </div>

            <div className="actions">
                <SpringTransition ref={springRef} effect="scale" items={actionOptions} trail={100}>
                    {
                        action =>
                            <MPBLogActionChip action={action} count={statistics[action.code] ?? 0}
                                selected={selectedActions.indexOf(action.code) > -1}
                                onSelect={selectHandler} onDeselect={deselectHandler} />
                    }
                </SpringTransition>
            </div>
        </div>
    );
})`
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    
    .buttons {
        padding: 8px;
    }

    .actions {
        flex-grow: 1;
        gap: 8px;
        display: flex;
        flex-direction: column;
        overflow: hidden auto;
        padding: 4px 8px 16px;
    }
`;