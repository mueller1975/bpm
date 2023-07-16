import { atom } from "recoil";

// FormList 中點擊的表單 UUID
export const targetFormUUIDState = atom({
    key: 'targetFormUUIDState',
    default: null
});

// FormContent 裡展開的 form accordion
export const expandedFormsState = atom({
    key: 'expandedForms',
    default: []
});