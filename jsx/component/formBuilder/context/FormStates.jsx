import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { atom, selector, selectorFamily, atomFamily } from "recoil";
import { sortBy } from 'underscore';
import { v4 as uuidv4 } from 'uuid';
import * as FormIcons from '../lib/formIcons';
import { flattenFormComponents } from '../lib/form';

const MPB_FORMS_API = "./service/config/mpbForms4Lab";
const FETCH_FORM_API = () => fetch(MPB_FORMS_API, { redirect: 'manual' });

export const allFormsState = atom({
    key: "allFormsState",
    default: [],
    effects: [
        ({ setSelf, onSet }) => {
            let promise = FETCH_FORM_API();

            promise.then(async response => {
                let vo = await response.json();

                let forms = vo.data.map(({ value }) => ({
                    ...value,
                    icon: FormIcons[value.icon] ?? FormIcons['HelpOutlineIcon']
                }));

                forms = sortBy(forms, "order");
                setSelf(forms);

                console.info('取得 all forms:', forms);
            }).catch(error => {

            }).finally(() => {

            });

            return promise;
        }
    ]
});

export const allFormMapState = selector({
    key: 'allFormMapState',
    get: ({ get }) => {
        console.log('GET allFormMapState...........');

        const allForms = get(allFormsState);
        const formMap = {};

    }
});

export const formState = selectorFamily({
    key: 'formState',
    get: uuid => ({ get }) => {
        console.warn('[formState] GET:', uuid);
        const allForms = get(allFormsState);
        return allForms.find(form => form.uuid === uuid);
    },
    set: uuid => ({ set, get }, { afterFormUUID, form }) => {
        console.warn('[formState] SET: uuid =>', uuid);
        console.warn('[formState] SET:', { afterFormUUID, form });

        let allForms = get(allFormsState);

        if (uuid) { // 既有的 form 以 partial update 更新
            let idx = allForms.findIndex(f => f.uuid === uuid);
            let oldForm = allForms[idx];
            form = { ...oldForm, ...form }; // partial update

            allForms = [...allForms];
            allForms[idx] = form;
        } else { // 新增的 form 傳入的 uuid 是 undefined
            form.uuid = uuidv4();
            form.order = allForms.length + 1;
            form.icon = QuestionMarkIcon;
            form.components = [];

            if (!afterFormUUID) { // 未指定則放到第一個位置
                allForms = [form, ...allForms];
            } else {
                let afterIdx = allForms.findIndex(f => f.uuid === afterFormUUID);

                if (afterIdx < 0) {
                    throw `找不到指定 UUID [${afterFormUUID}] 的 Form`;
                } else {
                    allForms = [...allForms.slice(0, afterIdx + 1), form, ...allForms.slice(afterIdx + 1)];
                }
            }
        }

        set(allFormsState, allForms);
    }
});

export const fieldsetState = selectorFamily({
    key: 'fieldsetState',
    get: ([formUUID, fieldsetUUID]) => ({ get }) => {
        if (!formUUID || !fieldsetUUID) {
            return {};
        }

        let form = get(formState(formUUID));
        console.log('[fieldsetState] GET:', form);
        let fieldset = form.components.find(({ uuid }) => uuid === fieldsetUUID);
        return fieldset;
    },
    set: ([formUUID, fieldsetUUID]) => ({ get, set }, newFieldset) => {
        let form = get(formState(formUUID));
        // console.log('[fieldsetState] SET:', form);
        // let fieldset = form.components.find(({ uuid }) => uuid === fieldsetUUID);
        // let fieldset = get(fieldsetState([formUUID, fieldsetUUID]));
        let idx = form.components.findIndex(({ uuid }) => uuid === fieldsetUUID);
        let fieldset = { ...form.components[idx], ...newFieldset };
        let components = [...form.components];
        components[idx] = fieldset;

        console.log('[fieldsetState] SET:', components);

        set(formState(formUUID), { form: { components } })

    },
});

export const fieldState = atomFamily({
    key: 'fieldState',
    default: selectorFamily({
        key: 'fieldState/default',
        get: uuid => ({ get }) => {

        }
    })
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
