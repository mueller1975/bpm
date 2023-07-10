import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import HistoryIcon from '@mui/icons-material/History';
import { Timeline } from '@mui/lab';
import { Button, DialogContent, Typography, Zoom } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useChain, useSpringRef } from '@react-spring/web';
import { SpringTransition2 as SpringTransition } from 'Animations';
import { DraggableDialog, IconnedDialogTitle, Loading } from 'Components';
import { useNotification } from 'Hook/useTools.jsx';
import React, { useCallback, useMemo, useState } from 'react';
import { useFetchQueryActionLogs } from '../lib/useFetchAPI';
import MPBAuditLog from './MPBAuditLog.jsx';
import MPBLogActionSelect from './MPBLogActionSelect.jsx';

/**
 * MPB 歷程 Dialog
 */
export default React.memo(styled(props => {
    const { rowId, ...others } = props;
    const [logs, setLogs] = useState([]);
    const [displayLogs, setDisplayLogs] = useState([]);
    const [selectedActions, setSelectedActions] = useState([]); // 選取要顯示的歷程動作
    const [statistics, setStatistics] = useState({}); // 各歷程動作次數統計
    const { showError } = useNotification();

    // 查詢歷程記錄 hook
    const { execute: queryLogs, pending: querying } = useFetchQueryActionLogs(result => {
        // 統計各歷程動作次數
        let countMap = {};

        result.forEach(({ action }) => {
            let count = countMap[action] ?? 0;
            countMap[action] = ++count;
        });

        setStatistics(countMap);
        setLogs(result);
    }, showError);

    const transitionProps = useMemo(() => ({
        onEnter: () => queryLogs({ params: rowId }), // 查詢歷程記錄
        onExited: () => { // 清空歷程記錄
            setLogs([]);
            setStatistics({});
            setSelectedActions([]);
        }
    }), [rowId]);

    const selectHandler = useCallback(actions => {
        let newLogs = logs.filter(log => actions.includes(log.action))
        setDisplayLogs(newLogs);
        setSelectedActions(actions);
    }, [logs]);

    const selectSpringRef = useSpringRef();
    const logsSpringRef = useSpringRef();
    useChain([logsSpringRef, selectSpringRef], [0, 0.5]);

    return (
        <DraggableDialog key={rowId} TransitionComponent={Zoom} {...others} TransitionProps={transitionProps}>
            <IconnedDialogTitle icon={HistoryIcon} title="MPB 歷程記錄">
                <Button variant="contained" startIcon={<CancelOutlinedIcon />} onClick={props.onClose}>離開</Button>
            </IconnedDialogTitle>

            <DialogContent>
                <div className="actionSelect">
                    <MPBLogActionSelect springRef={selectSpringRef} statistics={statistics} onSelect={selectHandler} />
                </div>

                {/* 歷程記錄 */}
                <div className="timelinePanel">
                    {
                        querying ? <Loading message="資料載入中..." /> :
                            <Timeline position='right'>
                                {
                                    logs.length == 0 ?
                                        <Typography color="secondary" align="center">目前無本單的歷程記錄</Typography> : null
                                }
                                {
                                    logs.length > 0 && selectedActions.length == 0 ?
                                        <Typography color="secondary" align="center">請選取左方動作以顯示歷程</Typography> : null
                                }

                                <SpringTransition ref={logsSpringRef} effect="slide" trail={100} items={displayLogs} keys={({ id }) => id}>
                                    {
                                        log => <MPBAuditLog {...log} />
                                    }
                                </SpringTransition>
                            </Timeline>
                    }
                </div>
            </DialogContent>
        </DraggableDialog >
    );
})`
    .MuiDialogContent-root {
        position: relative;
        padding: 0 20px 20px;
        overflow: hidden;
        display: flex;
        gap: 16px;
    }

    .actionSelect {
        opacity: .8;
        transition: opacity .5s;
        border-radius: 4px;
        padding: 4px;
        background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(219 219 219)': 'rgb(57 62 80)'};        
        box-shadow: rgb(0 0 0 / 55%) 8px 8px 8px 0px;

        &:hover {
            opacity: 1;
        }
    }

    .timelinePanel {
        flex-grow: 1;
        width: 100%;
        border-radius: 4px;
        overflow: hidden auto;
        background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'linear-gradient(135deg, rgb(157 156 156 / 46%), rgb(235 235 235 / 67%), rgb(157 156 156 / 46%))' : 'linear-gradient(135deg, rgb(0 0 0 / 70%), rgb(44 49 69 / 80%), rgb(0 0 0 / 70%))'};
        box-shadow: rgb(0 0 0 / 55%) 8px 8px 8px 0px;
    }
`);