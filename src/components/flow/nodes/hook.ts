import { useCallback, useState } from "react"

export const useNode = (saveCallback?: Function, validationCallback?: Function, indicatorStatus?: boolean) => {
    const [indicator, setIndicator] = useState<boolean>(indicatorStatus ?? true)
    const [errorMsg, setErrorMsg] = useState<string|null>(null)

    const saveFunc = useCallback(async () => {
        try {
            let validationResult
            if ( validationCallback ) {
                validationResult = await validationCallback()
            } else validationResult = true
            if ( validationResult ) {
                setIndicator(false)
                setErrorMsg(null)
                saveCallback && saveCallback
            }
        } catch (error) {
            const message = (error as Error).message
            setErrorMsg(message)
        }
    }, [])

    return { indicator, errorMsg, setIndicator, saveFunc }
}