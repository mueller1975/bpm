import { styled } from '@mui/material/styles';
import React, { Suspense, useCallback, useMemo, useRef, useState } from 'react';
// import Form from './Form.jsx';
import { Paper } from '@mui/material';
import Loading from 'Component/Loading.jsx';
import { useRecoilValue } from 'recoil';
import AccordionForm from './AccordionForm.jsx';
import { allFormsState, allFormIdsState } from './context/FormStates.jsx';
import FormList from './FormList.jsx';
import PropertiesDrawer from './PropertiesDrawer.jsx';

export default React.memo(styled(React.forwardRef((props, ref) => {
    const { className, } = props;
    const allForms = useRecoilValue(allFormsState);
    const allFormIds = useRecoilValue(allFormIdsState);
    const [targetFormId, setTargetFormId] = useState();
    const [expandedForms, setExpandedForms] = useState([allFormIds[0]]); // 展開的 form

    const containerRef = useRef();
    const accordionRefs = useRef([]);

    console.log({ allForms })

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

    const accordionForms = useMemo(() => allForms.map((form, index) => {
        // const { id, title, icon, components } = form;
        const formId = form.id;

        return (
            <AccordionForm key={formId}
                ref={elm => accordionRefs.current[index] = elm}
                containerRef={containerRef}
                selected={formId == targetFormId}
                onChange={onToggleForm}
                expanded={expandedForms.indexOf(formId) > -1}

                // data={mpbData?.[formId]}
                {...form}
            />
        )
    }), [allForms, expandedForms, targetFormId, containerRef]);

    console.log({ accordionForms })

    return (
        <Suspense fallback={<Loading />}>
            <Paper className={`MT-Form-Builder ${className}`}>

                {/* form list 區塊 */}
                <div className="menu">
                    <FormList className="list"
                        forms={allForms}
                        onItemClick={formItemClickedHandler}
                    />
                </div>

                {/* all forms 區塊*/}
                <div className="content" ref={containerRef}>
                    {
                        accordionForms
                    }
                </div>

                <PropertiesDrawer />
            </Paper>
        </Suspense>
    );
}))`
    &.MT-Form-Builder {
        display: flex;
        padding: 20px;
        gap: 20px;
        height: 100%;
        box-sizing: border-box;
        // max-height: ${props => props.fullScreen ? '100%' : 'calc(100vh - 160px)'};
        background-color: rgba(52, 58, 78, 0.87);

        .menu {
            display: flex;
            flex-direction: column;
            padding-bottom: 12px;    
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