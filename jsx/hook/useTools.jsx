/**
 * 工具 hooks
 */
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * 取得 window 尺寸
 * @param {*} props 
 */
export const useWindowSize = props => {

    const getWindowSize = () => {
        let width = window.innerWidth
        let height = window.innerHeight

        return { width, height }
    }

    const [windowSize, setWindowSize] = useState(getWindowSize)

    useEffect(() => {
        const windowResizeHandler = e => {
            setWindowSize(getWindowSize())
        }

        window.addEventListener('resize', windowResizeHandler)

        return () => window.removeEventListener('resize', windowResizeHandler)
    }, [])

    return windowSize
}

/**
 * 取得目前滑鼠座標
 */
export const useMousePosition = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const func = e => setPosition({ x: e.clientX, y: e.clientY })
        window.addEventListener("mousemove", func)

        return () => window.removeEventListener("mousemove", func)
    }, [])

    return position
}

/**
 * 回傳資料為 { code, data } 的非同步程序
 * @param {*} asyncFunction 非同步程序
 * @param {*} delay 最少延遲時間 (ms)
 * @param {*} immediate 立即執行
 */
export const useResponseVO = (asyncFunction, { delay = 0, immediate = false }) => {
    const [pending, setPending] = useState(false)
    const [value, setValue] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {        
        if (immediate) {
            console.log('立即執行 =>', asyncFunction);
            execute();
        }
    }, []);

    if (!asyncFunction) {
        return { execute: null, pending, value, error }
    }

    delay = delay < 0 ? 0 : delay

    // reset = true, 清除狀態但不執行 async function; convertDataToObject = true, 將 data (JSON) 轉為 object
    const execute = useCallback(({ params, reset = false, convertDataToObject = false } = { reset: false }) => {
        setValue(null)
        setError(null)

        if (reset) {
            setPending(false)
            return null
        }

        const funcPromise = asyncFunction(params)

        if (!funcPromise) {
            return null
        }

        setPending(true)

        let idlePromise = new Promise((resolve, reject) => {
            setTimeout(() => resolve("time up"), delay)
        })

        return Promise.all([idlePromise, funcPromise])
            .then(async ([r0, r1]) => {
                // console.log(`r0=`, r0)
                // console.log(`r1=`, r1)
                // console.log(`r1.ok?`, r1.ok)
                let error

                if (!r1.ok) {
                    console.log("NOT ok:", r1)
                    let message

                    if (r1.type == 'opaqueredirect') {
                        message = '您目前的工作階段已經結束，請刷新頁面重新登入！'
                    } else {
                        let contentType = r1.headers.get("content-type").toLowerCase()

                        switch (r1.status) {
                            case 403:
                                let exception = r1.headers.get("Access-Denied-Exception") ?? "";

                                if (exception.toLowerCase().indexOf("csrf")) {
                                    message = "CSRF Token 已失效，請刷新頁面重新取得！"
                                } else {
                                    message = `Error ${r1.status}：您無權限執行此動作！`
                                }

                                break;
                            case 404:
                                message = `Error ${r1.status}：請求的資源不存在（${r1.url}）！`
                                break;
                            default:
                                let reason = contentType.indexOf("text/plain") > -1 ? `：${await r1.text()}` : ""
                                message = `Error ${r1.status}${reason}！`
                        }
                    }

                    error = new Error(message)
                } else {
                    switch (r1.status) {
                        case 200:
                            try {
                                let response = await r1.json()
                                // console.log('response:', response)

                                let { code, data } = response

                                if (code === 0) {
                                    if (convertDataToObject && typeof data === 'string') {
                                        data = JSON.parse(data)
                                    }

                                    setValue(data)
                                    return response
                                } else {
                                    error = new Error(data)
                                }
                            } catch (e) {
                                console.log('ERROR:', e)
                                error = new Error(e)
                            }

                            break
                        case 0:
                            error = new Error("目前無法取得連線服務")
                            break
                        case 302:
                            console.log("302")
                        default:
                            error = new Error(`伺服器發生錯誤 (${r1.status})`)
                    }
                }

                setError(error)
                return error
            }).catch(error => {
                console.error(error)

                if (error.message == 'Failed to fetch') {
                    error = new Error("伺服器連線失敗")
                }

                setError(error)
                return error
            }).finally(() => setPending(false))
    }, [asyncFunction]);

    return { execute, pending, value, error }
}

/**
 * 回傳資料 Content-Type 為 application/octet-stream 的非同步程序
 * @param {*} asyncFunction 非同步程序
 * @param {*} delay 最少延遲時間 (ms)
 * @param {*} openImmediately 是否立即下載
 */
