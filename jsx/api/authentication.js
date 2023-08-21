import { CAS_AUTHENTICATION_URL, PEOPLE_FINDER_GET_URL, PEOPLE_FINDER_API_KEY, CONTEXT_PATH, PATH } from 'Config'

const LOGIN_USER_API = `${CONTEXT_PATH}${PATH}/service/app/me`;

/**
 * 驗證 CAS 帳密
 * @param {*} username 
 * @param {*} password 
 */
export const loginCAS = async (username, password) => {
    const formData = `username=${username}&password=${password}`
    let success = false, message, response

    try {
        response = await fetch(CAS_AUTHENTICATION_URL, {
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            body: formData
        })

        switch (response.status) {
            case 200:
            case 201:
                success = true
                message = "登入成功"
                break
            case 401:
                message = "帳號或密碼錯誤"
                break
            case 0:
                message = "目前無法取得連線服務"
                break
            default:
                message = `伺服器發生錯誤 (${response.status})`
        }

    } catch (error) {
        console.log(error)
        response = error
        message = "伺服器連線失敗"
    }

    return { success, message, response }
}

/**
 * 查詢 People Finder 登入者資訊
 * @param {*} empId 
 */
export const getStaff = async empId => {
    let success = false, message, response

    try {
        response = await fetch(`${PEOPLE_FINDER_GET_URL}?empId=${empId}`, {
            method: 'GET', headers: { 'Authorization': PEOPLE_FINDER_API_KEY },
        })

        switch (response.status) {
            case 200:
                let result = await response.json()

                if (result.code == 0) {
                    success = true
                }

                message = result.data
                break
            case 0:
                message = "目前無法取得連線服務"
                break
            default:
                message = `伺服器發生錯誤 (${response.status})`

        }
    } catch (error) {
        console.log(error)
        response = error
        message = "伺服器連線失敗"
    }

    return { success, message, response }
}

/**
 * 查詢登入者資訊
 */
export const getLoginUser = async () => {
    try {
        let response = await fetch(LOGIN_USER_API, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        switch (response.status) {
            case 200:
                let user = await response.json();
                const { code, data } = user;

                if (code == 0) {
                    return data;
                } else {
                    return null;
                }
            case 0:
                throw new Error("目前無法取得連線服務")
            default:
                throw new Error(`伺服器發生錯誤 (${response.status})`)
        }
    } catch (error) {
        throw error
    }
}