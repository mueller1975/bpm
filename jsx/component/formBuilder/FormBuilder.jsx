import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Divider, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import AnimatedFab from 'Component/AnimatedFab.jsx';
import Loading from 'Component/Loading.jsx';
import React, { Suspense, useCallback, useMemo, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import AccordionForm from './AccordionForm.jsx';
import FloatingActions from './FloatingActions.jsx';
import FormList from './FormList.jsx';
import PropertiesDrawer from './PropertiesDrawer.jsx';
import { allFormUUIDsState, allFormsState } from './context/FormStates.jsx';

export default React.memo(styled(React.forwardRef((props, ref) => {
    const { className, } = props;
    const allForms = useRecoilValue(allFormsState);
    const allFormUUIDs = useRecoilValue(allFormUUIDsState);

    const [targetFormUUID, setTargetFormUUID] = useState();
    const [expandedForms, setExpandedForms] = useState([allFormUUIDs[0]]); // 展開的 form
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerDocked, setDrawerDocked] = useState(true);

    const containerRef = useRef();
    const accordionRefs = useRef([]);

    console.log({ allForms })

    // 展開/縮合個別 form
    const onToggleForm = useCallback((formUUID, expanded) => {
        let uuids = expanded ? expandedForms.concat(formUUID) :
            expandedForms.filter(uuid => formUUID != uuid);
        setExpandedForms(uuids);
    }, [expandedForms]);

    // Form List: click form 時, 自動 scroll 至該 form 位置
    const formItemClickedHandler = useCallback(formUUID => {
        console.log({ formUUID })
        let index = allFormUUIDs.indexOf(formUUID);

        setTargetFormUUID(formUUID);

        // 自動展開點擊的 form
        if (expandedForms.indexOf(formUUID) < 0) {
            onToggleForm(formUUID, true);
        }

        accordionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' }); // scroll 至 form
        // setTimeout(() => setTargetFormId(undefined), 3000); // 移除 animation, 避免連續再按沒反應
    }, [allFormUUIDs, onToggleForm]);

    const drawerOpenHandler = useCallback(open => setDrawerOpen(open), []);
    const drawerDockHandler = useCallback(docked => setDrawerDocked(docked), []);

    const accordionForms = useMemo(() => allForms.map((form, index) => {
        // const { id, title, icon, components } = form;
        const formUUID = form.uuid;

        return (
            <AccordionForm key={formUUID}
                ref={elm => accordionRefs.current[index] = elm}
                containerRef={containerRef}
                selected={formUUID == targetFormUUID}
                onChange={onToggleForm}
                onCreate={formItemClickedHandler}
                expanded={expandedForms.indexOf(formUUID) > -1}
                form={form}
            />
        )
    }), [allForms, expandedForms, targetFormUUID, containerRef]);

    console.log({ accordionForms })

    // 展開所有 form
    const collapseAll = useCallback(() => setExpandedForms([]), []);

    // 縮合所有 form
    const expandAll = useCallback(() => setExpandedForms([...allFormUUIDs]), [allFormUUIDs]);

    const buttons = useMemo(() => [
        <AnimatedFab key="collapse" color="success" size="medium" onClick={collapseAll}><ExpandLessIcon color="inherit" /></AnimatedFab>,
        <AnimatedFab key="expand" color="primary" size="medium" onClick={expandAll}><ExpandMoreIcon color="inherit" /></AnimatedFab>
    ], [allFormUUIDs]);


    return (
        <Suspense fallback={<Loading />}>
            <Paper className={`MT-Form-Builder ${className}`}>

                {/* 表單列表區塊 */}
                <div className="menu">
                    <FormList className="list"
                        forms={allForms}
                        onItemClick={formItemClickedHandler}
                    />
                </div>

                {/* 左 Resizer */}
                <Divider orientation='vertical' className="resizer left" />

                {/* 所有表單內容 */}
                <div className="container" ref={containerRef}>
                    <div className="content">
                        {
                            accordionForms
                        }
                    </div>

                    {/* dialog 右下角 form component 全展開/縮合鈕 */}
                    <FloatingActions buttons={buttons} />
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
    &.MT-Form-Builder {
        display: flex;
        padding: 20px;
        height: 100%;
        box-sizing: border-box;
        // max-height: ${props => props.fullScreen ? '100%' : 'calc(100vh - 160px)'};
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

            .list {
                overflow: hidden auto;
            }
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