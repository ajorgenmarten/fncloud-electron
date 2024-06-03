import { useContext, useEffect, useRef } from "react"
import { AppContext } from "../../app/context"
import * as monaco from 'monaco-editor'

export function Editor() {
    const { selectedModel, saveModel } = useContext(AppContext)
    const editorContainer = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        console.log('Mount editor')
        const editor = monaco.editor.create(editorContainer.current as HTMLDivElement, { theme: 'vs-dark', padding: { top: 20 }, fontFamily: 'cascadia code', automaticLayout: true })
        editor.addAction({
            id: 'save-model-data',
            label: 'save',
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
            run(editor) {
                const data = editor.getValue()
                const name = selectedModel && selectedModel.name
                saveModel && saveModel(name as string, data)
            },
        })
        editor.onDidChangeModel(() => console.log('Change model'))
        editor.onDidDispose(() => console.log('Dismount editor'))
        return () => {
            editor.dispose()
        }
    }, [])

    useEffect(() => {
        const editor = monaco.editor.getEditors()[0]
        if (selectedModel != null) {
            const editorModelPath = editor?.getModel()?.uri.path
            const selectedModelPath = monaco.Uri.parse(selectedModel.path).path
            if ( !editorModelPath || selectedModelPath != editorModelPath ) {
                editor?.setModel(monaco.editor.getModel(monaco.Uri.parse(selectedModel.path)))
            }
        }
    }, [selectedModel])

    return <div className="h-full w-[calc(100%-320px)]" ref={editorContainer} >

    </div>
}

