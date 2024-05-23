import { Handle, Position } from "reactflow";
import { useState } from "react";

 
export function RequestNode () {
    const { name, edit, handleEdit } = hook()

    return <div className="w-60 bg-slate-900 p-2 rounded-md shadow-xl">

        <div className="flex items-center mb-4 border-b-[1px] border-gray-600 pb-2">

            {
                edit ?

                <input 
                    autoFocus
                    spellCheck={false} 
                    className="request-node-input nodrag"
                    type="text" /> :

                <span className="w-full
                        h-[34px]
                        grow
                        border-transparent
                        border
                        text-gray-500
                        px-2
                        py-1">
                    {name}
                </span> 

            }
            
            
            {
                edit ?

                <button className="hover:text-orange-300 text-slate-500 w-8 h-8" onClick={handleEdit}>
                    <i className="bi bi-floppy"></i>
                </button> :

                <button className="hover:text-orange-300 text-slate-500 w-8 h-8" onClick={handleEdit}>
                    <i className="bi bi-pencil"></i>
                </button> 
            }

        </div>

        <div className="flex flex-col gap-3">

            <div>
                <span className="uppercase text-gray-400">Endpoint path</span>
                <input type="text" className="request-node-input nodrag" spellCheck={false} />
            </div>
            
            <button className="bg-teal-700 p-1 rounded-md">
                <span className="uppercase text-gray-200 font-semibold">save</span>
            </button>


        </div>

        <Handle position={Position.Right} type="source" id="aa" className="h-4 w-2 rounded-sm border border-gray-400 bg-emerald-600"/>

    </div>
}

const hook = () => {
    const [indicator, setIndicator] = useState<boolean>(false)
    const [name, setName] = useState<string>('')
    const [edit, setEdit] = useState<boolean>(false)

    const handleEdit = () => {
        setEdit(!edit)
    }

    return { name, edit, indicator, handleEdit }
}