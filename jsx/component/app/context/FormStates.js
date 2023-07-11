import { atom, selector } from "recoil";
import { sortBy } from 'underscore';

const MPB_FORMS_API = "./service/config/mpbForms4Lab";
const FETCH_FORM_API = () => fetch(MPB_FORMS_API, { redirect: 'manual' });

export const loadDBForms = async () => {
    let response = await FETCH_FORM_API();
    let vo = await response.json();
    let forms = vo.data.map(({ value }) => value);

    forms = sortBy(forms, "order");
    return forms;
};

export const allFormsState = atom({
    key: "allFormsState",
    default: [],
    effects: [
        ({ setSelf, onSet }) => {
            let savedForms = window.localStorage.getItem('allForms');

            if (!savedForms) {

            } else {
                savedForms = JSON.parse(savedForms);
                console.log({ savedForms });
                setSelf(savedForms);
            }
        }
    ]
});

export const loadFromDBSelector = selector({
    key: 'loadFromDBSelector',
    get: ({ get }) => get(allFormsState),
    set: ({ get, set }) => {
        let forms = loadDBForms();
        set(allFormsState, forms);
    }
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

export const formDataState = selector({
    key: 'forDataState',
    get: ({ get }) => {
        let forms = {};
        let defaultForms = {};
        let total = 0;

        const allForms = get(allFormsState);

        allForms.forEach(({ id, components }) => {
            let formStateProps = [];
            let defaultFormState = {};

            // 設定 isContextStateProp 或 isMappedStateProp 為 true 的欄位值為 form context state
            components && components.forEach(({ type, fields, components: groupComponents }) => {
                if (type == 'fieldset') {
                    fields.forEach(({ isContextStateProp, isMappedStateProp, name, defaultValue }) => {
                        if (defaultValue !== undefined) {
                            defaultFormState[name] = defaultValue;
                        }

                        if (isContextStateProp || isMappedStateProp) {
                            formStateProps.push({ name, type, defaultValue });
                            total++;
                        }
                    });
                } else if (type == 'componentGroup') {
                    groupComponents && groupComponents.forEach(({ type, fields }) => {
                        if (type == 'fieldset') {
                            fields.forEach(({ isContextStateProp, isMappedStateProp, name, defaultValue }) => {
                                if (defaultValue !== undefined) {
                                    defaultFormState[name] = defaultValue;
                                }

                                if (isContextStateProp || isMappedStateProp) {
                                    formStateProps.push({ name, type, defaultValue });
                                    total++;
                                }
                            });
                        }
                    });
                }
            });

            forms[id] = formStateProps;
            defaultForms[id] = defaultFormState;
        });

        return [{ total, forms }, defaultForms];
    }
});