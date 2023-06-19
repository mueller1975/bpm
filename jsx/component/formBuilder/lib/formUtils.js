/**
 * Convert JSON string to js object
 * @param {*} json string
 * @returns 
 */
 export const jsonToObject = json => {
    if (json == null || json == undefined || json === '') {
        return null;
    }

    return (typeof json == 'string' && (json.startsWith('{') || json.startsWith('['))) ? JSON.parse(json) : json;
};