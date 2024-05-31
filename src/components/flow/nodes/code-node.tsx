import { useCallback, useEffect, useRef, useState } from "react"
import * as monaco from 'monaco-editor'
import { Handle, Position, NodeProps } from "reactflow"
import { ICodeNodeData } from "../../../app/types"
import { useNode } from "./hook"

export function CodeNode(props: NodeProps<ICodeNodeData>) {
    const codeContainer = useRef<HTMLDivElement>(null)
    const { handleOnChange, onSave, errorMsg, indicator } = hook(props)

    useEffect(() => {
        let model = monaco.editor.createModel('//Start codign...', 'typescript', monaco.Uri.parse('file:///services/code.ts'))
        let editor = monaco.editor.create(codeContainer.current as HTMLElement, { theme: 'vs-dark', language: 'typescript', model })
        editor.onKeyDown(e => console.log(e))
        return () => {
            editor.dispose()
            model.dispose()
        }
    }, [])

    return <div className={`w-96 h-96 flex flex-col bg-slate-900 rounded-md p-2 text-slate-400 ${ props.selected && 'outline outline-1 outline-teal-400' }`}>
        <div className="flex items-center mb-1">
            { indicator && <i className="bi bi-circle-fill mr-2 text-[6px] ml-1 text-white"></i>}
            <span className="grow">CODE</span>
            <i className="bi bi-code"></i>
        </div>
        <div className="flex gap-1 h-12 mb-1 items-center">
            <input type="text" className="node-input nodrag" onChange={handleOnChange} spellCheck={false} />
            <button className={`bg-teal-700
                px-2
                p-1
                rounded-md
                text-gray-200
                ${indicator && 'hover:bg-teal-500 active:bg-teal-600'}
                ${!indicator && 'bg-teal-950 text-slate-600 dragable'}`}
                onClick={onSave}
                disabled={!indicator}
            >
                    save
            </button>
        </div>
        <div className="w-full h-full grow nodrag" ref={codeContainer}>

        </div>
        <Handle type="source" position={Position.Right} className="h-4 w-2 rounded-sm border border-gray-400 bg-teal-600" />
        <Handle type="target" position={Position.Left} className="h-4 w-2 rounded-sm border border-gray-400 bg-yellow-500" />
        {

            errorMsg != null &&

            <div className="absolute w-full left-0 mt-4 rounded-md p-1 -bottom-10 text-white bg-rose-500">
                <i className="bi bi-exclamation-triangle text-rose-900"></i> {errorMsg}
            </div>
        }
    </div>
}

const hook = (props: NodeProps<ICodeNodeData>) => {
    const [name, setName] = useState<string>(props.data?.name ?? '')
    const [value, setValue] = useState<string>(props.data?.value ?? '')
    const [path, setPath] = useState<string>(props.data?.path ?? '')

    const validateCallback = useCallback(() => {
        if (!name) throw new Error('Set the name of the code node')
        return true
    }, [])

    const { onSave, errorMsg, indicator } = useNode(props, validateCallback)

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('handle name')
        props.data.name = event.target.value
        setName(event.target.value)
    }

    return { name, value, path, errorMsg, indicator, handleOnChange, onSave }
}