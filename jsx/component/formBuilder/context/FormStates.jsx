import { useRecoilState, atom, selector } from "recoil";
import * as FormIcons from '../lib/formIcons';
import { sortBy } from 'underscore';
import { v4 as uuidv4 } from 'uuid';

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
                    uuid: uuidv4(), // 產生 uuid, 為提昇 react 前端 performance, 並不會存回
                    icon: FormIcons[value.icon] ?? FormIcons['HelpOutlineIcon']
                }));

                forms = sortBy(forms, "order");
                setSelf(forms);

                console.info('取得 forms:', forms);
            }).catch(error => {

            }).finally(() => {

            });

            return promise;
        }
    ]
});

export const allFormIdsState = selector({
    key: 'allFormIds',
    get: ({ get }) => {
        const forms = get(allFormsState);
        return forms.map(({ id }) => id);
    }
});

export const updateFormSelector = selector({
    key: 'updateFormSelector',
    get: ({ get }) => [...get(allFormsState)],
    set: ({ set, get }, form) => {
        console.log('RESET allForms.........')
        let allForms = get(allFormsState);

        if (form?.uuid) {
            let idx = allForms.findIndex(f => f.uuid == form.uuid);
            allForms[idx] = form;
            allForms = [...allForms];
        } else {
            form.uuid = uuidv4();
            form.order = allForms.length + 1;
            allForms = [...allForms, form]; // recoil 不允許 allForms.push()
        }

        set(allFormsState, allForms);
    },
})

export const formDataState = atom({
    key: 'formDataState',
    default: {}
});

export const UpdateForm = form => {

}