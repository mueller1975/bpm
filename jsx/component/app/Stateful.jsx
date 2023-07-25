import React, { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { globalFormContextState } from './context/FormContextStates';
import { formDataState } from './context/FormStates';
import { flowUserTaskState } from './context/UserStates';
import { jsonToObject } from './lib/form';

export default React.memo(({ data, flowUserTask, children }) => {

    const setFlowUserTask = useSetRecoilState(flowUserTaskState);
    const [CONTEXT_STATE_PROPS, DEFAULT_FORM_VALUES] = useRecoilValue(formDataState);
    const setGlobalFormContext = useSetRecoilState(globalFormContextState);

    // 使用者流程權限資訊變更時動作
    useEffect(() => {
        console.log('(Stateful)', { flowUserTask });
        setFlowUserTask(flowUserTask); // 設定使用者流程權限 state
    }, [flowUserTask]);

    useEffect(() => {
        console.log("globalFormContextState 初始化開始...");

        if (data) {
            let globalFormCtx = { _$: data._$ }; // meta data 放到 globalFormContextState

            console.log('(Stateful)', { data, globalFormCtx });

            // 將設定 isContextStateProp / isMappedStateProp 為 true 且有值的欄位丟到 context
            Object.entries(CONTEXT_STATE_PROPS.forms).forEach(([formId, fields]) => {
                let formCtx = {};
                let formData = data[formId];

                fields.forEach(({ name }) => {
                    let value = formData?.[name];

                    if (value !== undefined) {
                        let value2 = jsonToObject(value); // value 如為 object 型態, 必須轉為物件才可丟到 context
                        value2 = value2 === '' ? null : value2; // 值如為空字串, 轉為 null
                        // console.log(name, ':', value, '=======>', value2);
                        formCtx[name] = value2;
                    }
                });

                globalFormCtx[formId] = formCtx;
            });

            console.log({ data, globalFormCtx })
            setGlobalFormContext(globalFormCtx);
        }
    }, [data]);

    return children({});
});