import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { lazyWithRefForwarding, Loading } from 'Components';
import { useNotification } from 'Hook/useTools.jsx';
import React, { useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { expandedFormsState, targetFormUUIDState } from './context/BuilderStates';
import { allFormIdsState, allFormsState, allFormUUIDsState } from './context/FormStates';
import FormActions from './FormActions.jsx';
import FormContent from './FormContent.jsx';

const FormList = lazyWithRefForwarding(React.lazy(() => import("./FormList.jsx")));

export default React.memo(styled(React.forwardRef((props, ref) => {
    const { isNew, data, className, readOnly = false, springRef } = props;

    const allForms = useRecoilValue(allFormsState);
    const allFormIds = useRecoilValue(allFormIdsState);
    const allFormUUIDs = useRecoilValue(allFormUUIDsState);
    const targetFormUUID = useRecoilValue(targetFormUUIDState);
    const [expandedForms, setExpandedForms] = useRecoilState(expandedFormsState); // 展開的 form

    const accordionRefs = useRef([]); // 所有 form accordion 的 ref
    const containerRef = useRef(); // form content 的 container

    const { showError } = useNotification();

    // console.log({ CONTEXT_STATE_PROPS, DEFAULT_FORM_VALUES })

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

    return (
        <Paper ref={ref} className={`MT-CompositeForm ${className}`}>
            {/* form list 區塊 */}
            <div className="menu">
                <FormList forms={allForms} />
            </div>

            {/* all forms 區塊*/}
            <div className="container" ref={containerRef}>
                <div className="content">
                    {
                        !data ? <Loading message="MPB 資料載入中..." /> :
                            <FormContent refs={accordionRefs} containerRef={containerRef}
                                data={data} readOnly={readOnly} />
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