import { atom } from "recoil";

// 屬性 drawer 狀態
export const propertiesDrawerState = atom({
    key: 'propertiesDrawerState',
    default: {
        open: false,
        docked: true
    }
});

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

// 新建立的表單 UUID
// 在 FormState 中, 當表單新增後, 將新增表單的 UUID 寫入此 state
export const newlyCreatedFormUUIDState = atom({
    key: 'newlyCreatedFormUUIDState',
    default: null
});

// 剛刪除的元件 UUID (form/fieldset/field)
// FormProperties/FieldsetProperties/FieldProperties 中若正編輯該元件, 則 reset
export const newlyDeletedUUIDState = atom({
    key: 'newlyDeletedUUIDState',
    default: null
})