import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import AnimatedFab from 'Component/AnimatedFab.jsx';
import { ConfirmDialog, lazyWithRefForwarding, Loading } from 'Components';
import { useNotification } from 'Hook/useTools.jsx';
import { merge } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { checkedFormsState, expandedFormsState, targetFormUUIDState } from './context/BuilderStates';
import { formContextState } from './context/FormContextStates';
import { allFormIdsState, allFormsState, allFormUUIDsState, formDataState } from './context/FormStates';
import { flowUserTaskState, userState } from './context/UserStates';
import FormActions from './FormActions.jsx';
import FormContent from './FormContent.jsx';
import { getFormFieldValues, getInitialFormData, jsonToObject } from './lib/form';
import testFormData from './lib/testFormData.json';
import { useQueryFormById } from './lib/useFetchAPI';
import { useConfirmDialog } from 'Context/ConfirmDialogContext.jsx';

export default React.memo(styled(props => {

    const { showError } = useNotification();

    // hook 查詢 MPB 澄清單
    const { execute: queryForm, pending } = useQueryFormById(result => {
        const { timestamp, flowUserTask } = result;
        timestamp != data.timestamp && setAlertDlgOpen(true); // 資料過時, 顯示告警

        setFlowUserTask(flowUserTask); // 設定使用者 user task 資訊
    }, showError);

    useEffect(() => {
        if (!data?.id) {
            // 尚未儲存文件, 直接設定使用者表單權限為 EDIT
            let flowUserTask = { formPrivileges: ['EDIT'] };
            setFlowUserTask(flowUserTask);
        } else {
            // 非未保存文件, 檢查澄清單內容是否已被異動 & 查詢使用者表單權限
            queryForm({ params: data.id });
        }

        // 狀態為"品保審批"時, 自動展開"主檔"及"品保審批"
        if (data?.approvalStatus?.code == 'PENDING') {
            setExpandedForms(['main', 'qa']);
        }

        // form 關閉時動作
        return () => resetFormContext(); // 重置 FormContext state
    }, []);

})`

`);