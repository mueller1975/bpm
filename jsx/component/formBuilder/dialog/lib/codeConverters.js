import { camelCase } from "lodash";
import { v4 as uuidv4 } from 'uuid';

/**
 * json string => 原始資料格式
 * @param {*} value json string
 * @param {*} category 設定值分類
 * @returns 
 */
export const jsonToRawData = (value, category) => {
    let obj;

    try {
        obj = JSON.parse(value);
    } catch (e) {
        throw `JSON 格式有誤 (${e})`;
    }

    switch (category) {
        case 'DROPDOWN': // 下拉選單
            if (!Array.isArray(obj)) {
                throw "JSON 非陣列型態";
            }

            return obj.map(({ code = '', name }) => `${name}\t${code}`).join('\n');
        case 'TABLE_SELECT': // 表格選取
            const { columns, data } = obj;

            const lineCol = columns.map(({ prop, title }) => `${title}|${prop}`).join('\t');
            const dataLine = data.map(row => columns.map(({ prop }) => row[prop]).join('\t')).join('\n');

            return lineCol + '\n' + dataLine;
        case 'HIERARCHICAL_DROPDOWN': // 階層下拉選單
            return Object.entries(obj).map(([k, v]) => {
                const keyLine = k + '\n';
                const valueLine = v.map(({ code = '', name }) => '\t' + `${name}\t${code}`).join('\n');
                return keyLine + valueLine;
            }).join('\n');
        default:
            throw `不支援的設定分類[${category}]`;
    }
};

export const createField = ({ name, label, type, length, description }) => {
    const propName = camelCase(name);
    let javaType, sqlType;
    const jsonField = { uuid: uuidv4(), name: propName, label };

    console.log(name, '=>', propName);

    switch (type?.toUpperCase()) {
        case '文字':
            if (description.includes('下拉式選單', '下拉選單')) {
                jsonField.type = 'dropdown';
            }

            javaType = 'String';
            sqlType = `varchar(${length || 40}) DEFAULT NULL`;

            break;
        case '數字':
            type = 'number';
            [javaType, sqlType] = length?.includes('(', ')') ? ['Double', `decimal${length} DEFAULT NULL`] : ['Integer', 'int DEFAULT NULL'];
            break;
        case 'Y/N':
            type = 'yesOrNo';
            javaType = 'String';
            sqlType = `char(1) DEFAULT NULL`;
            break;
        default:
            throw `未支援的欄位型態: ${type}`;
    }

    if (description.includes('必填')) {
        jsonField.required = true;
    }

    let column = `{ prop: "${propName}", name: "${label}", width: 150, noWrap: true },`

    let entityField = `
    /**
     * ${label}
     */
    @Column(name = "${name}")
    private ${javaType} ${propName};
    `;

    let dtoField = `
    /**
     * ${label}
     */
    private ${javaType} ${propName};
    `;

    let sqlColumn = `\t${name} ${sqlType} COMMENT '${label}',`;

    return { jsonField, column, entityField, dtoField, sqlColumn };
}

/**
 * 原始資料格式 => json object
 * @param {*} value 
 * @param {*} category 
 * @returns 
 */
export const rawDataToCodes = (value, category) => {
    let lines, jsonObject, columns, javaEntityFields, javaDTOFields, sqlColumns,
        count = 0; // 設定值筆數

    switch (category) {
        case 'FIELD': // 表單欄位
            jsonObject = []; // json 欄位屬性
            javaEntityFields = []; // java Entity 欄位宣告
            javaDTOFields = []; // java DTO 欄位宣告
            sqlColumns = []; // SQL 欄位
            columns = []; // view 欄位

            value.split('\n').forEach(line => {
                if (Boolean(line)) {
                    let [name, label, type, length, example, description] = line.split('\t');

                    name = name?.trim();
                    label = label?.trim();
                    type = type?.trim();
                    length = length?.trim();
                    description = description?.trim();

                    console.log(`${name}:${label}:${type}:${length}:${description}`);

                    if (!name || !label) {
                        console.error(`name/label 缺一不可 => label: ${label}, name:${name}`);
                    } else {
                        const { jsonField, column, entityField, dtoField, sqlColumn } =
                            createField({ name, label, type, length: length, description });

                        jsonObject.push(jsonField);
                        columns.push(column);
                        javaEntityFields.push(entityField);
                        javaDTOFields.push(dtoField);
                        sqlColumns.push(sqlColumn);
                    }
                }
            });

            count = jsonObject.length;

            return [{ jsonObject, columns, javaEntityFields, javaDTOFields, sqlColumns }, count];
        case 'DROPDOWN': // 下拉選單
            jsonObject = [];

            value.split('\n').forEach(line => {
                if (Boolean(line)) {
                    let [name, code] = line.split('\t');
                    name = name.trim();
                    code = code?.trim();

                    if (code) {
                        jsonObject.push({ code, name });
                    } else {
                        jsonObject.push({ name });
                    }
                }
            });

            count = jsonObject.length;

            return [jsonObject, count];
        case 'TABLE_SELECT': // 表格選取
            lines = value.split('\n');

            // 第一行: 欄位設定
            columns = lines[0].split('\t').map(str => {
                const [title, prop] = str.split('|');
                return { title, prop: prop ?? title };
            });

            // 第二行以下: 資料
            let data = [];
            lines.slice(1).forEach(line => {
                line = line.trim();

                if (line !== '') {
                    let row = {};
                    let values = line.split('\t');

                    columns.forEach(({ prop }, index) => row[prop] = values[index]);
                    data.push(row);
                }
            });

            jsonObject = { columns, data };
            count = data.length;

            return [jsonObject, count];
        case 'HIERARCHICAL_DROPDOWN': // 階層下拉選單
            jsonObject = {};
            lines = value.split('\n');
            let curCat;

            lines.forEach((line, index) => {
                if (line.trim() !== '') {
                    if (line[0] != '\t') { // 非 \t 起頭 => 【大類】
                        let catLine = line.trim();

                        if (!catLine) {
                            throw `line #${index + 1}:【大類】行不可為空`;
                        }

                        curCat = jsonObject[catLine] ?? [];
                        jsonObject[catLine] = curCat;
                    } else { // \t 起頭 => 【項目】
                        if (!curCat) {
                            throw '必須先設定【大類】行';
                        }

                        let [name, code] = line.trim().split('\t');
                        name = name.trim();
                        code = code?.trim();

                        if (code) {
                            curCat.push({ code, name });
                        } else {
                            curCat.push({ name });
                        }
                    }
                }
            })

            count = Object.keys(jsonObject).length;
            return [jsonObject, count];
        default:
            throw `不支援的設定分類[${category}]`;
    }


};
