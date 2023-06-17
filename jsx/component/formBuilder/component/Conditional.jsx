import React, { useContext, useMemo } from 'react';
import { MPBFormContext } from '../context/MPBFormContext.jsx';
import { UserContext } from 'Context/UserContext.jsx';
import * as U from '../lib/formJsonUtils.js';

/**
 * 處理欄位狀態條件的元件
 */
export default React.memo(props => {
    const { formId, availableWhen, requiredWhen, disabledWhen, editableWhen, available: parentAvailable = true } = props;

    const { state: ctxState } = useContext(MPBFormContext);
    const { state: userState } = useContext(UserContext);

    // const availableWhenFunc = useMemo(() => availableWhen && new Function(['formState', 'ctxState', 'userState'], `return ${availableWhen}`), []);
    // const requiredWhenFunc = useMemo(() => requiredWhen && new Function(['formState', 'ctxState', 'userState'], `return ${requiredWhen}`), []);
    // const disabledWhenFunc = useMemo(() => disabledWhen && new Function(['formState', 'ctxState', 'userState'], `return ${disabledWhen}`), []);
    // const editableWhenFunc = useMemo(() => editableWhen && new Function(['ctxState', 'userState'], `return ${editableWhen}`), []);

    const availableWhenFunc = useMemo(() => availableWhen && new Function(['states', 'U'], `const {ctxState, formState, userState} = states; return ${availableWhen}`), []);
    const requiredWhenFunc = useMemo(() => requiredWhen && new Function(['states', 'U'], `const {ctxState, formState, userState} = states; return ${requiredWhen}`), []);
    const disabledWhenFunc = useMemo(() => disabledWhen && new Function(['states', 'U'], `const {ctxState, formState, userState} = states; return ${disabledWhen}`), []);
    const editableWhenFunc = useMemo(() => editableWhen && new Function(['states', 'U'], `const {ctxState, formState, userState} = states; return ${editableWhen}`), []);

    const formState = ctxState?.[formId];

    // const available = useMemo(() => parentAvailable && (!availableWhenFunc || availableWhenFunc(formState, ctxState, userState)), [ctxState, userState]);
    // const required = useMemo(() => props.required || (requiredWhenFunc && requiredWhenFunc(formState, ctxState, userState)), [ctxState, userState]);
    // const disabled = useMemo(() => props.disabled || (disabledWhenFunc && disabledWhenFunc(formState, ctxState, userState)), [ctxState, userState]);
    // const editable = useMemo(() => !editableWhenFunc || editableWhenFunc(ctxState, userState), [ctxState, userState]);

    const available = useMemo(() => parentAvailable && (!availableWhenFunc || availableWhenFunc({ ctxState, formState, userState }, U)), [ctxState, userState]);
    const required = useMemo(() => props.required || (requiredWhenFunc && requiredWhenFunc({ ctxState, formState, userState }, U)), [ctxState, userState]);
    const disabled = useMemo(() => props.disabled || (disabledWhenFunc && disabledWhenFunc({ ctxState, formState, userState }, U)), [ctxState, userState]);
    const editable = useMemo(() => !editableWhenFunc || editableWhenFunc({ ctxState, formState, userState }, U), [ctxState, userState]);

    // console.log('formId:', formId, ', editable:', editable)

    const renderProps = useMemo(() => ({ parentAvailable, available, required, disabled, editable }), [available, required, disabled, editable]);
    const children = typeof props.children == 'function' ? props.children(renderProps) : props.children;

    return children;
});