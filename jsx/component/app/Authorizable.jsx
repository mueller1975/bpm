import { useConfirmDialog } from 'Context/ConfirmDialogContext.jsx';
import { useNotification } from 'Hook/useTools.jsx';
import React, { useEffect, useState } from 'react';
import { useQueryFormById } from './lib/useFetchAPI';
import { computeValues, getInitialFormData } from './lib/form';
import { formDataState } from './context/FormStates';
import { jsonToObject } from './lib/form';
import { flowUserTaskState, userState } from './context/UserStates';
import { useRecoilValue } from 'recoil';
import { merge } from 'lodash';
import testFormData from './lib/testFormData.json';

/**
 * 查詢表單資訊（表單內容 ＆ 使用者流程權限）
 */
export default React.memo(({ queryForm, children }) => {

    const [readOnly, setReadOnly] = useState(true); // 表單預設唯讀
    const [queryResponse, setQueryResponse] = useState({}); // 查詢表單資訊結果
    const user = useRecoilValue(userState);
    const [CONTEXT_STATE_PROPS, DEFAULT_FORM_VALUES] = useRecoilValue(formDataState);

    const { showError } = useNotification();
    const { openDialog } = useConfirmDialog();

    console.log('(Authorizable)', { queryForm, queryResponse });

    // hook 查詢後端表單資訊
    const { execute: exQueryForm, pending } = useQueryFormById(response => {
        // 檢查澄清單內容是否已被異動並顯示提示
        if (response.form.timestamp !== queryForm.timestamp) {
            openDialog({
                title: '資料異動提示',
                confirmText: '我知道了',
                severity: 'info',
                content: [
                    '本單資料內容已被其他使用者異動！',
                    '目前開啟的內容為「異動後的最新資料」。'
                ]
            });
        }

        const { form, flowUserTask } = response; // 表單內容、使用者流程權限
        // const formsetData = JSON.parse(form.data); // 取出 json string 並轉為 object
        const formsetData = testFormData; // 測試 formset data

        setReadOnly(false);
        setQueryResponse({ formsetData, flowUserTask });
    }, showError);

    // 查詢後端表單資訊
    useEffect(() => {
        if (!queryForm.id) {

            console.log({ DEFAULT_FORM_VALUES })

            const _ = getInitialFormData({ user }); // 初始資料
            const defaultValues = computeValues(DEFAULT_FORM_VALUES, { _ });
            let formsetData = merge({}, defaultValues);
            formsetData._ = _;

            // 新增表單, 直接設定使用者表單權限為 EDIT
            let flowUserTask = { formPrivileges: ['EDIT'] };
            setQueryResponse({ formsetData, flowUserTask });
            setReadOnly(false);
        } else {
            // 非新增表單, 查詢後端表單相關資訊
            exQueryForm({ params: queryForm.id });
        }

        // form 關閉時動作
        // return () => resetFormContext(); // 重置 FormContext state
    }, []);

    return children({ ...queryResponse, readOnly });
});