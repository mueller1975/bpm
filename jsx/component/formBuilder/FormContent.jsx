import { styled } from '@mui/material/styles';
import React, { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import AccordionForm from './AccordionForm.jsx';
import AddComponentButton from './AddComponentButton.jsx';
import { expandedFormsState, targetFormUUIDState } from './context/BuilderStates';
import { allFormsState } from './context/FormStates';

export default React.memo(styled(props => {
    const { refs, containerRef, onAdd, onCreate, className } = props;

    const allForms = useRecoilValue(allFormsState);
    const targetFormUUID = useRecoilValue(targetFormUUIDState);
    const [expandedForms, setExpandedForms] = useRecoilState(expandedFormsState);

    // 展開/縮合個別 form
    const onToggleForm = useCallback((formUUID, expanded) => {
        let uuids = expanded ? expandedForms.concat(formUUID) :
            expandedForms.filter(uuid => formUUID != uuid);

        setExpandedForms(uuids);
    }, [expandedForms]);

    return allForms.map((form, index) =>
        <React.Fragment key={form.uuid}>
            {/* 表單 accordion */}
            <AccordionForm
                uuid={form.uuid}
                ref={elm => refs.current[index] = elm}
                containerRef={containerRef}
                selected={form.uuid == targetFormUUID}
                onChange={onToggleForm}
                onCreate={onCreate}
                expanded={expandedForms.indexOf(form.uuid) > -1}
                form={form}
            />

            {/* 插入新表單按鈕 */}
            <AddComponentButton className="add-button" onClick={e => onAdd(e, form.uuid)} />
        </React.Fragment>
    );
})`

`);