export const useAsyncDownload = (asyncFunction, delay = 0, openImmediately = true) => {
    const [pending, setPending] = useState(false)
    const [value, setValue] = useState(null)
    const [error, setError] = useState(null)

    if (!asyncFunction) {
        return { execute: null, pending, value, error }
    }

    delay = delay < 0 ? 0 : delay

    const execute = useCallback(({ fileName, reset = false } = { reset: false }) => { // reset = true, 清除狀態但不執行 async function
        setValue(null)
        setError(null)

        if (reset) {
            setPending(false)
            return null
        }

        const funcPromise = asyncFunction(fileName)

        if (!funcPromise) {
            return null
        }

        setPending(true)

        let idlePromise = new Promise((resolve, reject) => {
            setTimeout(() => resolve("time up"), delay)
        })

        return Promise.all([idlePromise, funcPromise])
            .then(async ([r0, r1]) => {
                // console.log(`r0=`, r0)
                // console.log(`r1=`, r1)
                // console.log(`r1.ok?`, r1.ok)
                let error

                if (!r1.ok) {
                    console.log("NOT ok:", r1)
                    let message

                    if (r1.type == 'opaqueredirect') {
                        message = '您目前的工作階段已經結束，請刷新頁面重新登入！'
                    } else {
                        let contentType = r1.headers.get("content-type").toLowerCase()

                        switch (r1.status) {
                            case 404:
                                message = `Error ${r1.status}：請求的資源不存在（${r1.url}）！`
                                break;
                            default:
                                let reason = contentType.indexOf("text/plain") > -1 ? `：${await r1.text()}` : ""
                                message = `Error ${r1.status}${reason}！`
                        }
                    }

                    error = new Error(message)
                } else {
                    switch (r1.status) {
                        case 200:
                            const contentType = r1.headers.get("Content-Type");

                            if (contentType == "application/json") {
                                let response = await r1.json();
                                let { code, data } = response

                                if (code === 0) {
                                    setValue(data)
                                    return response
                                } else {
                                    error = new Error(data)
                                }
                            } else {
                                let blob = await r1.blob()
                                let contentDisposition = r1.headers.get("Content-Disposition")
                                fileName = fileName || (contentDisposition && decodeURI(contentDisposition.substring(contentDisposition.indexOf("filename=") + 9))) || ''

                                // 立即下載檔案
                                if (openImmediately) {
                                    if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE
                                        window.navigator.msSaveOrOpenBlob(blob, fileName)
                                    } else { // for non-IE
                                        let url = window.URL.createObjectURL(blob)
                                        let a = document.createElement('a')
                                        a.href = url
                                        a.download = fileName
                                        document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
                                        a.click()
                                        a.remove()
                                    }
                                }

                                setValue(blob);
                            }

                            break
                        case 0:
                            error = new Error("目前無法取得連線服務")
                            break
                        case 302:
                            console.log("302")
                        default:
                            error = new Error(`伺服器發生錯誤 (${r1.status})`)
                    }
                }

                setError(error)
                return error
            }).catch(error => {
                console.error(error)

                if (error.message == 'Failed to fetch') {
                    error = new Error("伺服器連線失敗")
                }

                setError(error)
                return error
            }).finally(() => setPending(false))
    }, [asyncFunction])

    return { execute, pending, value, error }
}

/**
 * 資料延遲
 * @param {*} value 
 * @param {*} delay 
 */
export const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Update debounced value after delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler)
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Notification Snackbar 訊息提示 Hook
 */
export const useNotification = () => {
    const { enqueueSnackbar } = useSnackbar() // 訊息提示 function

    const notifyFunctions = useMemo(() => {
        const showInfo = (message, duration) =>
            enqueueSnackbar(<Typography variant="body1" style={{ wordBreak: 'break-all' }}>{message}</Typography>,
                { variant: "info", autoHideDuration: duration });

        const showSuccess = (message, duration) =>
            enqueueSnackbar(<Typography variant="body1" style={{ wordBreak: 'break-all' }}>{message}</Typography>,
                { variant: "success", autoHideDuration: duration });

        const showWarning = (message, duration) =>
            enqueueSnackbar(<Typography variant="body1" style={{ wordBreak: 'break-all' }}>{message}</Typography>,
                { variant: "warning", autoHideDuration: duration });

        const showError = (error, duration) =>
            enqueueSnackbar(<Typography variant="body1" style={{ wordBreak: 'break-all' }}>{error?.message ?? (error + '')}</Typography>,
                { variant: "error", autoHideDuration: duration });

        return { showInfo, showSuccess, showWarning, showError };
    }, [enqueueSnackbar])

    return notifyFunctions
}

/**
 * 取得前一狀態值
 * @param {*} value 
 */
export const usePrevious = value => {
    const ref = useRef()

    useEffect(() => { ref.current = value }, [value])

    return ref.current
}

/**
 * 是否達到全螢幕的條件
 * @param {*} maxWidth 
 * @returns 
 */
export const useAutoFullScreen = maxWidth => {
    const theme = useTheme();
    const underXL = useMediaQuery(theme.breakpoints.down('xl'));
    const underLG = useMediaQuery(theme.breakpoints.down('lg'));
    const underMD = useMediaQuery(theme.breakpoints.down('md'));
    const underSM = useMediaQuery(theme.breakpoints.down('sm'));
    const underXS = useMediaQuery(theme.breakpoints.down('xs'));

    const fullScreen = useMemo(() => (maxWidth == 'xl' && underXL) || (maxWidth == 'lg' && underLG) || (maxWidth == 'md' && underMD)
        || (maxWidth == 'sm' && underSM) || (maxWidth == 'xs' && underXS),
        [underXL, underLG, underMD, underSM, underXS]);

    return fullScreen;
};

/**
 * hook 執行遠端查詢
 * @param {*} fetchFunc 
 * @param {*} param1 成功/失敗 callback functions
 * @returns 
 */
export const useFetch = (fetchFunc, { success, failure }) => {
    const { execute, pending, value, error } = useResponseVO(fetchFunc);

    useEffect(() => {
        error && failure && failure(error);
        value && success && success(value);
    }, [value, error]);

    return { execute, pending };
}