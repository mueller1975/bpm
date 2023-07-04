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

export const formState = atomFamily({
    key: 'formState',
    default: selectorFamily({
        key: 'formState/default',
        get: uuid => ({ get }) => {
            const allForms = get(allFormsState);
            return allForms.find(form => form.uuid === uuid);
        }
    }),
    set: ({ set, get, setSelf }, newForm) => {
        console.log({ setSelf })
        let allForms = get(allFormsState);
        let idx = allForms.findIndex(f => f.uuid === newForm.uuid);
        let form = { ...allForms[idx], ...newForm };
        allForms[idx] = form;
        set(allFormsState, [...allForms]);
    }
});

export const flatComponentsState = selector({
    key: 'flatComponentsState',
    get: ({ get }) => {
        console.log('flatComponentsState....GET');
        const promise = new Promise((resolve, reject) => {
            let allForms = get(allFormsState);
            const flatComponents = flattenFormComponents(allForms);

            console.log({ flatComponents })
            resolve(flatComponents);
        });

        return promise;
        // return flatComponents;
    },
    set: ({ set }, newValue) => set(flatComponentsState, newValue)
});

export const flatComponentsState2 = atomFamily({
    key: 'flatComponentsState2',
    default: selectorFamily({
        key: 'flatComponentsState2/default',
        get: uuid => ({ get }) => {
            console.log('flatComponentsState2....GET uuid:', uuid);
            return uuid ? get(flatComponentsState)[uuid] : [];
        }
    }),
    // set: ({ set, get }, newValue) => {
    //     console.log({ newValue })
    //     set(flatComponentsState2, [...get(flatComponentsState2), newValue]);
    // }
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

export const updateFlatComponentsSelector = selectorFamily({
    key: 'updateFlatComponentsSelector',
    get: uuid => ({ get }) => [...get(flatComponentsState)[uuid]],
    set: uuid => ({ get, set }, field) => set(updateFlatComponentsSelector, [...get(updateFlatComponentsSelector)[uuid], field])
});

export const updateFormSelector = selector({
    key: 'updateFormSelector',
    get: ({ get }) => [...get(allFormsState)],
    set: ({ set, get }, { afterFormUUID, form }) => {
        console.log('UPDATE FORM:', form);

        let allForms = get(allFormsState);

        if (form?.uuid) { // 既有的 form 以 partial update 更新
            let idx = allForms.findIndex(f => f.uuid === form.uuid);
            let oldForm = allForms[idx];
            form = { ...oldForm, ...form }; // partial update

            allForms = [...allForms];
            allForms[idx] = form;
        } else { // 新增的 form
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
    },
})

export const formDataState = atom({
    key: 'formDataState',
    default: {}
});
