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

const FormList = lazyWithRefForwarding(React.lazy(() => import("./FormList.jsx")));

export default React.memo(styled(React.forwardRef((props, ref) => {
    const { isNew, data, defaultData, onChange, className, fullScreen, readOnly = false, springRef } = props;

    const allForms = useRecoilValue(allFormsState);
    const allFormIds = useRecoilValue(allFormIdsState);
    const allFormUUIDs = useRecoilValue(allFormUUIDsState);
    const targetFormUUID = useRecoilValue(targetFormUUIDState);
    const [expandedForms, setExpandedForms] = useRecoilState(expandedFormsState); // 展開的 form
    const user = useRecoilValue(userState);
    const resetFormContext = useResetRecoilState(formContextState);
    const setFormContext = useSetRecoilState(formContextState);
    const setFlowUserTask = useSetRecoilState(flowUserTaskState);

    const [alertDlgOpen, setAlertDlgOpen] = useState(false); // 告警 dialog 狀態
    const [mpbData, setMpbData] = useState();

    const [CONTEXT_STATE_PROPS, DEFAULT_FORM_VALUES] = useRecoilValue(formDataState);
    const accordionRefs = useRef([]);
    const containerRef = useRef();

    const { showError } = useNotification();

    console.log({ CONTEXT_STATE_PROPS, DEFAULT_FORM_VALUES })

    // targetFormUUID 變更時動作
    useEffect(() => {
        if (targetFormUUID) {
            // 1. 自動展開點擊的 form
            if (!expandedForms.includes(targetFormUUID)) {
                setExpandedForms([...expandedForms, targetFormUUID]);
            }

            // 2. 自動 scroll 至 form
            let index = allFormUUIDs.indexOf(targetFormUUID);
            let elm = accordionRefs.current[index];
            elm.scrollIntoView({ behavior: 'smooth' });
        }
    }, [targetFormUUID]);

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

    useEffect(() => {
        // console.log('MPB NO.', data ? data.mpbNo : data)
        // console.log({ isNew, data, defaultData });
        // console.log({ CONTEXT_STATE_PROPS, DEFAULT_FORM_VALUES });


        console.log({ user })
        let formData = {}; // 要塞到 form 欄位的值

        if (isNew) { // 新增 form            
            // defaultData 覆蓋欄位 defaultValue
            // Object.entries(DEFAULT_FORM_VALUES).forEach(([formId, fields]) => formData = { ...formData, [formId]: { ...fields, ...(defaultData?.[formId] ?? {}) } });
            formData = merge({}, DEFAULT_FORM_VALUES, defaultData);

            // 新 form 基本資訊
            formData._ = getInitialFormData({ user });
            console.log('NEW:', { formData })
        } else { // 開啟已存檔的 form
            formData = JSON.parse(data.mpbData);
            // console.log(mpbData ? mpbData.mpbNo : mpbData, '=>', data.mpbNo);
        }

        // 將設定 isContextStateProp / isMappedStateProp 為 true 且有值的欄位丟到 context
        let ctxState = {};
        console.log("MPB Context State 初始化開始...");

        Object.entries(CONTEXT_STATE_PROPS.forms).forEach(([formId, fields]) => {
            let formState = {};
            let defaultFormData = formData?.[formId];

            fields.forEach(({ name, type, defaultValue }) => {
                let value = defaultFormData?.[name];

                if (value !== undefined) {
                    let value2 = jsonToObject(value); // value 如為 object 型態, 必須轉為物件才可丟到 context
                    value2 = value2 === '' ? null : value2; // 值如為空字串, 轉為 null
                    // console.log(name, ':', value, '=======>', value2);
                    formState[name] = value2;
                }
            });

            ctxState[formId] = formState;
        });

        console.log({ ctxState, formData })
        setMpbData(formData);
        setFormContext(ctxState);

        console.log('**** MPB Context State dispatched:', { mpbCtxState: ctxState })
    }, [user, data]);

    // 關閉告警 dialog
    const closeAlertDlg = useCallback(() => setAlertDlgOpen(false), []);

    // 載入測試資料
    const loadTestMpbData = useCallback(() => {
        // 保存原來 main form 裡的資料 (因含表單狀態及申請、填寫人資訊)
        const { values: main } = getFormFieldValues("main");
        console.log({ main })
        setMpbData()

        setTimeout(() => {
            setMpbData({ main, ...testFormData });
        });
    }, []);

    return (
        <Paper ref={ref} className={`MT-CompositeForm ${className}`}>
            {/* 告警 dialog */}
            <ConfirmDialog open={alertDlgOpen} title="資料過時警告" titleIcon={ErrorOutlineIcon} onConfirm={closeAlertDlg} confirmText="我知道了"
                severity="warn" content={['本 MPB 單資料內容已「被其他使用者異動」！', '請直接離開並「刷新列表資料」後再重新開啟本單。']} />

            {/* form list 區塊 */}
            <div className="menu">
                {/* form list */}
                <FormList forms={allForms}
                    onLoadData={loadTestMpbData} // 載入測試資料
                />
            </div>

            {/* all forms 區塊*/}
            <div className="container" ref={containerRef}>
                <div className="content">
                    {
                        !mpbData ? <Loading message="MPB 資料載入中..." /> :
                            <FormContent refs={accordionRefs} containerRef={containerRef}
                                formData={mpbData} readOnly={readOnly} />
                    }
                </div>

                {/* dialog 右下角 form component 全展開/縮合鈕 */}
                <FormActions ref={springRef} className="actions" />
            </div>
        </Paper>
    );
}))`
    &.MT-CompositeForm {
        display: flex;
        gap: 20px;
        padding: 20px;
        height: 100%;
        box-sizing: border-box;
        background-color: rgba(52, 58, 78, 0.87);

        .menu {
            display: flex;
            flex-direction: column;
            padding-bottom: 12px;
            // padding-bottom: 6px;
        }

        .MuiAppBar-root {
            background-color: rgb(39 59 96 / 40%);
        }

        .toolbar {
            justify-content: flex-end;
            padding-left: 5px;
            padding-right: 5px;
        }
        
        .list {
            overflow: hidden auto;
        }

        >.container {
            flex-grow: 1;
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;

            >.content {
                width: 100%;
                height: 100%;                
                overflow: hidden auto;
                padding-right: 12px;
                padding-bottom: 30px;
                box-sizing: border-box;
            }

            >.actions {
                position: absolute;
                right: 24px;
                bottom: 8px;
            }
        }
}
`);