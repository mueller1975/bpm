import { atom, selector, atomFamily } from "recoil";

export const formUIState = atom({
    key: 'formUIState',
    default: {},
    effects: [
        ({ setSelf, onSet }) => {
            let formUI = window.localStorage.getItem('formUI');

            if (!formUI) {

            } else {
                formUI = JSON.parse(formUI);
                console.log({ formUI });
                setSelf(formUI);
            }
        }
    ]
});

export const formUISelector = selector({
    key: 'formUISelector',
    get: ({ get }) => get(formUIState),
    set: ({ get, set }, settings) => {
        let newState = { ...get(formUIState), ...settings };
        set(formUIState, newState);

        window.localStorage.setItem('formUI', newState);
    }
})