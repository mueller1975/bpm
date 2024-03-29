import { Divider, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import Loading from 'Component/Loading.jsx';
import React, { Suspense, useCallback, useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import FormActions from './FormActions.jsx';
import FormContent from './FormContent.jsx';
import FormList from './FormList.jsx';
import PropertiesDrawer from './PropertiesDrawer.jsx';
import {
    expandedFormsState, propertiesDrawerState, targetFormUUIDState
} from './context/BuilderStates';
import { allFormUUIDsState, allFormsState, formState } from './context/FormStates';
import { propsHierarchyState } from "./context/PropsHierarchyState.js";

export default React.memo(styled(React.forwardRef((props, ref) => {
    const { className } = props;

    const allForms = useRecoilValue(allFormsState); // 所有表單
    const allFormUUIDs = useRecoilValue(allFormUUIDsState); // 所有表單 UUID
    const setFormHierarchy = useSetRecoilState(propsHierarchyState('FORM')); // 屬性編輯 form hierarchy ([form uuid])
    const targetFormUUID = useRecoilValue(targetFormUUIDState); // 點擊的 form uuid
    const [expandedForms, setExpandedForms] = useRecoilState(expandedFormsState); // 展開狀態的 form uuid
    const [drawerState, setDrawerState] = useRecoilState(propertiesDrawerState); // 屬性編輯 drawer 狀態
    const createForm = useSetRecoilState(formState([])); // formState() 帶空 array 參數值則為新增 form

    const containerRef = useRef();
    const accordionRefs = useRef([]);

    // targetFormUUID 變更時動作
    useEffect(() => {
        if (targetFormUUID) {
            // 1. 開啟編輯 form 屬性 accordion
            setFormHierarchy([targetFormUUID]);

            // 2. 自動展開點擊的 form
            if (!expandedForms.includes(targetFormUUID)) {
                setExpandedForms([...expandedForms, targetFormUUID]);
            }

            // 3. 自動 scroll 至 form
            let index = allFormUUIDs.indexOf(targetFormUUID);
            let elm = accordionRefs.current[index];
            elm.scrollIntoView({ behavior: 'smooth' });
        }
    }, [targetFormUUID]);

    // 新增表單
    const addForm = useCallback((e, afterUUID) => {
        e.stopPropagation();
        createForm({ afterUUID });
    }, []);

    const drawerOpenHandler = useCallback(open => setDrawerState({ open, docked: false }), []);
    const drawerDockHandler = useCallback(docked => setDrawerState({ open: docked, docked }), []);

    return (
        <Suspense fallback={<Loading />}>
            <Paper className={`MT-FormBuilder ${className}`}>

                {/* 表單列表區塊 */}
                <div className="menu">
                    <FormList forms={allForms} />
                </div>

                {/* 左 Resizer */}
                <Divider orientation='vertical' className="resizer left" />

                {/* 所有表單區塊 */}
                <div className="container" ref={containerRef}>
                    {/* 所有表單內容 */}
                    <div className="content">
                        <FormContent refs={accordionRefs} containerRef={containerRef}
                            onAdd={addForm} />
                    </div>

                    {/* dialog 右下角 form component 全展開/縮合鈕 */}
                    <FormActions className="actions" />
                </div>

                {/* 右 Resizer */
                    !drawerState.docked ? null : <Divider orientation='vertical' className="resizer right" />
                }

                {/* 屬性編輯區塊 */}
                <PropertiesDrawer className="drawer" open={drawerState.open} docked={drawerState.docked}
                    onOpen={drawerOpenHandler} onDock={drawerDockHandler} />
            </Paper>
        </Suspense>
    );
}))`
    &.MT-FormBuilder {
        display: flex;
        padding: 20px;
        height: 100%;
        box-sizing: border-box;
        background-color: rgba(52, 58, 78, 0.87);

        >.resizer {
            user-select: none;
            border-width: 0;
            border-color: transparent;
            width: 6px;

            :hover {
                border-color: lightgray;
                border-style: dotted;
                cursor: col-resize;
            }

            &.left {
                margin: 0px 8px 0 8px;
                border-right-width: 2px;
            }
            
            &.right {
                margin: 0 2px 0 0;
                border-left-width: 2px;
            }
        }
        
        >.menu {
            display: flex;
            flex-direction: column;
            padding-bottom: 12px;    
        }

        >.MuiAppBar-root {
            background-color: rgb(39 59 96 / 40%);
        }
    
        >.toolbar {
            justify-content: flex-end;
            padding-left: 5px;
            padding-right: 5px;
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
                z-index: 4;
                right: 24px;
                bottom: 8px;
            }
        }
        
    }
`);