import { atom, selector, selectorFamily } from "recoil";

export const formContextState = atom({
    key: 'formContextState',
    default: {}
});

export const formErrorsState = atom({
    key: 'formErrorsState',
    default: {}
});

export const formState = selectorFamily({
    key: 'formState',
    get: formId => ({ get }) => {
        const formContext = get(formContextState);
        return formContext[formId];
    },
    set: formId => ({ get, set }, newValues) => {
        const formContext = get(formContextState);
        const form = get(formState(formId));

        let newForm = { ...form, ...newValues };
        let newFormContext = { ...formContext, [formId]: newForm };

        set(formContextState, newFormContext);
    }
});

export const formErrorState = selectorFamily({
    key: 'formErrorState',
    get: formId => ({ get }) => {
        const formErrors = get(formErrorsState);
        return formErrors[formId];
    },
    set: formId => ({ get, set }, newValues) => {
        const formErrors = get(formErrorsState);
        const formError = get(formState(formId));

        let newFormError = { ...formError, ...newValues };
        let newFormErrors = { ...formErrors, [formId]: newFormError };

        set(formErrorsState, newFormErrors);
    }
});