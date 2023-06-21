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


export const flatComponentsState2 = atomFamily({
    key: 'flatComponentsState2',
    default: selectorFamily({
        key: 'flatComponentsState2/default',
        get: uuid => ({ get }) => {
            console.log('flatComponentsState2....GET:', uuid);
            return get(flatComponentsState)[uuid];
        }
    }),
    set: ({ set, get }, newValue) => {
        console.log({newValue})
        set(flatComponentsState2, [...get(flatComponentsState2), newValue]);
    }
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

export const updateFlatComponentsSelector = selectorFamily({
    key: 'updateFlatComponentsSelector',
    get: uuid => ({ get }) => [...get(flatComponentsState)[uuid]],
    set: uuid => ({ get, set }, field) => set(updateFlatComponentsSelector, [...get(updateFlatComponentsSelector)[uuid], field])
});

export const updateFormSelector = selector({
    key: 'updateFormSelector',
    get: ({ get }) => [...get(allFormsState)],
    set: ({ set, get }, form) => {
        console.log('UPDATE FORM:', form);

        let allForms = get(allFormsState);

        if (form?.uuid) { // 既有的 form
            let idx = allForms.findIndex(f => f.uuid == form.uuid);
            allForms = [...allForms];
            allForms[idx] = form;            
        } else { // 新增的 form
            form.uuid = uuidv4();
            form.order = allForms.length + 1;
            form.icon = QuestionMarkIcon;
            allForms = [...allForms, form]; // recoil 不允許 allForms.push()
        }

        set(allFormsState, allForms);
    },
})

export const formDataState = atom({
    key: 'formDataState',
    default: {}
});
