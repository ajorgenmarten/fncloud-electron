import { Handle, NodeProps, Position } from "reactflow";
import { IResponseNodeData } from "../../../app/types";
import { useContext, useState } from "react";
import { AppContext } from "../../../app/context";

export function ResponseNode (props: NodeProps<IResponseNodeData>) {
    const { success, indicator, changeStatus, save } = hook(props)

    return <div className={`flex w-40 flex-col bg-slate-900 p-2 rounded-md text-slate-400 ${ props.selected && 'outline outline-1 outline-teal-400' }`}>
        <div className="flex items-center mb-2">
            { indicator && <i className="bi bi-circle-fill mr-2 text-[6px] ml-1 text-white"></i> }

            <span className="grow">RESPONSE</span>
            <i className="bi bi-lightning-charge-fill"></i>
        </div>
        <select className="node-input" defaultValue={success} onChange={changeStatus}>
            <option value="ok">OK</option>
            <option value="bad">BAD</option>
        </select>
        <button 
                className={`bg-teal-700 
                mt-2
                p-1 rounded-md 
                text-gray-200 
                ${indicator && 'hover:bg-teal-500 active:bg-teal-600'}  
                ${!indicator && 'bg-teal-950 text-slate-600 dragable'}`} 
                disabled={!indicator}
                onClick={save}
            >
                <span className="uppercase font-semibold">save</span>
            </button>
        <Handle type="target" position={Position.Left} className="h-4 w-2 rounded-sm border border-gray-400 bg-yellow-500"/>
    </div>
}

const hook = (props: NodeProps<IResponseNodeData>) => {
    const { selectedService, updateService } = useContext(AppContext)
    const [success, setSuccess] = useState<IResponseNodeData['success']>(props.data?.success ?? 'ok')
    const [indicator, setIndicator] = useState<boolean>(props.data.indicator ?? false)

    const changeStatus: React.ChangeEventHandler<HTMLSelectElement> = (evt) =>{
        setIndicator(true)
        setSuccess(evt.target.value as IResponseNodeData['success'])
    }

    const save = async () => {
        setIndicator(false)
        const response = await window.ipcRenderer.invoke('nodes:save-response', selectedService?.name, { ...props, data: { success } })
        updateService && updateService({...response, name: selectedService?.name})
    }
    
    return { success, indicator, changeStatus, save }
}
