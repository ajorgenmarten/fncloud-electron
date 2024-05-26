import { useContext, useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { AppContext } from "../../../app/context";
import { useNode } from "./hook";
import { NodeResponsePropsData } from "../../../app/types";

export function ResponseNode (props: NodeProps<NodeResponsePropsData>) {
    const { success, indicator, changeStatus, saveFunc } = hook(props)

    return <div className="flex w-40 flex-col bg-slate-900 p-2 rounded-md text-slate-400">
        <div className="flex items-center mb-2">
            { indicator && <i className="bi bi-circle-fill mr-2 text-[6px] ml-1 text-white"></i> }

            <span>RESPONSE</span>
        </div>
        <select className="request-node-input" defaultValue={success} onChange={changeStatus}>
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
                onClick={saveFunc}
            >
                <span className="uppercase font-semibold">save</span>
            </button>
        <Handle type="target" position={Position.Left} className="h-4 w-2 rounded-sm border border-gray-400 bg-yellow-500"/>
    </div>
}

const hook = (props: NodeProps<NodeResponsePropsData>) => {

    const {selectedService} = useContext(AppContext)
    const [success, setSuccess] = useState<NodeResponsePropsData['success']>(props.data?.success ?? 'ok')

    const { indicator, setIndicator, saveFunc } = useNode(() => {
        window.ipcRenderer.invoke('services:create-response', selectedService, props.id, props.xPos, props.yPos, success)
    }, undefined, props.data?.indicator)

    const changeStatus: React.ChangeEventHandler<HTMLSelectElement> = (evt) =>{
        setIndicator(true)
        setSuccess(evt.target.value as NodeResponsePropsData['success'])
    }
    
    return { success, indicator, changeStatus, saveFunc }
}
