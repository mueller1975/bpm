import { atom, selector, atomFamily } from "recoil";

export const UIState = atom({
    key: 'UIState',
    default: {
        excerptDrawer: {
            open: false,
            docked: false
        }
    },
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

export const UISelector = selectorFamily({
    key: 'UISelector',
    get: name => ({ get }) => get(UIState)[name] ?? {},
    set: name => ({ get, set }, settings) => {
        settings = { ...get(UISelector(name)), ...settings };
        let newUIState = { ...get(UIState), [name]: settings };
        set(UIState, newUIState);

        window.localStorage.setItem('formUI', JSON.stringify(newUIState));
    }
});