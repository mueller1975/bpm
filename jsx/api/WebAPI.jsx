import { CSRF_TOKEN, CSRF_HEADER } from 'Config';

/**
 * 查詢系統設定值
 * @param {any} successFunc
 */
export const getSettingValue = async (code) => {
    try {
        const response = await fetch('service/setting', {
            method: 'POST', body: `code=${code}`, redirect: 'manual',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                [CSRF_HEADER]: CSRF_TOKEN
            }
        })

        if (response.ok) {
            const result = await response.json()
            const { code, data } = result

            if (code == 0) {
                return data
            } else {
                throw data
            }
        } else {
            if (response.type == 'opaqueredirect') {
                throw "您目前的工作階段已經結束，請刷新頁面重新登入！"
            } else {
                throw `Error ${response.status}`
            }
        }
    } catch (error) {
        let message = error

        if (error instanceof Error) {
            message = error.message == "Failed to fetch" ? "本系統目前無法提供服務，請稍候再試！" : error.message
        }

        throw new Error(message)
    }
} // getLocationList()

/**
 * 查詢 BU 列表
 * @param {any} successFunc
 */
export const getLocationList = async () => {
    try {
        const response = await fetch('service/app/locations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                [CSRF_HEADER]: CSRF_TOKEN
            }
        })

        if (response.ok) {
            const result = await response.json()
            const { code, data } = result

            if (code == 0) {
                return data
            } else {
                throw data
            }
        } else {
            if (response.type == 'opaqueredirect') {
                throw "您目前的工作階段已經結束，請刷新頁面重新登入！"
            } else {
                throw `Error ${response.status}`
            }
        }
    } catch (error) {
        let message = error

        if (error instanceof Error) {
            message = error.message == "Failed to fetch" ? "本系統目前無法提供服務，請稍候再試！" : error.message
        }

        throw new Error(message)
    }
} // getLocationList()

/**
 * 查詢工作地列表
 * @param {any} successFunc
 */
export const getBUList = async () => {
    try {
        const response = await fetch('service/app/bu', {
            method: 'POST', redirect: 'manual',
            headers: {
                'Content-Type': 'application/json',
                [CSRF_HEADER]: CSRF_TOKEN
            }
        })

        if (response.ok) {
            const result = await response.json()
            const { code, data } = result

            if (code == 0) {
                return data
            } else {
                throw data
            }
        } else {
            if (response.type == 'opaqueredirect') {
                throw "您目前的工作階段已經結束，請刷新頁面重新登入！"
            } else {
                throw `Error ${response.status}`
            }
        }
    } catch (error) {
        let message = error

        if (error instanceof Error) {
            message = error.message == "Failed to fetch" ? "本系統目前無法提供服務，請稍候再試！" : error.message
        }

        throw new Error(message)
    }
} // getBUList()

/* 查詢 OU 列表 */
export const getOUList = async (bu) => {
    try {
        const response = await fetch('service/app/ou', {
            body: `bu=${bu}`, method: 'POST', redirect: 'manual',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                [CSRF_HEADER]: CSRF_TOKEN
            }
        })

        if (response.ok) {
            const result = await response.json()
            const { code, data } = result

            if (code == 0) {
                return data
            } else {
                throw data
            }
        } else {
            if (response.type == 'opaqueredirect') {
                throw "您目前的工作階段已經結束，請刷新頁面重新登入！"
            } else {
                throw `Error ${response.status}`
            }
        }
    } catch (error) {
        let message = error

        if (error instanceof Error) {
            message = error.message == "Failed to fetch" ? "本系統目前無法提供服務，請稍候再試！" : error.message
        }

        throw new Error(message)
    }
}

/* 查詢部門列表 */
export const getUnitList = async (bu, ou) => {
    try {
        const response = await fetch('service/app/unit', {
            body: "bu=" + bu + "&ou=" + ou,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                [CSRF_HEADER]: CSRF_TOKEN
            }
        })

        if (response.ok) {
            const result = await response.json()
            const { code, data } = result

            if (code == 0) {
                return data
            } else {
                throw data
            }
        } else {
            if (response.type == 'opaqueredirect') {
                throw "您目前的工作階段已經結束，請刷新頁面重新登入！"
            } else {
                throw `Error ${response.status}`
            }
        }
    } catch (error) {
        let message = error

        if (error instanceof Error) {
            message = error.message == "Failed to fetch" ? "本系統目前無法提供服務，請稍候再試！" : error.message
        }

        throw new Error(message)
    }
} // getUnitList()