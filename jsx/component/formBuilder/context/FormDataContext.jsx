import React, { createContext, useEffect, useReducer } from 'react';

const initialState = {};

const reducer = (state, action) => {
    const { type, payload } = action;

    return initialState;
}

export const FormDataContext = createContext();

export const FormDataContextProvider = props => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <FormDataContext.Provider value={{ state, dispatch }}>
            {props.children}
        </FormDataContext.Provider>
    );
}
