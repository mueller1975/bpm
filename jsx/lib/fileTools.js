
/**
 * file 轉 url data base64 格式
 * @param {*} file 
 * @returns 
 */
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        let fileReader = new FileReader();

        fileReader.onload = () => {
            file.base64 = fileReader.result;
            resolve(fileReader.result);
        };

        fileReader.onerror = () => reject(fileReader.error);

        fileReader.readAsDataURL(file);
    });
};

/**
 * 多 file 轉 url data base64 格式
 * @param {*} files 
 * @returns 
 */
export const filesToBase64 = (files) => {
    return Promise.all(files.map(f => fileToBase64(f)));
}