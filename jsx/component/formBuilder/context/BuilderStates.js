import { atom, selector } from "recoil";

// 表單清單狀態
export const formListState = atom({
    key: 'formListState',
    default: {
        collapsed: true
    }
});

// 表單清單縮合狀態
export const formListCollapsedSelector = selector({
    key: 'formListCollapsedSelector',
    get: ({ get }) => get(formListState).collapsed,
    set: ({ get, set }, collapsed) => set(formListState, { ...get(formListState), collapsed })
});

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

// 剛刪除的元件 UUID (form/fieldset/field)
// FormProperties/FieldsetProperties/FieldProperties 中若正編輯該元件, 則 reset
export const newlyDeletedUUIDState = atom({
    key: 'newlyDeletedUUIDState',
    default: null
})