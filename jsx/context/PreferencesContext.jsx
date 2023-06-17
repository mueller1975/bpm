/**
 * 個人偏好 Context
 */
import { APP_ALIAS, APP_THEME } from 'Config'
import en_us from 'Locale/en_us.json'
import en from 'Locale/en.json'
import zh_cn from 'Locale/zh_cn.json'
import zh_tw from 'Locale/zh_tw.json'
import React, { createContext, useEffect, useReducer } from 'react'
import { NORMAL } from 'Themes'

export const LOAD_PREFERENCES = 0, SAVE_PREFERENCES = 1, SET_THEME_TYPE = 2, SET_LANG = 3, SET_NOTIFICATION_DURATION = 4,
    SET_NOTIFICATION_MAX = 5, SET_FONT_SIZE = 6, SET_VIEW_SWIPEABLE = 7, SET_CELL_PADDING = 8

const allMessages = {
    'zh-tw': zh_tw,
    'zh-cn': zh_cn,
    'en-us': en_us,
    'en': en,
}

const defaultLang = (window && window.navigator && window.navigator.language.toLowerCase()) || 'zh-tw' // 抓取瀏覽器語系設定

const initialState = {
    lang: defaultLang, // 語言
    themeType: APP_THEME, // 預設主題為 dark
    fontSize: NORMAL, // 預設字體大小為 normal
    cellPadding: NORMAL, // 預設表格邊距為 normal
    notificationDuration: 2500, // 預設訊息顯示時間
    notificationMax: 3, // 預設訊息佇列數
    viewSwipeable: false, // 預設不可滑動切換頁面

    // 以下為不會被儲存的屬性
    langChangeable: true, // 可切換語系
    messages: allMessages[defaultLang], // 多國語言
    dirty: false, // 設定已被更動
}

const preferences_key = `${APP_ALIAS}-PREFERENCES`

const reducer = (state, action) => {
    const { type, payload } = action

    switch (type) {
        case LOAD_PREFERENCES: // 載入個人偏好
            let appPreferences = payload || {} // props 上的偏好設定
            let savedPreferences = JSON.parse(window.localStorage.getItem(preferences_key)) || {} // 儲存的偏好設定
            state = { ...state, ...appPreferences, ...savedPreferences } // 儲存偏好 > props 偏好 > 預設偏好

            let messages = allMessages[state.lang]

            if (!messages) {
                console.warn(`沒有對應語系 [${state.lang}] 的 i18n JSON file，將使用預設語系 [${defaultLang}]！`)
                state.lang = defaultLang // 無對應語系的 i18n, 則取 zh-tw 語系 i18n
                messages = allMessages[defaultLang]
            }

            state.messages = messages

            return state
        case SAVE_PREFERENCES: // 儲存個人偏好
            if (state.dirty) {
                const { lang, themeType, fontSize, cellPadding, viewSwipeable, notificationDuration, notificationMax } = state
                let preferences = { lang, themeType, fontSize, cellPadding, viewSwipeable, notificationDuration, notificationMax }

                window.localStorage.setItem(preferences_key, JSON.stringify(preferences))
                state = { ...state, dirty: false }
            }
            return state
        case SET_THEME_TYPE: // 設定主題
            return { ...state, themeType: payload, dirty: true }
        case SET_FONT_SIZE: // 設定字體大小
            return { ...state, fontSize: payload, dirty: true }
        case SET_CELL_PADDING: // 設定表格邊距大小
            return { ...state, cellPadding: payload, dirty: true }
        case SET_LANG: // 設定語系
            return { ...state, lang: payload, messages: allMessages[payload], dirty: true }
        case SET_NOTIFICATION_DURATION: // 設定訊息顯示時間
            return { ...state, notificationDuration: payload, dirty: true }
        case SET_NOTIFICATION_MAX: // 設定訊息佇列數
            return { ...state, notificationMax: payload, dirty: true }
        case SET_VIEW_SWIPEABLE: // 設定可否滑動切換頁面
            return { ...state, viewSwipeable: payload, dirty: true }
        default:
            throw new Error(`未支援的 PreferencesContext action type: ${action.type}`)
    }
}

export const PreferencesContext = createContext()

export const PreferencesContextProvider = props => {
    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        dispatch({ type: LOAD_PREFERENCES })
    }, [])

    return (
        <PreferencesContext.Provider value={{ state, dispatch }}>
            {props.children}
        </PreferencesContext.Provider>
    )
}
