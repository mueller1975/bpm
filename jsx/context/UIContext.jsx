/**
 * UI Context
 */
import { APP_ALIAS } from 'Config'
import React, { createContext, useReducer } from 'react'

export const SHOW_SIDE_MENU = 0, HIDE_SIDE_MENU = 1, SHOW_PREFERENCES = 2, HIDE_PREFERENCES = 3,
    DOCK_SIDE_MENU = 4, UNDOCK_SIDE_MENU = 5, TOGGLE_SIDE_MENU = 6

const initialState = {
    sideMenuDocked: false,
    sideMenuOpen: false,
    preferencesOpen: false,
}

const STORAGE_KEY = `${APP_ALIAS}-UI`

const reducer = (state, action) => {
    const { type, payload } = action
    let sideMenuDocked

    switch (type) {
        case SHOW_SIDE_MENU:
            return { ...state, sideMenuOpen: true }
        case HIDE_SIDE_MENU:
            if (!state.sideMenuDocked) {
                return { ...state, sideMenuOpen: false }
            } else {
                return state
            }
        case TOGGLE_SIDE_MENU:
            console.log({open: state.sideMenuOpen})
            return { ...state, sideMenuOpen: !state.sideMenuOpen }
        case SHOW_PREFERENCES:
            return { ...state, preferencesOpen: true }
        case HIDE_PREFERENCES:
            return { ...state, preferencesOpen: false }
        case DOCK_SIDE_MENU:
            sideMenuDocked = true
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ sideMenuDocked }))
            return { ...state, sideMenuDocked, sideMenuOpen: true }
        case UNDOCK_SIDE_MENU:
            sideMenuDocked = false
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ sideMenuDocked }))
            return { ...state, sideMenuDocked, sideMenuOpen: false }
        default:
            throw new Error(`未支援的 UIContext action type: ${type}`)
    }
}

export const UIContext = createContext()

export const UIContextProvider = props => {
    const [state, dispatch] = useReducer(reducer, initialState,
        state => {
            // 讀取儲存的設定值
            const savedSettings = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {}
            const { sideMenuDocked: sideMenuOpen = false } = savedSettings
            return { ...state, ...savedSettings, sideMenuOpen }
        })

    return (
        <UIContext.Provider value={{ state, dispatch }}>
            {props.children}
        </UIContext.Provider>
    )
}