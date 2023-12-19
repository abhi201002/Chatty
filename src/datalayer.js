import React, { createContext, useContext, useReducer } from "react"

export const Data = createContext();
export const Layer = ({reducer, initialState, children}) =>{
    return(
        <Data.Provider value = {useReducer(reducer, initialState)}>
            {children}
        </Data.Provider>
    )
}

export const useDataLayer = () => useContext(Data);