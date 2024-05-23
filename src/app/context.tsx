import { createContext } from "react"
import { AppProviderProps } from "./types"
import { useModel, useServices } from "./hook"

export const AppContext = createContext<
    Partial<
        ReturnType<typeof useModel> &
        ReturnType<typeof useServices>
    >
>({})

export const AppProvider = (props: AppProviderProps) => {
    const usemodels = useModel()
    const useservices = useServices()
    
    return <AppContext.Provider value={{...usemodels , ...useservices}}>
        { props.children }
    </AppContext.Provider>
}