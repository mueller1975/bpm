import { Divider, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import Loading from 'Component/Loading.jsx';
import React, { Suspense, useCallback, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import AddComponentButton from './AddComponentButton.jsx';
import BuilderActions from './BuilderActions.jsx';
import FormContent from './FormContent.jsx';
import FormList from './FormList.jsx';
import PropertiesDrawer from './PropertiesDrawer.jsx';
import { expandedFormsState, targetFormUUIDState } from './context/BuilderStates';
import { allFormUUIDsState, allFormsState, formState } from './context/FormStates';
import { propertiesState } from "./context/PropertiesState";

export default React.memo(styled(React.forwardRef((props, ref) => {
    const { className, } = props;
    const allForms = useRecoilValue(allFormsState);
    const allFormUUIDs = useRecoilValue(allFormUUIDsState);
    const setFormProperties = useSetRecoilState(propertiesState('FORM'));

    const setTargetFormUUID = useSetRecoilState(targetFormUUIDState);
    const [expandedForms, setExpandedForms] = useRecoilState(expandedFormsState);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerDocked, setDrawerDocked] = useState(true);

    const createFormState = useSetRecoilState(formState()); // formState() 不帶參數 uuid 值則為新增 form

    const containerRef = useRef();
    const accordionRefs = useRef([]);

    console.log({ allForms })

    // 新增表單
    const addForm = useCallback((e, afterFormUUID) => {
        console.log('add form......')
        e.stopPropagation();
        createFormState({ afterFormUUID, form: {} });
    });

    // Form List: click form 時, 自動 scroll 至該 form 位置
    const formItemClickedHandler = useCallback(formUUID => {
        console.log({ formUUID })
        setFormProperties({ uuid: formUUID, inputFocused: false }); // inputFocused: 是否立即 focus 在屬性欄位

        let index = allFormUUIDs.indexOf(formUUID);

        console.log({ index })
        setTargetFormUUID(formUUID);

        // 自動展開點擊的 form
        if (expandedForms.indexOf(formUUID) < 0) {
            setExpandedForms([...expandedForms, formUUID]);
        }

        let elm = accordionRefs.current[index];
        elm.scrollIntoView({ behavior: 'smooth' }); // scroll 至 form
        // setTimeout(() => setTargetFormId(undefined), 3000); // 移除 animation, 避免連續再按沒反應
    }, [allFormUUIDs, expandedForms]);

    const drawerOpenHandler = useCallback(open => setDrawerOpen(open), []);
    const drawerDockHandler = useCallback(docked => setDrawerDocked(docked), []);

    return (
        <Suspense fallback={<Loading />}>
            <Paper className={`MT-FormBuilder ${className}`}>

                {/* 表單列表區塊 */}
                <div className="menu">
                    <FormList forms={allForms} onItemClick={formItemClickedHandler} />
                </div>

                {/* 左 Resizer */}
                <Divider orientation='vertical' className="resizer left" />

                {/* 所有表單內容 */}
                <div className="container" ref={containerRef}>
                    <div className="content">
                        {/* 插入新表單按鈕 */}
                        <AddComponentButton onClick={addForm} />

                        {/* 所有表單 */}
                        <FormContent refs={accordionRefs} containerRef={containerRef}
                            onAdd={addForm} onCreate={formItemClickedHandler} />
                    </div>

                    {/* dialog 右下角 form component 全展開/縮合鈕 */}
                    <BuilderActions />
                </div>

                {/* 右 Resizer */
                    !drawerDocked ? null : <Divider orientation='vertical' className="resizer right" />
                }

                {/* 屬性編輯區塊 */}
                <PropertiesDrawer className="drawer" open={drawerOpen} docked={drawerDocked}
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
        }
        
    }
`);