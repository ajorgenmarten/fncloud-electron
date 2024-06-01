import { useEffect, useState } from "react"
import * as monaco from 'monaco-editor'
import { ModelData } from "../app/types"

export const Loader = () => {
    const [models, setModels] = useState<ModelData[]>([])
    const [selectedModel, setSelectedModel] = useState<ModelData|null>(null)

    /**
     * Cargar todos los models guardados
     */
    const loadmodels = async () => {
        console.log('Load models')
        const loadedmodels = await window.ipcRenderer.invoke('models:all') as ModelData[]
        setModels(loadedmodels)

        console.log('Set models')
        loadedmodels.forEach(model => {
            monaco.editor.createModel(model.data, 'typescript', monaco.Uri.parse(model.path))
        })

        console.log('Finished')
    }


    /**
     * Crea un modelo en la carpeta del proyecto
     * @param model_name Nombre del modelo que se va a guardar
     */
    const createModel = async (model_name: string) => {
        console.log('Creating model')

        const modeldata = await window.ipcRenderer.invoke('models:create', model_name) as ModelData
        monaco.editor.createModel(modeldata.data, 'typescript', monaco.Uri.parse(modeldata.path))

        console.log('Finished')
        setModels([...models, modeldata])
    }

    /**
     * Modifica el valor del modelo del proyecto
     * @param model_name Nombre del modelo al que se le va a cambiar el valor
     * @param model_data Valor que se va a establecer en el modelo
     */
    const saveModel = async (model_name: string, model_data: string) => {
        console.log('Saving Model')

        const model = await window.ipcRenderer.invoke('models:save', model_name, model_data) as ModelData
        monaco.editor.getModel(monaco.Uri.parse(model.path))?.setValue(model.data)

        const index = models.findIndex(model => model.name == model_name)
        models[index].data = model.data

        console.log('Finished')
        setModels([...models])
    }

    /**
     * Modifica el nombre del modelo del proyecto
     * @param old_name Nombre actual del modelo a renombrar
     * @param new_name Nombre nuevo que se va a establecer al modelo
     */
    const renameModel = async (old_name: string, new_name: string) => {
        console.log('Change name')

        const model = await window.ipcRenderer.invoke('models:rename', old_name, new_name) as ModelData & { oldpath: string }
        monaco.editor.getModel(monaco.Uri.parse(model.oldpath))?.dispose()
        monaco.editor.createModel(model.data, 'typescript', monaco.Uri.parse(model.path))

        const index = models.findIndex(model => model.name == old_name)
        models[index].name = new_name

        console.log('Finished')
        setModels([...models])
        setSelectedModel(model)
    }

    /**
     * Borra un modelo de la carpeta del proyecto
     * @param model_name Nombre del model a borrar en la carpeta del proyecto
     */
    const deleteModel = async (model_name: string) => {
        console.log('Deleting model')

        const { path } = await window.ipcRenderer.invoke('models:delete', model_name) as { path: string }
        monaco.editor.getModel(monaco.Uri.parse(path))?.dispose()

        const index = models.findIndex(model => model.name == model_name)
        models.splice(index, 1)

        console.log('Finished')
        setModels([...models])
    }

    /**
     * Selecciona un modelo
     * @param name Nombre del modelo a seleccionar
     */
    const selectModel = (name: string) => {
        const model = models.find(model => model.name == name) as ModelData
        setSelectedModel(model)
    }

    useEffect(() => {
        loadmodels()
    }, [])

    useEffect(() => {
        if (selectedModel != null) {
            setSelectedModel(null)
        }
    }, [models])

    return { models, selectedModel, selectModel, createModel, saveModel, renameModel, deleteModel }
}