import PersonIcon from '@mui/icons-material/Person';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { EmployeeDialog } from 'Components';
import ConfigSelectDialog from '../component/ConfigSelectDialog.jsx';
import MICDialog from '../component/MICDialog.jsx';

/**
 * 後端資料來源設定
 */
export const DATA_TABLE_SELECTS = Object.freeze({
    // 員工基本資料
    'employee': [
        PersonIcon,
        EmployeeDialog,
        {}],

    // 系統設定
    'config': [
        PlaylistAddCheckIcon,
        ConfigSelectDialog,
        {}],

    // 導體
    "pdConductor": [
        PlaylistAddCheckIcon,
        MICDialog,
        {
            dialogWidth: "sm",
            tableKey: "PD_CONDUCTOR",
            tableOptions: {
                title: "導體",
                autoFetch: true, columns: [
                    { prop: 'code', name: '導體碼', width: 80 },
                    { prop: 'id', name: 'ID', width: 200 },
                ],
                serviceUrl: "service/pd/conductor/list",
                params: {},
                size: 15, sizeOptions: [10, 15, 25, 50, 75], sortProp: "code", sortOrder: "asc",
            }
        }],

    // 品名
    "pdProductName": [
        PlaylistAddCheckIcon,
        MICDialog,
        {
            dialogWidth: "sm",
            tableKey: "PD_PRODUCT_NAME",
            tableOptions: {
                title: "品名",
                autoFetch: true, columns: [
                    { prop: 'code', name: '品名碼', width: 80 },
                    { prop: 'id', name: 'ID', width: 200 },
                ],
                serviceUrl: "service/pd/productName/list",
                params: {},
                size: 15, sizeOptions: [10, 15, 25, 50, 75], sortProp: "code", sortOrder: "asc",
            }
        }],

    // 規範/規格
    "pdSpec": [
        PlaylistAddCheckIcon,
        MICDialog,
        {
            dialogWidth: "sm",
            tableKey: "PD_SPEC",
            tableOptions: {
                title: "規範/規格",
                autoFetch: true, columns: [
                    { prop: 'code', name: '規範/規格碼', width: 80 },
                    { prop: 'id', name: 'ID', width: 200 },
                ],
                serviceUrl: "service/pd/spec/list",
                params: {},
                size: 15, sizeOptions: [10, 15, 25, 50, 75], sortProp: "code", sortOrder: "asc",
            }
        }],

    // 電壓
    "pdVoltage": [
        PlaylistAddCheckIcon,
        MICDialog,
        {
            dialogWidth: "sm",
            tableKey: "PD_VOLTAGE",
            tableOptions: {
                title: "電壓",
                autoFetch: true, columns: [
                    { prop: 'code', name: '電壓碼', width: 80 },
                    { prop: 'id', name: 'ID', width: 200 },
                ],
                serviceUrl: "service/pd/voltage/list",
                params: {},
                size: 15, sizeOptions: [10, 15, 25, 50, 75], sortProp: "code", sortOrder: "asc",
            }
        }],

    // 物理特性表主檔
    "phyPropMain": [
        PlaylistAddCheckIcon,
        MICDialog,
        {
            dialogWidth: "sm",
            tableKey: "PHY_PROP_MAIN",
            tableOptions: {
                title: "物性卡",
                autoFetch: true, columns: [
                    { prop: 'code', name: '編號', width: 80 },
                    { prop: 'id', name: 'ID', width: 200 },
                ],
                serviceUrl: "service/phy/propMain/list",
                params: {},
                size: 15, sizeOptions: [10, 15, 25, 50, 75], sortProp: "code", sortOrder: "asc",
            }
        }],


    // 客戶主檔
    "merchant": [
        PlaylistAddCheckIcon,
        MICDialog,
        {
            dialogWidth: "lg",
            tableKey: "MERCHANT",
            tableOptions: {
                title: "客戶主檔",
                autoFetch: true,
                columns: [
                    { prop: 'code', name: '客戶編號', width: 200, },
                    { prop: 'name', name: '客戶名稱', width: 300 },
                    { prop: 'id', name: 'ID', width: 200, },
                ],
                serviceUrl: "service/iuap/merchant/query",
                params: {}, size: 15, sizeOptions: [10, 15, 20, 25, 50, 75], sortProp: "code", sortOrder: "asc",
            },
            enableKeywordSearch: true
        }],

    // 庫存組織
    "inventoryOrg": [
        PlaylistAddCheckIcon,
        MICDialog,
        {
            tableKey: "INVENTORY_ORG",
            tableOptions: {
                title: "庫存組織",
                autoFetch: true,
                columns: [
                    { prop: 'code', name: '代碼', width: 200, },
                    { prop: 'name', name: '名稱', width: 300 },
                    { prop: 'id', name: 'ID', width: 200, },
                ],
                serviceUrl: "service/iuap/inventoryOrg/query",
                params: { enable: 1 }, size: 50, sizeOptions: [10, 15, 20, 25, 50, 75], sortProp: "code", sortOrder: "asc",
            },
            enableKeywordSearch: true
        }],
});
