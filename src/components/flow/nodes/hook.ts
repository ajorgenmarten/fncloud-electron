import { useContext, useState } from "react"
import { AppContext } from "../../../app/context"
import { NodeProps } from "reactflow"

export const useNode = (props: NodeProps, validateCallback?: Function) => {
    const { selectedService, updateTemplate } = useContext(AppContext)
    const [indicator, setIndicator] = useState<boolean>(props.data?.indicator ?? false)
    const [errorMsg, setErrorMsg] = useState<string|null>(null)

    const onSave = async () => {
        try {
            let validationResult
            if ( validateCallback ) {
                validationResult = await validateCallback(props)
            } else validationResult = true
            if ( validationResult ) {
                setErrorMsg(null)
                setIndicator(false)
                if ( props.data.indicator ) props.data.indicator = false
                const template = await window.ipcRenderer.invoke('services:save-node', selectedService, props)
                updateTemplate && updateTemplate({ templateName: selectedService as string, template })
            }
        } catch (error) {
            setErrorMsg((error as Error).message)
        }
    }

    return {indicator, errorMsg, setIndicator, onSave}
}

export const useHandlers = () => {
}