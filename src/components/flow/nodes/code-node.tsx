import { useContext, useEffect, useRef, useState } from "react"
import * as monaco from 'monaco-editor'
import { Handle, Position, NodeProps } from "reactflow"
import { ICodeNodeData } from "../../../app/types"
import { AppContext } from "../../../app/context"

export function CodeNode(props: NodeProps<ICodeNodeData>) {
    const { selectedService } = useContext(AppContext)
    const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor|null>(null)
    const [model, setModel] = useState<monaco.editor.ITextModel|null>(null)
    const containerCode = useRef<HTMLDivElement | null> (null)
    const { indicator, name, value, errorMsg, save, changeName, changeValue } = hook(props)

    useEffect(() => {
        const seteditor = monaco.editor.create(containerCode.current as HTMLElement, { language: 'typescript', theme: 'vs-dark', automaticLayout: true })
        const setmodel = monaco.editor.createModel(value, undefined, monaco.Uri.parse(`file:///services/${selectedService}/${name}.ts`))
            seteditor.setModel(setmodel)
            seteditor.onKeyUp(changeValue)
        
        setEditor(seteditor)
        
        return () => {
            setmodel?.dispose()
            seteditor.dispose()
            setEditor(null)
            setModel(null)
        }
    }, [])

    return <div className={`w-96 h-96 flex flex-col bg-slate-900 rounded-md p-2 text-slate-400 ${ props.selected && 'outline outline-1 outline-teal-400' }`}>
        <div className="flex items-center mb-1">
            { indicator && <i className="bi bi-circle-fill mr-2 text-[6px] ml-1 text-white"></i>}
            <span className="grow">CODE</span>
            <i className="bi bi-code"></i>
        </div>
        <div className="flex gap-1 h-12 mb-1 items-center">
            <input type="text" className="node-input nodrag" value={name} onChange={changeName} spellCheck={false} />
            <button className={`bg-teal-700
                px-2
                p-1
                rounded-md
                text-gray-200
                ${indicator && 'hover:bg-teal-500 active:bg-teal-600'}
                ${!indicator && 'bg-teal-950 text-slate-600 dragable'}`}
                onClick={save}
                disabled={!indicator}
            >
                    save
            </button>
        </div>
        <div className="w-full h-full grow nodrag" ref={containerCode} >

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
    const { selectedService } = useContext(AppContext)
    const [name, setName] = useState<string>(props.data.name ?? '')
    const [value, setValue] = useState<string>(props.data.value ?? '')
    const [indicator, setIndicator] = useState<boolean>(props.data?.indicator ?? false)
    const [errorMsg, setErrorMsg] = useState<string|null>(null)

    const changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIndicator(true)
        setName(e.target.value)
    }
    const changeValue = (e: monaco.IKeyboardEvent) => {
        setIndicator(true)
        setValue((e.target as HTMLTextAreaElement).value)
    }
    const save = async () => {
        const regexp = /^[a-z]+$/g
        if (!name) {
            setErrorMsg('Type a name for a code node')
            return
        }
        if (!regexp.test(name)) {
            setErrorMsg('The name of a code node only can contain letters')
            return
        }
        setErrorMsg(null)
        setIndicator(false)
        const data: ICodeNodeData = { name, path: props.data.path, value, indicator: false } 
        const nodePorps = { ...props, data }
        const template = await window.ipcRenderer.invoke('services:save-node', selectedService, nodePorps)
        console.log(template)
    }


    return { name, value, indicator, errorMsg, changeName, changeValue, save }
}