import { styled } from '@mui/material/styles';
import React, { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import AccordionForm from './AccordionForm.jsx';
import { checkedFormsState, expandedFormsState, targetFormUUIDState } from './context/BuilderStates';
import { allFormsState } from './context/FormStates';

export default React.memo(styled(props => {
    const { refs, containerRef, className } = props;

    const allForms = useRecoilValue(allFormsState);
    const targetFormUUID = useRecoilValue(targetFormUUIDState);
    const [expandedForms, setExpandedForms] = useRecoilState(expandedFormsState);
    const checkedForms = useRecoilValue(checkedFormsState);

    // 展開/縮合個別 form
    const onToggleForm = useCallback((formUUID, expanded) => {
        let uuids = expanded ? expandedForms.concat(formUUID) :
            expandedForms.filter(uuid => formUUID != uuid);

        setExpandedForms(uuids);
    }, [expandedForms]);

    {/* 所有表單 accordion */ }
    const accordionForms = allForms.map((form, index) =>
        <AccordionForm key={form.uuid}
            uuid={form.uuid}
            ref={elm => refs.current[index] = elm}
            containerRef={containerRef}
            selected={form.uuid == targetFormUUID}
            checked={checkedForms.includes(form.uuid)}
            onChange={onToggleForm}
            expanded={expandedForms.includes(form.uuid)}
            form={form}
        />
    );

    return accordionForms;
})`

`);