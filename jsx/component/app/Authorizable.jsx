import { useConfirmDialog } from 'Context/ConfirmDialogContext.jsx';
import { useNotification } from 'Hook/useTools.jsx';
import React, { useEffect, useState } from 'react';
import { useQueryFormById } from './lib/useFetchAPI';

/**
 * 查詢表單資訊
 */
export default React.memo(({ data, children }) => {

    const { showError } = useNotification();
    const { openDialog, closeDialog } = useConfirmDialog();
    const [readOnly, setReadOnly] = useState(true); // 表單唯讀
    const [formResponse, setFormResponse] = useState({});
    const { form, flowUserTask } = formResponse;

    console.log('【Authorizable】', data);

    // hook 取得表單資訊
    const { execute: queryForm, pending } = useQueryFormById(response => {
        let editNotAllowed = false;

        // 資料過時, 顯示告警
        if (response.form.timestamp !== data.timestamp) {
            editNotAllowed = true; // 禁止編輯表單內容

            openDialog({
                title: '資料過時警告',
                confirmText: '我知道了',
                severity: 'warn',
                content: [
                    '本 MPB 單資料內容已「被其他使用者異動」！',
                    '請直接離開並「刷新列表資料」後再重新開啟本單。'
                ]
            });
        }

        setReadOnly(editNotAllowed);
        setFormResponse(response);
    }, showError);

    // 查詢表單資訊
    useEffect(() => {
        if (!data.id) {
            // 尚未儲存文件, 直接設定使用者表單權限為 EDIT
            let flowUserTask = { formPrivileges: ['EDIT'] };
            setFormResponse({ form: {}, flowUserTask });
        } else {
            // 非未保存文件, 檢查澄清單內容是否已被異動 & 查詢使用者表單權限
            queryForm({ params: data.id });
        }

        // form 關閉時動作
        // return () => resetFormContext(); // 重置 FormContext state
    }, []);

    return children({ form, flowUserTask, readOnly });
});