import { merge } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { formContextState } from './context/FormContextStates';
import { formDataState } from './context/FormStates';
import { flowUserTaskState, userState } from './context/UserStates';
import { computeValues, getInitialFormData } from './lib/form';
import { jsonToObject } from './lib/form';

export default React.memo(({ isNew, data, flowUserTask, children }) => {
    const [formData, setFormData] = useState(data);

    const setFlowUserTask = useSetRecoilState(flowUserTaskState);
    const [CONTEXT_STATE_PROPS, DEFAULT_FORM_VALUES] = useRecoilValue(formDataState);
    const setFormContext = useSetRecoilState(formContextState);
    const user = useRecoilValue(userState);

    console.log('(Stateful)', { formData });

    // 使用者流程權限資訊變更時動作
    useEffect(() => {
        console.log('(Stateful)', { flowUserTask });
        setFlowUserTask(flowUserTask); // 設定使用者流程權限 state
    }, [flowUserTask]);

    useEffect(() => {
        let data = {};
        let ctxState = {};

        if (isNew) {
            const _ = getInitialFormData({ user }); // 初始資料
            const defaultFormValues = computeValues(DEFAULT_FORM_VALUES, { _ });
            data = { ...defaultFormValues, _ };
        }

        ctxState._ = data._; // 初始資料放到 FormContextState

        console.log('(Stateful)', { data });

        console.log("FormContextState 初始化開始...");

        // 將設定 isContextStateProp / isMappedStateProp 為 true 且有值的欄位丟到 context
        Object.entries(CONTEXT_STATE_PROPS.forms).forEach(([formId, fields]) => {
            let formState = {};
            let defaultFormData = data[formId];

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
        setFormContext(ctxState);
        setFormData(data);
    }, [CONTEXT_STATE_PROPS, DEFAULT_FORM_VALUES])

    return children({ formData });
});