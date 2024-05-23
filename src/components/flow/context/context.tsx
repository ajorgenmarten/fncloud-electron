import { createContext } from "react";
import { useFlow } from "./hook";

export const FlowContext = createContext<
    Partial<ReturnType <typeof useFlow>>
>({})

export const FlowProvider = (props: FlowProviderProps) => {
    const useflow = useFlow()
    return <FlowContext.Provider value={useflow}>
        {props.children}
    </FlowContext.Provider>
}

interface FlowProviderProps {
    children: React.ReactNode
}