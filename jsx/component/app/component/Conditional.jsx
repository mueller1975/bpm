import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { formContextState, formState } from '../context/FormContextStates.js';
import { userState } from '../context/UserStates';
import * as U from '../lib/formJsonUtils.js';
import { flowUserTaskState } from '../context/UserStates';

/**
 * 處理欄位狀態條件的元件
 */
export default React.memo(props => {
    const { formId, name, availableWhen, requiredWhen, disabledWhen, editableWhen, available: parentAvailable = true } = props;

    const user = useRecoilValue(userState);
    const formContext = useRecoilValue(formContextState);
    const form = useRecoilValue(formState(formId));
    const flowUserTask = useRecoilValue(flowUserTaskState);

    const [availableWhenFunc, requiredWhenFunc, disabledWhenFunc, editableWhenFunc] = useMemo(() => {
        let availableWhenFunc = availableWhen && new Function(['states', 'U'], `const {ctxState, formState, userState, userTask} = states; return ${availableWhen}`);
        let requiredWhenFunc = requiredWhen && new Function(['states', 'U'], `const {ctxState, formState, userState, userTask} = states; return ${requiredWhen}`);
        let disabledWhenFunc = disabledWhen && new Function(['states', 'U'], `const {ctxState, formState, userState, userTask} = states; return ${disabledWhen}`);
        let editableWhenFunc = editableWhen && new Function(['states', 'U'], `const {ctxState, formState, userState, userTask} = states; return ${editableWhen}`);
        return [availableWhenFunc, requiredWhenFunc, disabledWhenFunc, editableWhenFunc];
    }, []);

    // const availableWhenFunc = useMemo(() => availableWhen && new Function(['states', 'U'], `const {ctxState, formState, userState} = states; return ${availableWhen}`), []);
    // const requiredWhenFunc = useMemo(() => requiredWhen && new Function(['states', 'U'], `const {ctxState, formState, userState} = states; return ${requiredWhen}`), []);
    // const disabledWhenFunc = useMemo(() => disabledWhen && new Function(['states', 'U'], `const {ctxState, formState, userState} = states; return ${disabledWhen}`), []);
    // const editableWhenFunc = useMemo(() => editableWhen && new Function(['states', 'U'], `const {ctxState, formState, userState} = states; return ${editableWhen}`), []);

    const [available, required, disabled, editable] = useMemo(() => {
        let available = parentAvailable && (!availableWhenFunc || availableWhenFunc({ ctxState: formContext, formState: form, userState: user, userTask: flowUserTask }, U));
        let required = Boolean(props.required || (requiredWhenFunc && requiredWhenFunc({ ctxState: formContext, formState: form, userState: user, userTask: flowUserTask }, U)));
        let disabled = Boolean(props.disabled || (disabledWhenFunc && disabledWhenFunc({ ctxState: formContext, formState: form, userState: user, userTask: flowUserTask }, U)));
        let editable = !editableWhenFunc || editableWhenFunc({ ctxState: formContext, formState: form, userState: user, userTask: flowUserTask }, U);
        return [available, required, disabled, editable];
    }, [parentAvailable, formContext, user]);

    // const available = useMemo(() => parentAvailable && (!availableWhenFunc || availableWhenFunc({ ctxState: formContext, formState: form, userState: user }, U)), [formContext, user]);
    // const required = useMemo(() => props.required || (requiredWhenFunc && requiredWhenFunc({ ctxState: formContext, formState: form, userState: user }, U)), [formContext, user]);
    // const disabled = useMemo(() => props.disabled || (disabledWhenFunc && disabledWhenFunc({ ctxState: formContext, formState: form, userState: user }, U)), [formContext, user]);
    // const editable = useMemo(() => !editableWhenFunc || editableWhenFunc({ ctxState: formContext, formState: form, userState: user }, U), [formContext, user]);

    // console.log('formId:', formId, ', editable:', editable)

    const renderProps = { available, required, disabled, editable };
    // console.log(`${formId}.${name}`, renderProps)

    const children = typeof props.children == 'function' ? props.children(renderProps) : props.children;
    return children;
});