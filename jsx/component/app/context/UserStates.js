import { atom, selector } from "recoil";

export const userState = atom({
    key: 'userState',
    default: {
        empId: 'mazinger',
        name: '金剛'
    }
});

export const flowUserTaskState = atom({
    key: 'flowUserTaskState',
    default: {
        formPrivileges: ['EDIT']
    }
});