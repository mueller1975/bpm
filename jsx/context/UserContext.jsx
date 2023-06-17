/**
 * 登入者 Context
 */
import React, { createContext, useEffect, useReducer } from 'react'
import { getStaff, getLoginUser } from 'API/authentication.jsx'
import { LOGIN_USER } from 'Config'

export const RESET_USER = 0, SET_USER = 1, APPEND_USER = 2

const initialState = {}

const reducer = (state, action) => {
    const { type, payload } = action

    switch (type) {
        case RESET_USER: // 清除登入者資訊
            return {}
        case SET_USER: // 設定登入者資訊
            return payload
        case APPEND_USER: // 新增或取代登入者資訊
            return { ...state, ...payload }
        default:
            throw new Error(`未支援的 UserContext action type: ${type}`)
    }
}

export const UserContext = createContext()

export const UserContextProvider = props => {
    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        (async () => {
            let user = {};

            // 取得登入者及其角色資訊
            try {
                user = await getLoginUser()
            } catch (err) {
                console.error(err)
            }

            dispatch({ type: SET_USER, payload: user })

            // 查詢登入者員工資訊
            let promise = getStaff(LOGIN_USER)

            promise.then(response => {
                // 查詢成功
                if (response.success) {
                    let payload = response.message
                    user = { ...user, ...payload }
                    dispatch({ type: SET_USER, payload: user })
                } else {
                    console.error('ERROR', response)
                }
            }).catch(error => {
                console.error(error)
            })
        })()
    }, [])

    return (
        <UserContext.Provider value={{ state, dispatch }}>
            {props.children}
        </UserContext.Provider>
    )
}