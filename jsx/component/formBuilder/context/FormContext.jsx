import React, { createContext, useEffect, useReducer } from 'react';
import { useResponseVO } from 'Hook/useTools.jsx';
import * as FormIcons from '../lib/formIcons';
import { sortBy } from 'underscore';

const MPB_FORMS_API = "./service/config/mpbForms4Lab";
const FETCH_FORM_API = () => fetch(MPB_FORMS_API, { redirect: 'manual' });
const initialState = { forms: [], fetching: false };

export const RESET = 'RESET', SET = 'SET', UPDATE_FORM = 'UPDATE_FORM';

const reducer = (state, action) => {
    const { type, payload } = action;

    switch (type) {
        case RESET: // reset state
            return { ...initialState };
        case SET: // set state
            return payload;
        case UPDATE_FORM: // 更新 form
            let formIndex = state.forms.find(form => form.id === payload.id);
            state.forms[formIndex] = payload;
            return { ...state, forms: [...state.forms] };
        default:
            throw new Error(`未支援的 FormContext action type: ${type}`);
    }
}

export const FormContext = createContext();

export const FormContextProvider = props => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { execute: fetchForms, pending: fetching, value: fetchedForms, error: fetchError } = useResponseVO(FETCH_FORM_API, { immediate: true });

    useEffect(() => {
        if (fetchError) {
            throw fetchError;
        }

        if (fetchedForms) {
            console.log("forms:",{fetchedForms})
            let forms = fetchedForms.map(({ value }) => ({ ...value, icon: FormIcons[value.icon] ?? FormIcons['HelpOutlineIcon'] }));
            forms = sortBy(forms, "order");

            let payload = { forms, fetching };
            dispatch({ type: 'SET', payload });
        }
    }, [fetchedForms, fetchError]);

    console.log('FormContextProvider......')

    return (
        <FormContext.Provider value={{ state, dispatch }}>
            {props.children}
        </FormContext.Provider>
    );
};