import { useEffect, useState } from "react"
import { ModelData, ServiceData, ServiceTemplate } from "./types"
import { ServiceJson } from "../../electron/src/types"

export const useModel = () => {
    const [models, setmodels] = useState<ModelData[]>([])
    const [selectedModel, setSelectedModel] = useState<string|null>(null)

    /**
     * Funcion de utilidad para buscar el indice de un modelo por su nombre
     * @param name Nombre del modelo a buscar 
     * @returns Retorna -1 sino existe, si existe, retorna la posicion del elemento
     */
    const getIndex = (name: string) => {
        return models.findIndex(m => m.name == name)
    }

    const createModel = async (name: string) => {
        const response = await window.ipcRenderer.invoke('models:create', name) as ModelData | false
        if ( response != false ) {
            setmodels( [...models, response] )
        }
    }

    const deleteModel = async (name: string) => {
        await window.ipcRenderer.invoke('models:delete', name)
        models.splice( getIndex(name), 1 )
        setmodels( [...models] )
    }

    const renameModel = async (name: string, newName: string) => {
        await window.ipcRenderer.invoke('models:rename', name, newName)
        const index = getIndex(name)
        models[index].name = newName
        models[index].path = `file:///models/${newName}.d.ts`
        setmodels([...models])
    }

    const saveData = async (name: string, data: string) => {
        await window.ipcRenderer.invoke('models:update-data', name, data)
        setmodels(prev => {
            prev[getIndex(selectedModel as string)].data = data
            return prev
        })
    }

    const selectModel = (name: string|null) => setSelectedModel(name)

    const getAllModels = async () => {
        const allmodels = await window.ipcRenderer.invoke('models:get-all') as ModelData[]
        setmodels(allmodels)
    }

    /**
     * Effecto para obtener todos los modelos al inicio de la carga de la app
     */
    useEffect(() => {
        getAllModels()
    }, [])

    return { models, selectedModel, createModel, deleteModel, renameModel, saveData, selectModel }
}

export const useServices = () => {
    const [services, setServices] = useState<ServiceData[]>([])
    const [selectedService, setSelectedService] = useState<string|null>(null)
    const [templates, setTemplates] = useState<ServiceTemplate[]>([])

    const getIndex = (name: string) => {
        return services.findIndex(s => s.name == name)
    }

    const createService = async (name: string) => {
        await window.ipcRenderer.invoke('services:create', name)
        setServices([...services, { name }])
    }

    const renameService = async (name: string, newName: string) => {
        await window.ipcRenderer.invoke('services:rename', name, newName)
        const index = getIndex(name)
        services[index].name = newName
        setServices([...services])
    }

    const deleteService = async (name: string) => {
        await window.ipcRenderer.invoke('services:delete', name)
        const index = getIndex(name)
        services.splice(index, 1)
        setServices([...services])
    }

    const selectService = async (name: string|null) => {
        setSelectedService(name)
    }

    const loadAllServices = async () => {
        const services = await window.ipcRenderer.invoke('services:get-all')
        setServices( services )
    }

    const loadAllServiceTemplates = async () => {
        const templates = await window.ipcRenderer.invoke('services:get-all-templates')
        setTemplates(templates)
    }

    useEffect(() => {
        loadAllServices()
        loadAllServiceTemplates()
    }, [])

    return { services, selectedService, templates, createService, renameService, deleteService, selectService }
}