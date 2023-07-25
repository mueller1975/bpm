import { atom, selector, selectorFamily } from "recoil";

export const globalFormContextState = atom({
    key: 'globalFormContextState',
    default: {},
});

export const formContextState = selectorFamily({
    key: 'formContextState',
    get: formId => ({ get }) => {
        const formContext = get(globalFormContextState);
        return formContext[formId];
    },
    set: formId => ({ get, set }, newValues) => {
        const formContext = get(globalFormContextState);
        const form = get(formContextState(formId));

        let newForm = { ...form, ...newValues };
        let newFormContext = { ...formContext, [formId]: newForm };

        set(globalFormContextState, newFormContext);
    }
});

export const formMetaState = selector({
    key: 'formMetaState',
    get: ({ get }) => get(formContextState('_$'))
});

export const formErrorsState = atom({
    key: 'formErrorsState',
    default: {}
});

export const formErrorState = selectorFamily({
    key: 'formErrorState',
    get: formId => ({ get }) => {
        const formErrors = get(formErrorsState);
        return formErrors[formId];
    },
    set: formId => ({ get, set }, newValues) => {
        const formErrors = get(formErrorsState);
        const formError = get(formContextState(formId));

        let newFormError = { ...formError, ...newValues };
        let newFormErrors = { ...formErrors, [formId]: newFormError };

        set(formErrorsState, newFormErrors);
    }
});