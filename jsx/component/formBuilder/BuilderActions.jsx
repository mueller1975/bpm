import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import AnimatedFab from 'Component/AnimatedFab.jsx';
import React, { useCallback, useMemo } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import FloatingActions from './FloatingActions.jsx';
import { expandedFormsState } from './context/BuilderStates';
import { allFormUUIDsState } from './context/FormStates';

export default React.memo(styled(props => {
    const allFormUUIDs = useRecoilValue(allFormUUIDsState);
    const setExpandedForms = useSetRecoilState(expandedFormsState);

    // 展開所有 form
    const collapseAll = useCallback(() => setExpandedForms([]), []);

    // 縮合所有 form
    const expandAll = useCallback(() => setExpandedForms([...allFormUUIDs]), [allFormUUIDs]);

    // 動作
    const actions = useMemo(() => [
        <AnimatedFab key="collapse" color="success" size="medium" onClick={collapseAll}><ExpandLessIcon color="inherit" /></AnimatedFab>,
        <AnimatedFab key="expand" color="primary" size="medium" onClick={expandAll}><ExpandMoreIcon color="inherit" /></AnimatedFab>
    ], [expandAll]);

    return <FloatingActions actions={actions} />;
})`

`);