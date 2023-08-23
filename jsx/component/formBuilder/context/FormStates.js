import { atom, selector, selectorFamily } from "recoil";
import { sortBy } from 'underscore';
import { v4 as uuidv4 } from 'uuid';
import { targetFormUUIDState } from "./BuilderStates";
import { propsHierarchyState } from "./PropsHierarchyState";

const MPB_FORMS_API = "http://localhost:86/bpm-service/service/config/mpbForms4Lab";
const FETCH_FORM_API = () => fetch(MPB_FORMS_API, { redirect: 'manual' });
const DEFAULT_ICON_NAME = "QuestionMarkIcon";
const DEFAULT_GRID_COLS = {
    xs: 12,
    sm: 6,
    md: 4,
    lg: 3
};

export const allFormsState = atom({
    key: "allFormsState",
    default: [],
    effects: [
        ({ setSelf, onSet }) => {
            let promise = FETCH_FORM_API();

            promise.then(async response => {
                let vo = await response.json();
                let forms = vo.data.map(({ value }) => value);

                forms = sortBy(forms, "order");
                setSelf(forms);

                console.info('取得 all forms:', forms);
            }).catch(error => {
                console.error('從後端取得表單設定失敗', error);
            }).finally(() => {

            });

            return promise;
        }
    ]
});

export const formState = selectorFamily({
    key: 'formState',
    get: ([formUUID]) => ({ get }) => {
        if (!formUUID) {
            console.warn(`[formState] GET =>`, { formUUID });
            return null;
        }

        const allForms = get(allFormsState);
        let form = allForms.find(({ uuid }) => uuid === formUUID);

        if (!form) {
            console.error('[formState] GET:', form);
        }
        return form;
    },
    set: ([formUUID]) => ({ set, get }, { afterUUID, form = {} }) => {
        let allForms = get(allFormsState);

        if (formUUID) { // 既有的 form 以 partial update 更新
            let idx = allForms.findIndex(({ uuid }) => uuid === formUUID);
            let oldForm = allForms[idx];
            form = { ...oldForm, ...form }; // partial update

            allForms = [...allForms];
            allForms[idx] = form;
        } else { // 新增的 form 傳入的 uuid 是 undefined
            form = {
                title: '新增表單', ...form, uuid: uuidv4(),
                icon: DEFAULT_ICON_NAME, components: []
            };

            if (!afterUUID) { // 未指定則放到第一個位置
                allForms = [form, ...allForms];
            } else {
                let afterIdx = allForms.findIndex(({ uuid }) => uuid === afterUUID);

                if (afterIdx < 0) {
                    throw `找不到指定 UUID [${afterUUID}] 的 Form`;
                } else {
                    allForms = [...allForms.slice(0, afterIdx + 1), form, ...allForms.slice(afterIdx + 1)];
                }
            }

            set(propsHierarchyState('FORM'), [form.uuid]); // 新增 form => 開啟 form 屬性編輯 accordion
            set(targetFormUUIDState, form.uuid); // 觸發 FormBuilder 自動點擊新增的表單
        }

        set(allFormsState, allForms);
    }
});

