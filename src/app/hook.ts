import { useEffect, useState } from "react"
import { ModelData, ServiceData } from "./types"
import { IObjectTemplate } from "../../electron/src/types"

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
    const [templates, setTemplates] = useState<IObjectTemplate[]>([])

    const getServiceIndex = (name: string) => {
        return services.findIndex(s => s.name == name)
    }
    const getTemplateIndex = (name: string) => {
        return templates.findIndex(t => t.templateName == name)
    } 

    const createService = async (name: string) => {
        await window.ipcRenderer.invoke('services:create', name)
        loadServiceTemplate(name)
        setServices([...services, { name }])
    }

    const renameService = async (name: string, newName: string) => {
        await window.ipcRenderer.invoke('services:rename', name, newName)
        const serviceIndex = getServiceIndex(name)
        const templateIndex = getTemplateIndex(name)
        templates[templateIndex].templateName = newName
        services[serviceIndex].name = newName
        setServices([...services])
        setTemplates([...templates])
    }

    const deleteService = async (name: string) => {
        await window.ipcRenderer.invoke('services:delete', name)
        const serviceIndex = getServiceIndex(name)
        const templateIndex = getTemplateIndex(name)
        services.splice(serviceIndex, 1)
        templates.splice(templateIndex, 1)
        setServices([...services])
        setTemplates([...templates])
        setSelectedService(null)
    }

    const selectService = async (name: string|null) => {
        setSelectedService(name)
    }

    const getAllServices = async () => {
        const services = await window.ipcRenderer.invoke('services:get-all')
        setServices( services )
    }

    const loadAllServiceTemplates = async () => {
        const templates = await window.ipcRenderer.invoke('services:get-all-templates')
        setTemplates(templates)
    }

    const loadServiceTemplate = async (name: string) => {
        const template = await window.ipcRenderer.invoke('services:get-template', name)
        setTemplates([...templates, template])
    }

    const updateTemplate = (template: IObjectTemplate) => {
        const findIndex = templates.findIndex(t => t.templateName == template.templateName)
        templates[findIndex] = template
        setTemplates([...templates])
    }

    useEffect(() => {
        console.log(templates)
    }, [templates])

    useEffect(() => {
        getAllServices()
        loadAllServiceTemplates()
    }, [])

    return { services, selectedService, templates, createService, renameService, deleteService, selectService, updateTemplate }
}