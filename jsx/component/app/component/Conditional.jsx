import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { globalFormContextState, formContextState, formMetaState } from '../context/FormContextStates.js';
import { userState } from '../context/UserStates';
import * as U from '../lib/formJsonUtils.js';
import { flowUserTaskState } from '../context/UserStates';

/**
 * 處理欄位狀態條件的元件
 */
export default React.memo(props => {
    const { formId, name, availableWhen, requiredWhen, disabledWhen, editableWhen, available: parentAvailable = true } = props;

    const _g = useRecoilValue(globalFormContextState);
    const _$ = useRecoilValue(formMetaState) ?? {};
    const _ = useRecoilValue(formContextState(formId)) ?? {};
    const _u = useRecoilValue(userState) ?? {};
    const _t = useRecoilValue(flowUserTaskState) ?? {};

    const [availableWhenFunc, requiredWhenFunc, disabledWhenFunc, editableWhenFunc] = useMemo(() => {
        let availableWhenFunc = availableWhen && new Function(['states', 'U'], `const {_g, _$, _, _u, _t} = states; return ${availableWhen}`);
        let requiredWhenFunc = requiredWhen && new Function(['states', 'U'], `const {_g, _$, _, _u, _t} = states; return ${requiredWhen}`);
        let disabledWhenFunc = disabledWhen && new Function(['states', 'U'], `const {_g, _$, _, _u, _t} = states; return ${disabledWhen}`);
        let editableWhenFunc = editableWhen && new Function(['states', 'U'], `const const {_g, _$, _, _u, _t} = states; return ${editableWhen}`);
        return [availableWhenFunc, requiredWhenFunc, disabledWhenFunc, editableWhenFunc];
    }, []);

    const [available, required, disabled, editable] = useMemo(() => {
        let available = parentAvailable && (!availableWhenFunc || availableWhenFunc({ _g, _$, _, _u, _t }, U));
        let required = Boolean(props.required || (requiredWhenFunc && requiredWhenFunc({ _g, _$, _, _u, _t }, U)));
        let disabled = Boolean(props.disabled || (disabledWhenFunc && disabledWhenFunc({ _g, _$, _, _u, _t }, U)));
        let editable = !editableWhenFunc || editableWhenFunc({ _g, _$, _, _u, _t }, U);
        return [available, required, disabled, editable];
    }, [parentAvailable, _g, _u, _t]);

    const renderProps = { available, required, disabled, editable };

    // console.log(`${formId}.${name}`, renderProps)

    const children = typeof props.children == 'function' ? props.children(renderProps) : props.children;
    return children;
});