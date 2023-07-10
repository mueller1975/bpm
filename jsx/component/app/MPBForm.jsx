import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { SpringTransition2 } from 'Animations';
import AnimatedFab from 'Component/AnimatedFab.jsx';
import { ConfirmDialog, lazyWithRefForwarding, Loading } from 'Components';
import { useNotification } from 'Hook/useTools.jsx';
import { merge } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import ActionBar from './ActionBar.jsx';
import { formContextState } from './context/FormContextStates';
import { allFormIdsState, allFormsState, formDataState } from './context/FormStates';
import { flowUserTaskState, userState } from './context/UserStates';
import { getFormFieldValues, jsonToObject } from './lib/form';
import testFormData from './lib/testFormData.json';
import { useQueryFormById } from './lib/useFetchAPI';

const FormList = lazyWithRefForwarding(React.lazy(() => import("./FormList.jsx")));
const AccordionForm = lazyWithRefForwarding(React.lazy(() => import("./AccordionForm.jsx")));

export default React.memo(styled(React.forwardRef((props, ref) => {
    const { isNew, data, defaultData, onChange, className, fullScreen, readOnly = false, springRef } = props;

    const allForms = useRecoilValue(allFormsState);
    const allFormIds = useRecoilValue(allFormIdsState);

    const [mpbData, setMpbData] = useState();
    const [targetFormId, setTargetFormId] = useState();
    const [expandedForms, setExpandedForms] = useState([allFormIds[0]]); // 展開的 form
    const [checkedForms, setCheckedForms] = useState([...allFormIds]); // 勾選的 form
    const [alertDlgOpen, setAlertDlgOpen] = useState(false); // 告警 dialog 狀態

    const user = useRecoilValue(userState);
    const resetFormContext = useResetRecoilState(formContextState);
    const setFormContext = useSetRecoilState(formContextState);
    const setFlowUserTask = useSetRecoilState(flowUserTaskState);

    const [CONTEXT_STATE_PROPS, DEFAULT_FORM_VALUES] = useRecoilValue(formDataState);
    const accordionRefs = useRef([]);
    const containerRef = useRef();

    const { showError } = useNotification();

    // hook 查詢 MPB 澄清單
    const { execute: queryForm, pending } = useQueryFormById(result => {
        const { timestamp, flowUserTask } = result;
        timestamp != data.timestamp && setAlertDlgOpen(true); // 資料過時, 顯示告警

        flowUserTask(flowUserTask); // 設定使用者 user task 資訊
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
        return () => {
            resetFormContext; // 重置 FormContext state
        }
    }, []);

    useEffect(() => {
        // console.log('MPB NO.', data ? data.mpbNo : data)
        // console.log({ isNew, data, defaultData });
        // console.log({ CONTEXT_STATE_PROPS, DEFAULT_FORM_VALUES });
        let formData = {}; // 要塞到 form 欄位的值

        if (isNew) { // 新增 form            
            // defaultData 覆蓋欄位 defaultValue
            // Object.entries(DEFAULT_FORM_VALUES).forEach(([formId, fields]) => formData = { ...formData, [formId]: { ...fields, ...(defaultData?.[formId] ?? {}) } });
            formData = merge({}, DEFAULT_FORM_VALUES, defaultData);

            // 新 form 基本資訊
            let main = formData.main || {};
            formData.main = main;

            main.creator = user.empId; // 填寫人工號
            main.creatorName = user.name; // 填寫人姓名

            // 複製的澄清單 main form 欄位初始化
            if (main.approvalStatus == 'FORKED') {
                main.approvalStatus = 'FORKED'; // 審批狀態
                main.forkedMpbNo = main.mpbNo; // 複製來源的訂單澄清單號
                main.forkedMpbVersion = main.mpbVersion; // 複製來源的訂單澄清單版次
                main.mpbNo = ''; // 清空"訂單澄清單號"
                main.mpbVersion = ''; // 清空"版次"
                main.creationTime = ''; // 清空"建立日期"
                main.applyTime = ''; // 清空"提交日期"
            }

            // console.log('NEW:', { formData })
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
    }, [data]);

    // 關閉告警 dialog
    const closeAlertDlg = useCallback(() => setAlertDlgOpen(false), []);

    // 展開所有 form
    const collapseAll = useCallback(() => setExpandedForms([]), []);

    // 縮合所有 form
    const expandAll = useCallback(() => setExpandedForms([...allFormIds]), []);

    // Form List: check/uncheck all
    const checkAllHandler = useCallback((e, checked) => {
        checked ? setCheckedForms([...allFormIds]) : setCheckedForms([allFormIds[0]]); // 全不勾時, 保留勾選第一個 form
    }, []);

    // Form List: check/uncheck Form
    const formItemCheckHandler = useCallback((formId, checked) => {
        let ids = checked ? checkedForms.concat(formId) : checkedForms.filter(id => formId != id);
        setCheckedForms(ids.length == 0 ? [formId] : ids);
    }, [checkedForms]);

    // 展開/縮合個別 form
    const onToggleForm = useCallback((formId, expanded) => {
        let ids = expanded ? expandedForms.concat(formId) : expandedForms.filter(id => formId != id);
        setExpandedForms(ids);
    }, [expandedForms]);

    // Form List: click form 時, 自動 scroll 至該 form 位置
    const formItemClickedHandler = useCallback(formId => {
        let index = allFormIds.indexOf(formId);

        setTargetFormId(formId);

        // 自動展開點擊的 form
        if (expandedForms.indexOf(formId) < 0) {
            onToggleForm(formId, true);
        }

        accordionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' }); // scroll 至 form
        // setTimeout(() => setTargetFormId(undefined), 3000); // 移除 animation, 避免連續再按沒反應
    }, [onToggleForm]);

    // *** accordionForms 必須與其 default value (存於 mpbData) 一起 initialize
    // const accordionForms = !(isNew || mpbData) ? undefined : allForms.map((form, index) => {
    const accordionForms = useMemo(() => !mpbData ? <Loading message="MPB 資料載入中..." /> : allForms.map((form, index) => {
        // const { id, title, icon, components } = form;
        const formId = form.id;
        // console.log({ index, formId })

        if (mpbData) {
            // console.log('form', formId, 'DATA:', mpbData[formId]);
        }

        return (
            <AccordionForm key={formId}
                readOnly={readOnly}
                ref={elm => accordionRefs.current[index] = elm}
                containerRef={containerRef}
                selected={formId == targetFormId}
                hidden={checkedForms.indexOf(formId) < 0}
                onChange={onToggleForm}
                expanded={expandedForms.indexOf(formId) > -1}

                data={mpbData?.[formId]}
                {...form}
            />
        )
    }), [mpbData, checkedForms, expandedForms, targetFormId]);

    // console.log({ isNew, formComponents })

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

    const buttons = useMemo(() => [
        <AnimatedFab key="collapse" color="success" size="medium" onClick={collapseAll}><ExpandLessIcon color="inherit" /></AnimatedFab>,
        <AnimatedFab key="expand" color="primary" size="medium" onClick={expandAll}><ExpandMoreIcon color="inherit" /></AnimatedFab>
    ], []);

    return (
        <div ref={ref} className={`MT-MPBForm ${className}`}>
            {/* 告警 dialog */}
            <ConfirmDialog open={alertDlgOpen} title="資料過時警告" titleIcon={ErrorOutlineIcon} onConfirm={closeAlertDlg} confirmText="我知道了"
                severity="warn" content={['本 MPB 單資料內容已「被其他使用者異動」！', '請直接離開並「刷新列表資料」後再重新開啟本單。']} />

            {/* dialog 右下角 form component 全展開/縮合鈕 */}
            <ActionBar>
                <SpringTransition2 ref={springRef} effect="slideDown" items={buttons} keys={({ key }) => key} bounce={2}>
                    {button => button}
                </SpringTransition2>
            </ActionBar>

            {/* form list 區塊 */}
            <div className="menu">
                {/* form list */}
                <FormList className="list"
                    forms={allForms} checkedForms={checkedForms}
                    onItemCheck={formItemCheckHandler}
                    onItemClick={formItemClickedHandler}
                    onAllCheck={checkAllHandler}
                    onLoadData={loadTestMpbData} // 載入測試資料
                />
            </div>

            {/* all forms 區塊*/}
            <div className="content" ref={containerRef}>
                {
                    accordionForms
                }
            </div>
        </div>
    );
}))`
    &.MT-MPBForm {
        display: flex;
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

        .content {
            position: relative;
            width: 100%;
            flex-grow: 1;
            overflow: hidden auto;
            padding-right: 12px;
            padding-bottom: 30px;
        }
}
`);