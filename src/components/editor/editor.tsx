import { useContext, useEffect, useRef } from "react"
import { AppContext } from "../../app/context"
import * as monaco from 'monaco-editor'

export function Editor() {
    const { models, selectedModel, saveData } = useContext(AppContext)
    const editorContainer = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        let editor = monaco.editor.create(editorContainer.current as HTMLDivElement, { theme: 'vs-dark', padding: { top: 20 }, fontFamily: 'cascadia code' })

        editor.addAction({
            id: 'save-model-data',
            label: 'save',
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
            run(editor) {
                const data = editor.getValue()
                const name = selectedModel
                saveData && saveData(name as string, data)
            },
        })
    
        models?.forEach(model => {
            if (monaco.editor.getModel(monaco.Uri.parse(model.path)) == null) {
                monaco.editor.createModel(model.data, 'typescript', monaco.Uri.parse(model.path))
            }
        })
        
        if (selectedModel != null) {
            const uri = `file:///models/${selectedModel}.d.ts`
            editor.setModel(monaco.editor.getModel(monaco.Uri.parse(uri)))
        }

        
        editorContainer.current?.addEventListener('wheel', ev => {
            console.log(ev)
        }) 

        return () => {
            editor.dispose()
        }
    }, [models, selectedModel])

    return <div className="h-full w-full grow" ref={editorContainer} >

    </div>
}

