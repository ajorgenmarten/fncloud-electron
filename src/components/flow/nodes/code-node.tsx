import { useEffect, useRef } from "react"
import * as monaco from 'monaco-editor'
import { Handle, Position } from "reactflow"

export function CodeNode() {
    const codeContainer = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let editor = monaco.editor.create(codeContainer.current as HTMLElement, { theme: 'vs-dark', language: 'typescript', value: 'const a = 0' })
        return () => {
            editor.dispose()
        }
    }, [])

    return <div className="w-96 h-96 flex flex-col bg-slate-900 rounded-md p-1">
        <div className="h-12">

        </div>
        <div className="w-full h-full grow nodrag" ref={codeContainer}>

        </div>
        <Handle type="source" position={Position.Right} className="h-4 w-2 rounded-sm border border-gray-400 bg-teal-600" />
        <Handle type="target" position={Position.Left} className="h-4 w-2 rounded-sm border border-gray-400 bg-yellow-500"/>
    </div>
}