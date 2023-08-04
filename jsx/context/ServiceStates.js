import { atom, selector, atomFamily, selectorFamily } from 'recoil';

export const categoryListState = atom({
    key: 'categoryListState',
    default: [],
    effects: [
        ({ setSelf }) => {
            let promise = fetch("http://localhost:86/bpm-service/service/config?code=CATEGORY", {
                method: 'GET', redirect: 'manual',
            });

            promise.then(async response => {
                let vo = await response.json();
                let list = JSON.parse(vo.data).map(({ value }) => value);

                setSelf(list);

                console.info('取得 categoryList:', list);
            }).catch(err => {

            });

            return promise;
        }
    ]
});

export const allDropdownsState = atom({
    key: 'dropdownsState',
    default: [],
    effects: [
        ({ setSelf }) => {
            let promise = fetch("http://localhost:86/bpm-service/service/config/dropdowns", {
                method: 'GET', redirect: 'manual',
            });

            promise.then(async response => {
                let list = await response.json();

                // throw 'Test Error.....'
                setSelf(list);
            }).catch(err => {

            });

            return promise;
        }
    ]
});

export const dropdownState = selectorFamily({
    key: 'dropdownState',
    get: code => ({ get }) => get(allDropdownsState).find(dropdown => dropdown.code === code)
});

export const allHierarchicalDropdownsState = atom({
    key: 'allHierarchicalDropdownsState',
    default: [],
    effects: [
        ({ setSelf }) => {
            let promise = fetch("http://localhost:86/bpm-service/service/config/hierarchicalDropdowns", {
                method: 'GET', redirect: 'manual',
            });

            promise.then(async response => {
                let list = await response.json();

                // throw 'Test Error.....'
                setSelf(list);
            }).catch(err => {

            });

            return promise;
        }
    ]
});

export const hierarchicalDropdownState = selectorFamily({
    key: 'hierarchicalDropdownState',
    get: code => ({ get }) => get(allHierarchicalDropdownsState).find(dropdown => dropdown.code === code)
});


export const allIconDropdownsState = atom({
    key: 'allIconDropdownsState',
    default: [],
    effects: [
        ({ setSelf }) => {
            let promise = fetch("http://localhost:86/bpm-service/service/config/iconDropdowns", {
                method: 'GET', redirect: 'manual',
            });

            promise.then(async response => {
                let list = await response.json();

                // throw 'Test Error.....'
                setSelf(list);
            }).catch(err => {

            });

            return promise;
        }
    ]
});

export const iconDropdownState = selectorFamily({
    key: 'iconDropdownState',
    get: code => ({ get }) => get(allIconDropdownsState).find(dropdown => dropdown.code === code)
});