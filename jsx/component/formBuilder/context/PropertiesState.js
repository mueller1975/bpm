import { atom, selector, selectorFamily, atomFamily } from "recoil";

export const formPropertiesState = atom({
    key: 'formPropertiesState',
    default: {},
});

export const fieldPropertiesState = atom({
    key: 'fieldPropertiesState',
    default: {},
})