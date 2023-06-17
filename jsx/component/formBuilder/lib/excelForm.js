import { flattenDeep } from 'lodash';
import readXlsxFile from 'read-excel-file';

const DEFAULT_COLS = {
    "xs": 12,
    "sm": 6,
    "md": 4,
    "lg": 3
};

const createForm = (id, title, order, icon) => ({
    id,
    title,
    order: isNaN(parseInt(order)) ? 99 : parseInt(order),
    icon,
    editableWhen: "ctxState.flowUserTask?.formPrivileges?.includes('EDIT')",
    components: []
});

const createFieldset = (title, cols = DEFAULT_COLS) => ({
    type: "fieldset",
    cols,
    fields: [],
});

const asInlineEditor = field => {
    field.type = "inlineEditor";
    field.cols = {
        xs: 12
    };

    field.options = {
        noBorder: false,
        columns: []
    };
};

const asFileUploader = field => {
    field.type = "fileUploader";
    field.cols = {
        xs: 12
    };

    field.options = {
        noBorder: false,
        columns: [
            {
                name: "description",
                label: "檔案說明",
                width: 500
            }
        ]
    };
};

const createField = row => {
    let [name, label, type, defaultValue, menuOrTableCode,
        unit, globalVar, requiredHaving, readOnly] = [
            row['欄位變數'], row['欄位名稱'], row['欄位型態'], row['預設值'], row['選單/表格代碼'],
            row['單位'], row['全域變數'], row['必填'], row['唯讀']];

    if (!(name && label && type)) {
        throw "欄位變數、名稱、型態皆不得為空值";
    }

    const field = { name, label };

    defaultValue !== null && (field.defaultValue = defaultValue.toString());
    unit !== null && (field.unit = unit);
    globalVar === 'v' && (field.isContextStateProp = true);

    // 何時必填
    if (requiredHaving) {
        if (requiredHaving === 'v') {
            field.required = true;
        } else {
            let privs = requiredHaving.split(',').join('\',\'');
            field.requiredWhen = `ctxState.flowUserTask?.formPrivileges?.includes('${privs}')`;
        }
    }

    // 是否 disabled
    if (readOnly === 'v') {
        field.disabled = true;
    }

    switch (type.toUpperCase()) {
        case '文字':
            // field.type = 'text';
            break;
        case '下拉':
            if (!menuOrTableCode) {
                throw `【${label}】欄位未指定 [選單/表格代碼]`
            }

            field.type = 'dropdown';
            field.configCode = menuOrTableCode;
            break;
        case '文字/下拉':
            if (!menuOrTableCode) {
                throw `【${label}】欄位未指定 [選單/表格代碼]`
            }

            field.type = 'autocomplete';
            field.configCode = menuOrTableCode;
            break;
        case '數值':
        case '數字':
            field.type = 'number';
            break;
        case '數值範圍':
            field.type = 'numberRange';
            break;
        case 'Y/N':
            field.type = 'checkbox';
            break;
        case '表格選取':
            if (!menuOrTableCode) {
                throw `【${label}】欄位未指定 [選單/表格代碼]`
            }

            field.type = 'tableSelect';
            field.source = menuOrTableCode;
            field.isMappedStateProp = true;
            field.mappedRowProps = {};
            break;
        case '映射':
            field.isMappedStateProp = true;
            break;
        case '員工選取':
            field.type = 'employeeSelect';
            field.isMappedStateProp = true;
            field.mappedRowProps = {};
            break;
        case '附檔':
            asFileUploader(field);
            break;
        case '多筆子表':
        case '子表多筆':
            asInlineEditor(field);
            break;
        default:
            throw `不支援的欄位型態: ${type}`;
    }

    return field;
};

export const readSpecLines = async (file, formSpecSheets) => {
    const formRows = [];

    // 將工作表列資料物件化
    for (let sheetIdx in formSpecSheets) {
        let sheet = formSpecSheets[sheetIdx];
        console.log(`開始讀取工作表【${sheet}】...`);

        let rows = await readXlsxFile(file, { sheet }); // 工作表所有列資料
        const propRow = rows[0]; // 工作表第一列資料 (欄位標題)

        // 第二列以後列資料 array => object
        for (let i = 1; i < rows.length; i++) {
            let formRow = {};
            propRow.forEach((prop, j) => prop && (formRow[prop] = rows[i][j]));

            formRows.push(formRow);
        }
    }

    return formRows;
};

export const organizeSpecForms = formRows => {
    const forms = {}; // 所有表單設定
    let curForm = null; // 目前表單設定

    // 目前表單元件 (form.components 成員的 type 為 fieldset、componentGroup, 目前匯入僅支援 fieldset)
    let curFormComponent = null;

    let curCompositeField = null; // 目前【子表多筆】、【附檔】型態的欄位

    formRows.forEach(row => {
        let [formTitle, formId, formOrder, formIcon, rowColWidth] = [
            row['分區'], row['分區代碼'], row['分區順序'], row['分區圖示'], row['子表欄寬'],];

        if (curForm?.title !== formTitle) {
            curForm = forms[formTitle] ?? createForm(formId, formTitle, formOrder, formIcon);
            forms[formTitle] = curForm;
            curFormComponent = null;
            curCompositeField = null;
            // console.log({ curForm })
        }

        if (!curFormComponent) {
            curFormComponent = createFieldset();
            curForm.components.push(curFormComponent);
        }

        let field = createField(row); // 為目前 row 產生新 field

        if (['fileUploader', 'inlineEditor'].includes(field.type)) {
            curCompositeField = field;
        } else if (curCompositeField) {
            // 判斷欄位名稱是否為 XXX-YYY
            let labels = field.label.split('-');

            if (labels.length > 1 && labels[0] == curCompositeField.label) {
                field.label = field.label.substring(field.label.indexOf('-') + 1); // 欄位名稱去掉 XXX-
                rowColWidth && (field.width = rowColWidth);

                curCompositeField.options.columns.push(field);
                return;
            } else {
                curCompositeField = null;
            }
        }

        curFormComponent.fields.push(field);

    });

    let formArray = Object.entries(forms).map(([title, form]) => form);
    return formArray;
}