export const fieldsetState = selectorFamily({
    key: 'fieldsetState',
    get: ([formUUID, fieldsetUUID]) => ({ get }) => {

        if (!formUUID || !fieldsetUUID) {
            console.warn(`[fieldsetState] GET =>`, { formUUID, fieldsetUUID });
            return null;
        }

        let form = get(formState([formUUID]));
        return !form ? {} : form.components.find(({ uuid }) => uuid === fieldsetUUID);
    },
    set: ([formUUID, fieldsetUUID]) => ({ get, set }, { afterUUID, fieldset = {} }) => {
        let form = get(formState([formUUID]));

        if (!form) {
            console.warn(`[fieldsetState] SET => get(formState([formUUID])):`, form);
            return;
        }

        let components = form.components;

        if (fieldsetUUID) { // 既有的 fieldset 以 partial update 更新
            let idx = components.findIndex(({ uuid }) => uuid === fieldsetUUID);
            fieldset = { ...components[idx], ...fieldset };
            components = [...components];
            components[idx] = fieldset;
        } else { // 無 fieldsetUUID 值, 代表新增 fieldset
            fieldset = {
                ...fieldset, uuid: uuidv4(), type: 'fieldset',
                cols: DEFAULT_GRID_COLS, fields: []
            };

            if (!afterUUID) { // 未指定則放到第一個位置
                components = [fieldset, ...components];
            } else {
                let afterIdx = components.findIndex(({ uuid }) => uuid === afterUUID);

                if (afterIdx < 0) {
                    throw `找不到指定 UUID [${afterUUID}] 的 Fieldset`;
                } else {
                    components = [...components.slice(0, afterIdx + 1), fieldset, ...components.slice(afterIdx + 1)];
                }
            }

            set(propsHierarchyState('FIELDSET'), [formUUID, fieldset.uuid]); // 新增 fieldset => 開啟 fieldset 屬性編輯 accordion
        }

        set(formState([formUUID]), { form: { components } });
    },
});

export const fieldState = selectorFamily({
    key: 'fieldState',
    get: ([formUUID, fieldsetUUID, fieldUUID]) => ({ get }) => {
        console.log('[fieldState] GET hierarchy:', formUUID, fieldsetUUID, fieldUUID);

        if (!formUUID || !fieldsetUUID || !fieldUUID) {
            console.warn(`[fieldState] GET:`, { formUUID, fieldsetUUID, fieldUUID });
            return null;
        }

        let fieldset = get(fieldsetState([formUUID, fieldsetUUID]));
        let field = fieldset?.fields?.find(({ uuid }) => uuid === fieldUUID);

        if (!field) {
            console.error('[fieldState] GET field:', field);
        }

        return field;
    },
    set: ([formUUID, fieldsetUUID, fieldUUID]) => ({ get, set }, { afterUUID, field = {} }) => {
        let fieldset = get(fieldsetState([formUUID, fieldsetUUID]));

        if (!fieldset) {
            console.warn(`[fieldState] SET => fieldset:`, fieldset);
            return;
        }

        let fields = fieldset.fields;

        if (fieldUUID) { // 既有的 field 以 partial update 更新
            let idx = fields.findIndex(({ uuid }) => uuid === fieldUUID);
            // field = { ...fields[idx], ...field }; // 取消 partial update, 直接取代
            fields = [...fields];
            fields[idx] = field;
        } else { // 無 fieldUUID 值, 代表新增 field
            field = { label: '新增欄位', ...field, uuid: uuidv4() };

            if (!afterUUID) {  // 未指定則放到第一個位置
                fields = [field, ...fields];
            } else {
                let afterIdx = fields.findIndex(({ uuid }) => uuid === afterUUID);

                if (afterIdx < 0) {
                    throw `找不到指定 UUID [${afterUUID}] 的 Field`;
                } else {
                    fields = [...fields.slice(0, afterIdx + 1), field, ...fields.slice(afterIdx + 1)];
                }
            }

            set(propsHierarchyState('FIELD'), [formUUID, fieldsetUUID, field.uuid]); // 新增 field => 開啟 field 屬性編輯 accordion
        }

        set(fieldsetState([formUUID, fieldsetUUID]), { fieldset: { fields } });
    },
});

export const allFormIdsState = selector({
    key: 'allFormIds',
    get: ({ get }) => {
        const forms = get(allFormsState);
        return forms.map(({ id }) => id);
    }
});

export const allFormUUIDsState = selector({
    key: 'allFormUUIDs',
    get: ({ get }) => {
        const forms = get(allFormsState);
        return forms.map(({ uuid }) => uuid);
    }
});

export const formDataState = atom({
    key: 'formDataState',
    default: {}
});
