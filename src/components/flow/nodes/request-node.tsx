import { Handle, Position } from "reactflow";
import { IRequestNodeData } from "../../../app/types";
import { useContext, useState } from "react";
import { NodeProps } from "reactflow";
import { AppContext } from "../../../app/context";

 
export function RequestNode (props: NodeProps<IRequestNodeData>) { 

    const { path, indicator, method, errorMsg, onChangePath, onChangeMethod, save } = hook(props)

    return <div className={`w-60 bg-slate-900 p-2 rounded-md shadow-xl ${ props.selected && 'outline outline-1 outline-teal-400' }`}>

        <div className="flex items-center mb-4 border-b-[1px] border-gray-600 cursor-grab active:cursor-grabbing">

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
                <input type="text" className="node-input nodrag" value={path} spellCheck={false} onChange={onChangePath}/>
            </div>

            <div>
                <span className="uppercase text-gray-400">Request method</span>
                <select className="node-input" onChange={onChangeMethod} defaultValue={method}>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                </select>
            </div>
            
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


        </div>

        { 
        
            errorMsg != null &&
        
            <div className="absolute w-full left-0 mt-4 rounded-md p-1 text-white bg-rose-500">
                <i className="bi bi-exclamation-triangle text-rose-900"></i> {errorMsg}
            </div>
        }

        <Handle position={Position.Right} type="source" className="h-4 w-2 rounded-sm border border-gray-400 bg-emerald-600"/>

    </div>
}

const hook = (props: NodeProps<IRequestNodeData>) => {
    const { selectedService, updateService } = useContext(AppContext)
    const [indicator, setIndicator] = useState<boolean>(props.data.indicator ?? false)
    const [path, setPath] = useState<string>(props.data.path ?? '')
    const [method, setMethod] = useState<IRequestNodeData['method']>(props.data.method ?? 'GET')
    const [errorMsg, setErrorMsg] = useState<string|null>(null)

    const save = async () => {
        if ( !path ) {
            setErrorMsg('Set a path for this request')
            return
        }
        setErrorMsg(null)
        setIndicator(false)
        const response = await window.ipcRenderer.invoke('nodes:save-request', selectedService?.name, { ...props, data: { path, method } } as NodeProps)
        updateService && updateService({...response, name: selectedService?.name})
    }

    const onChangePath = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIndicator(true)
        setPath(e.target.value)
    }

    const onChangeMethod = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIndicator(true)
        setMethod(e.target.value as IRequestNodeData['method'])
    }

    return { indicator, path, method, errorMsg, save, onChangePath, onChangeMethod }
}