import { atom, selectorFamily } from "recoil";

export const formHierarchyState = atom({
    key: 'formHierarchyState',
    default: [],
});

export const fieldsetHierarchyState = atom({
    key: 'fieldsetHierarchyState',
    default: [],
});

export const fieldHierarchyState = atom({
    key: 'fieldHierarchyState',
    default: [],
});

export const propsHierarchyState = selectorFamily({
    key: 'propsHierarchyState',
    get: type => ({ get }) => {
        switch (type) {
            case 'FORM':
                return get(formHierarchyState);
            case 'FIELDSET':
                return get(fieldsetHierarchyState);
            case 'FIELD':
                return get(fieldHierarchyState);
            default:
                throw `不援的 type [${type}]`;
        }
    },
    set: type => ({ get, set, reset }, newValue) => {
        switch (type) {
            case 'FORM':
                set(formHierarchyState, newValue);
                reset(fieldsetHierarchyState);
                reset(fieldHierarchyState);
                break;
            case 'FIELDSET':
                reset(formHierarchyState);
                set(fieldsetHierarchyState, newValue);
                reset(fieldHierarchyState);
                break;
            case 'FIELD':
                reset(formHierarchyState);
                reset(fieldsetHierarchyState);
                set(fieldHierarchyState, newValue);
                break;
            case 'RESET_ALL':
                reset(formHierarchyState);
                reset(fieldsetHierarchyState);
                reset(fieldHierarchyState);
                break;
            default:
                throw `不援的 type [${type}]`;
        }
    }
});