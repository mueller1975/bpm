import { useConfirmDialog } from 'Context/ConfirmDialogContext.jsx';
import { useNotification } from 'Hook/useTools.jsx';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { formDataState } from './context/FormStates';
import { userState } from './context/UserStates';
import { computeValues, createFormMetaData } from './lib/form';
import testFormData from './lib/testFormData.json';
import { useQueryFormById } from './lib/useFetchAPI';

/**
 * 查詢表單資訊（表單內容 ＆ 使用者流程權限）
 */
export default React.memo(({ isNewForm, form, children }) => {

    const [readOnly, setReadOnly] = useState(true); // 表單預設唯讀
    const [queryResponse, setQueryResponse] = useState({}); // 查詢表單資訊結果
    const user = useRecoilValue(userState);
    const [CONTEXT_STATE_PROPS, DEFAULT_FORM_VALUES] = useRecoilValue(formDataState);

    const { showError } = useNotification();
    const { openDialog } = useConfirmDialog();

    console.log('(Authorizable)', { form, queryResponse });

    // hook 查詢後端表單資訊
    const { execute: exQueryForm, pending } = useQueryFormById(response => {
        // 檢查澄清單內容是否已被異動並顯示提示
        if (response.form.timestamp !== form.timestamp) {
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

        const { form: { jsonData }, flowUserTask } = response; // 表單內容、使用者流程權限
        const formsetData = JSON.parse(jsonData); // 取出 json string 並轉為 object
        // const formsetData = testFormData; // 測試 formset data

        setReadOnly(false);
        setQueryResponse({ formsetData, flowUserTask });
    }, showError);

    // 查詢後端表單資訊
    useEffect(() => {
        if (isNewForm) {
            // 新增表單, 建立表單 meta data
            const _$ = createFormMetaData({ user }); // form meta data
            const defaultFormValues = computeValues(DEFAULT_FORM_VALUES, { _$ });
            let formsetData = { ...defaultFormValues, _$ };

            // 直接設定使用者表單權限為 EDIT
            let flowUserTask = { formPrivileges: ['EDIT'] };

            setQueryResponse({ formsetData, flowUserTask });
            setReadOnly(false);
        } else {
            // 非新增表單, 查詢後端表單相關資訊
            exQueryForm({ params: form.id });
        }

        // form 關閉時動作
        // return () => resetFormContext(); // 重置 FormContext state
    }, [isNewForm, form]);

    return children({ ...queryResponse, readOnly });
});