import { useRecoilState, atom, selector } from "recoil";
import * as FormIcons from '../lib/formIcons';
import { sortBy } from 'underscore';

const MPB_FORMS_API = "./service/config/mpbForms4Lab";
const FETCH_FORM_API = () => fetch(MPB_FORMS_API, { redirect: 'manual' });

export const formState = atom({
    key: "formStates",
    default: [],
    effects: [
        ({ setSelf, onSet }) => {
            let promise = FETCH_FORM_API();

            promise.then(async response => {
                let vo = await response.json();

                let forms = vo.data.map(({ value }) => ({ ...value, icon: FormIcons[value.icon] ?? FormIcons['HelpOutlineIcon'] }));
                forms = sortBy(forms, "order");

                setSelf(forms);
            }).catch(error => {

            }).finally(() => {

            });

            return promise;
        }
    ]
});

export const formIdState = selector({
    key: 'allFormIds',
    get: ({ get }) => {
        const forms = get(formState);
        return forms.map(({ id }) => id);
    }
});

export const formDataState = atom({
    key: 'formDataState',
    default: {}
});