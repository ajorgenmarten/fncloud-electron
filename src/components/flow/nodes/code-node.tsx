import { useEffect, useRef, useState } from "react"
import * as monaco from 'monaco-editor'
import { Handle, Position } from "reactflow"

export function CodeNode() {
    const codeContainer = useRef<HTMLDivElement>(null)
    const { handleOnChange } = hook()

    useEffect(() => {
        let model = monaco.editor.createModel('//Start codign...', 'typescript', monaco.Uri.parse('file:///services/code.ts'))
        let editor = monaco.editor.create(codeContainer.current as HTMLElement, { theme: 'vs-dark', language: 'typescript', model })
        editor.onKeyDown(e => console.log(e))
        return () => {
            editor.dispose()
            model.dispose()
        }
    }, [])

    return <div className="w-96 h-96 flex flex-col bg-slate-900 rounded-md p-2 text-slate-400">
        <div className="flex items-center mb-1">
            <i className="bi bi-circle-fill mr-2 text-[6px] ml-1 text-white"></i>
            <span className="grow">CODE</span>
            <i className="bi bi-code"></i>
        </div>
        <div className="flex gap-1 h-12 mb-1 items-center">
            <input type="text" className="node-input nodrag" spellCheck={false}/>
            <button className={`bg-teal-700 px-2 p-1 rounded-md text-gray-200`}>save</button>
        </div>
        <div className="w-full h-full grow nodrag" ref={codeContainer}>

        </div>
        <Handle type="source" position={Position.Right} className="h-4 w-2 rounded-sm border border-gray-400 bg-teal-600" />
        <Handle type="target" position={Position.Left} className="h-4 w-2 rounded-sm border border-gray-400 bg-yellow-500"/>
    </div>
}

const hook = () => {
    const [name, setName] = useState<string>('')
    const [value, setValue] = useState<string>('')

    const handleOnChange = (_event: monaco.editor.IModelContentChangedEvent, value: string) => {
        () => setValue(value)
    }

    return { name, value, handleOnChange }
}