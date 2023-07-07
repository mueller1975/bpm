import { atom, selector, selectorFamily, atomFamily } from "recoil";

export const formPropertiesState = atom({
    key: 'formPropertiesState',
    default: {},
});

export const fieldsetPropertiesState = atom({
    key: 'fieldsetPropertiesState',
    default: [],
});

export const fieldPropertiesState = atom({
    key: 'fieldPropertiesState',
    default: [],
});

export const propertiesState = selectorFamily({
    key: 'propertiesState',
    get: type => ({ get }) => {
        switch (type) {
            case 'FORM':
                return get(formPropertiesState);
            case 'FIELDSET':
                return get(fieldsetPropertiesState);
            case 'FIELD':
                return get(fieldPropertiesState);
            default:
                throw `不援的 type [${type}]`;
        }
    },
    set: type => ({ get, set, reset }, newValue) => {
        switch (type) {
            case 'FORM':
                set(formPropertiesState, newValue);
                reset(fieldsetPropertiesState);
                reset(fieldPropertiesState);

                break;
            case 'FIELDSET':
                reset(formPropertiesState);
                set(fieldsetPropertiesState, newValue);
                reset(fieldPropertiesState);

                break;
            case 'FIELD':
                reset(formPropertiesState);
                reset(fieldsetPropertiesState);
                set(fieldPropertiesState, newValue);

                break;
            default:
                throw `不援的 type [${type}]`;
        }
    }
})