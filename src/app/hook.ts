import { useEffect, useState } from "react"
import { ModelData, ServiceData } from "./types"
import * as monaco from 'monaco-editor'

export const useModel = () => {
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
            const uri = monaco.Uri.parse(model.path)
            if (!monaco.editor.getModel(uri))
                monaco.editor.createModel(model.data, 'typescript', uri)
        })
    }


    /**
     * Crea un modelo en la carpeta del proyecto
     * @param model_name Nombre del modelo que se va a guardar
     */
    const createModel = async (model_name: string) => {
        console.log('Creating model')

        const modeldata = await window.ipcRenderer.invoke('models:create', model_name) as ModelData
        monaco.editor.createModel(modeldata.data, 'typescript', monaco.Uri.parse(modeldata.path))

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
        models[index].name = model.name
        models[index].path = model.path

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

        setModels([...models])
        setSelectedModel(null)
    }

    /**
     * Selecciona un modelo
     * @param name Nombre del modelo a seleccionar
     */
    const selectModel = (name: string|null) => {
        if (name == null) {
            setSelectedModel(null)
        } else {
            const model = models.find(model => model.name == name) as ModelData
            setSelectedModel(model)
        }
    }

    useEffect(() => {
        loadmodels()
    }, [])

    return { models, selectedModel, selectModel, createModel, saveModel, renameModel, deleteModel }
}




















































































export const useServices = () => {
    const [services, setServices] = useState<ServiceData[]>([])
    const [selectedService, setSelectedService] = useState<ServiceData|null>(null)

    const loadservices = async () => {
        console.log('Load services')
        const loadedservices = await window.ipcRenderer.invoke('services:all') as ServiceData[]
        setServices(loadedservices)
    }

    const createService = async (service_name: string) => {
        console.log('Create service')
        const service = await window.ipcRenderer.invoke('services:create', service_name) as ServiceData
        setServices([...services, service])
    }

    const renameService = async (old_name: string, new_name: string) => {
        console.log('Rename service')
        const index = services.findIndex(service => service.name == old_name)
        const service = await window.ipcRenderer.invoke('services:rename', old_name, new_name) as ServiceData
        services[index].name = service.name
        setServices([...services])
        setSelectedService(service)
    }

    const deleteService = async (service_name: string) => {
        console.log('Delete service')
        await window.ipcRenderer.invoke('services:delete', service_name) as Omit<ServiceData, "nodes" | "edges">
        const index = services.findIndex(service => service.name == service_name)
        services.splice(index, 1)
        setServices([...services])
    }

    const selectService = (service_name: string|null) => {
        if (service_name == null) {
            setSelectedService(null)
        } else {
            const service = services.find(service => service.name == service_name) as ServiceData
            setSelectedService(service)
        }
    }

    const updateService = (props: ServiceData) => {
        const index = services.findIndex(service => service.name == props.name)
        services[index] = props
        setServices([...services])
    }

    useEffect(() => {
        loadservices()
    }, [])


    return { services, selectedService, createService, renameService, deleteService, selectService, updateService }
}