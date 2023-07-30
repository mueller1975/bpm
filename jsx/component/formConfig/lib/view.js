export const VIEW_KEY = "CRUD_VIEW";

export const TABLE_OPTIONS = {
    title: "表單組態設定",
    autoFetch: true, columns: [
        { prop: 'code', name: '品名碼', width: 80 },
        { prop: 'id', name: 'ID', width: 200 },
    ],
    serviceUrl: "http://localhost:86/bpm-service/service/formConfig/query",
    params: {},
    size: 15, sizeOptions: [10, 15, 25, 50, 75], sortProp: "code", sortOrder: "asc",
};
