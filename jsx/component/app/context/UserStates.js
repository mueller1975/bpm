import { atom, selector } from "recoil";

export const userState = atom({
    key: 'userState',
    default: {
        empId: 'mazinger',
        name: '金剛',
        deptId: 'A0919',
        deptName: 'LAB19'
    }
});

export const flowUserTaskState = atom({
    key: 'flowUserTaskState',
    default: {
        formPrivileges: ['EDIT']
    }
});

export const userFormPrivilegesSelector = selector({
    key: 'userFormPrivilegesSelector',
    get: ({ get }) => get(flowUserTaskState).formPrivileges,
    set: ({ get, set }, formPrivileges) =>
        set(flowUserTaskState, { ...get(flowUserTaskState), formPrivileges })
})