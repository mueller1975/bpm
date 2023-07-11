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
import { Paper } from '@mui/material';
import AccordionForm from './AccordionForm.jsx';

// const AccordionForm = lazyWithRefForwarding(React.lazy(() => import("./AccordionForm.jsx")));

export default React.memo(styled(props => {
    const { mpbData: formData, readOnly, containerRef, onFormToggle,
        checkedForms, expandedForms, targetFormId, className } = props;

    const allForms = useRecoilValue(allFormsState);
    const allFormIds = useRecoilValue(allFormIdsState);

    const accordionRefs = useRef([]);

    console.log('###########', allForms, allFormIds)
    return allForms.map((form, index) => {
        const formId = form.id;

        if (formData) {
            // console.log('form', formId, 'DATA:', mpbData[formId]);
        }

        return (
            <AccordionForm key={form.uuid}
                form={form}
                readOnly={readOnly}
                ref={elm => accordionRefs.current[index] = elm}
                containerRef={containerRef}
                selected={formId == targetFormId}
                hidden={checkedForms.indexOf(formId) < 0}
                onChange={onFormToggle}
                expanded={expandedForms.indexOf(formId) > -1}

                data={formData?.[formId]}                
            />
        )
    });
})`

`);