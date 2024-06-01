import { useEffect, useState } from "react"
import { ModelData, ServiceData } from "./types"
import { IObjectTemplate } from "../../electron/src/types"
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
        models[index].name = model.name
        models[index].path = model.path

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

    return { models, selectedModel, selectModel, createModel, saveModel, renameModel, deleteModel }
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

    const getTemplate = (templateName: string) => {
        return templates.find(template => template.templateName == templateName)
    }

    useEffect(() => {
        console.log(templates)
    }, [templates])

    useEffect(() => {
        getAllServices()
        loadAllServiceTemplates()
    }, [])

    return { services, selectedService, templates, createService, renameService, deleteService, selectService, updateTemplate, getTemplate }
}