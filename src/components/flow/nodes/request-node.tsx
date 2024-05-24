import { Handle, NodeProps, Position } from "reactflow";
import { useContext, useState } from "react";
import { AppContext } from "../../../app/context";

 
export function RequestNode (props: NodeProps) {

    const { indicator, method, onChangePath, onChangeMethod, saveNodeRequest } = hook(props)

    return <div className="w-60 bg-slate-900 p-2 rounded-md shadow-xl">

        <div className="flex items-center mb-4 border-b-[1px] border-gray-600">

            { indicator && <i className="bi bi-circle-fill text-[6px] ml-1 text-white"></i> }

            <span className="w-full
                        h-[34px]
                        grow
                        border-transparent
                        border
                        text-gray-500
                        px-2
                        py-1">
                    Request
            </span>
            
            <i className="bi bi-globe2 text-slate-500"></i>

        </div>

        <div className="flex flex-col gap-3">

            <div>
                <span className="uppercase text-gray-400">Endpoint path</span>
                <input type="text" className="request-node-input nodrag" value={props.data.path} spellCheck={false} onChange={onChangePath}/>
            </div>

            <div>
                <span className="uppercase text-gray-400">Request method</span>
                <select className="request-node-input" onChange={onChangeMethod} defaultValue={method}>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                </select>
            </div>
            
            <button 
                className={`bg-teal-700 
                p-1 rounded-md 
                text-gray-200 
                ${indicator && 'hover:bg-teal-600'}  
                ${!indicator && 'bg-teal-950 text-slate-600 dragable'}`} 
                disabled={!indicator}
                onClick={saveNodeRequest}
            >
                <span className="uppercase font-semibold">save</span>
            </button>


        </div>

        <Handle position={Position.Right} type="source" className="h-4 w-2 rounded-sm border border-gray-400 bg-emerald-600"/>

    </div>
}

const hook = (props: NodeProps) => {
    type TMethods = "GET" | "POST" | "PUT" | "DELETE"
    
    const { selectedService } = useContext(AppContext)
    const [path, setPath] = useState<string>(props.data.path ?? '')
    const [method, setMethod] = useState<TMethods>(props.data.method ?? '')
    const [indicator, setIndicator] = useState<boolean>(false)

    const onChangePath: React.ChangeEventHandler<HTMLInputElement> = (evt) => {
        setIndicator(true)
        setPath(evt.target.value)
    }

    const onChangeMethod: React.ChangeEventHandler<HTMLSelectElement> = (evt) => {
        setIndicator(true)
        setMethod(evt.target.value as TMethods)
    }

    const saveNodeRequest = () => {
        setIndicator(false)
        console.log(path)
        window.ipcRenderer.invoke('services:create-endpoint', selectedService, props.id, props.xPos, props.yPos, path, method)
    }

    return { indicator, method, onChangePath, onChangeMethod, saveNodeRequest }
}