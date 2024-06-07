import { IpcMainInvokeEvent } from 'electron'
import fs from 'fs'
import { ITemplateJson, ModelData, ServiceData } from '../../src/app/types'
import { Edge, EdgeProps, Node, NodeProps } from 'reactflow'
import { IObjectTemplate } from './types'

const modelsPath = './project/models/'
const servicesPath = './project/services/'
const codesPath = './project/codes/'

function createModel (_evt: IpcMainInvokeEvent, model_name: string): ModelData|null {
    const pathToSave = `${modelsPath}${model_name}.d.ts`
    const modelExist = fs.existsSync(pathToSave)
    if (modelExist) return null
    else fs.writeFileSync(pathToSave, '')
    return { data: '', path: `file:///models/${model_name}.d.ts`, name: model_name }
}

function saveModel (_evt: IpcMainInvokeEvent, model_name: string, model_data: string): ModelData {
    const pathToSave = `${modelsPath}${model_name}.d.ts`
    fs.writeFileSync(pathToSave, model_data)
    return { data: model_data, name: model_name, path: `file:///models/${model_name}.d.ts` }
}

function renameModel (_evt: IpcMainInvokeEvent, model_oldname: string, model_newname: string): ModelData & { oldpath: string } {
    const oldpath = `${modelsPath}${model_oldname}.d.ts`
    const newpath = `${modelsPath}${model_newname}.d.ts`
    const data = fs.readFileSync(oldpath).toString()
    fs.renameSync(oldpath, newpath)
    return { data, name: model_newname, path: `file:///models/${model_newname}.d.ts`, oldpath: `file:///models/${model_oldname}.d.ts`  }
}

function deleteModel (_evt: IpcMainInvokeEvent, model_name: string) {
    fs.unlinkSync(`${modelsPath}${model_name}.d.ts`)
    return { path: `file:///models/${model_name}.d.ts` }
}

function getAllModels (): ModelData[] {
    return (fs.readdirSync(`${modelsPath}`) as `${string}.d.ts`[])
    .map( model => {
        const model_name = model.split('.')[0]
        const model_path = `file:///models/${model}`
        const model_data = fs.readFileSync(`${modelsPath}${model}`).toString()
        return { data: model_data, path: model_path, name: model_name } as ModelData
    } )
}

























































function createService (_evt: IpcMainInvokeEvent, name: string): ServiceData {
    fs.writeFileSync(`${servicesPath}template-${name}.json`, JSON.stringify({
        nodes: [],
        edges: [],
    }))
    fs.mkdirSync(codesPath + name)
    return { name, nodes: [], edges: [] }
}

function getAllServices (): ServiceData[] {
    const services = fs.readdirSync(servicesPath)
    return services.map(service => {
        const name = service.match(/^template-(\w+).json$/)?.[1] as string
        const serviceObject = JSON.parse ( fs.readFileSync(servicesPath + service).toString() ) as ServiceData
        return { ...serviceObject, name }
    })
}

function renameService (_evt: IpcMainInvokeEvent, old_name: string, new_name: string): ServiceData {
    const serviceOldName = `template-${old_name}.json`
    const serviceNewName = `template-${new_name}.json`
    fs.renameSync(servicesPath + serviceOldName, servicesPath + serviceNewName)
    fs.renameSync(codesPath + old_name, codesPath + new_name)
    const serviceObject = JSON.parse( fs.readFileSync(servicesPath + serviceNewName).toString() ) as ServiceData
    return { ...serviceObject, name: new_name }
}

function deleteService (_evt: IpcMainInvokeEvent, name: string): Omit<ServiceData, 'nodes' | 'edges' > {
    const serviceName = `template-${name}.json`
    fs.unlinkSync(servicesPath + serviceName)
    fs.rmSync(codesPath + name, { recursive: true })
    return { name }
}



























































function saveRequestNode (_evt: IpcMainInvokeEvent, service: string, props: NodeProps) {
    const serviceName = `template-${service}.json`
    const toSave = { id: props.id, data: props.data, type: props.type, xPos: props.xPos, yPos: props.yPos }
    const serviceObject = JSON.parse( fs.readFileSync( servicesPath + serviceName ).toString() ) as ServiceData
    const findIndex = serviceObject.nodes.findIndex(node => node.id == toSave.id)
    if (findIndex == -1) {
        serviceObject.nodes.push(toSave as NodeProps)
    } else {
        serviceObject.nodes[findIndex] = toSave as NodeProps
    }
    fs.writeFileSync(servicesPath + serviceName, JSON.stringify(serviceObject))
    return serviceObject
}

function saveResponseNode (_evt: IpcMainInvokeEvent, service: string, props: NodeProps) {
    const serviceName = `template-${service}.json`
    const toSave = { id: props.id, data: props.data, type: props.type, xPos: props.xPos, yPos: props.yPos }
    const serviceObject = JSON.parse( fs.readFileSync( servicesPath + serviceName ).toString() ) as ServiceData
    const findIndex = serviceObject.nodes.findIndex(node => node.id == toSave.id)
    if (findIndex == -1) {
        serviceObject.nodes.push(toSave as NodeProps)
    } else {
        serviceObject.nodes[findIndex] = toSave as NodeProps
    }
    fs.writeFileSync(servicesPath + serviceName, JSON.stringify( serviceObject ))
    return serviceObject
}

function saveConditionNode (_evt: IpcMainInvokeEvent, service: string, props: NodeProps) {
    const serviceName = `template-${service}.json`
    const toSave = { id: props.id, data: props.data, type: props.type, xPos: props.xPos, yPos: props.yPos }
    const serviceObject = JSON.parse( fs.readFileSync( servicesPath + serviceName).toString() ) as ServiceData
    const findIndex = serviceObject.nodes.findIndex(node => node.id == toSave.id)
    if (findIndex == -1) {
        serviceObject.nodes.push(toSave as NodeProps)
    } else {
        serviceObject.nodes[findIndex] = toSave as NodeProps
    }
    fs.writeFileSync( servicesPath + serviceName, JSON.stringify( serviceObject ))
    return serviceObject
}






































































function saveNode (_evt: IpcMainInvokeEvent, serviceName: string, props: NodeProps ) {
    const json = objectTemplate(serviceName)
    const findIndex = json.nodes.findIndex(node => node.id == props.id)
    if (props.type == "CodeNode") {
        const path = `/codes/${serviceName}/${props.data.name}.ts`
        fs.writeFileSync(`./project/${path}`, props.data.value ?? '')
        props.data.value = undefined
        props.data.path = path
    }
    if (findIndex == -1) {
        json.nodes.push(props)
    } else {
        json.nodes[findIndex] = props
    }
    fs.writeFileSync(templatePath(serviceName), JSON.stringify(json))
    return json
}

function getTemplate(_evt: IpcMainInvokeEvent, serviceName: string): IObjectTemplate {
    return { templateName: serviceName, template: objectTemplate(serviceName)}
}

function getAllObjectTemplates(): IObjectTemplate[] {
    // lee directorio de los templates, obtiene el nombre y retorna nombre y objeto del json
    const names = fs.readdirSync('./project/services')
                    .map(template => {
                        const templateName = template.split('template-')[1].slice(0,-5)
                        const templateJson = objectTemplate(templateName)
                        return { templateName, template: templateJson }
                    })
    return names
}

function saveConnection (_evt: IpcMainInvokeEvent, serviceName: string, props: EdgeProps ) {
    const json = objectTemplate(serviceName)
    const findIndex = json.connections.findIndex(edge => edge.id == props.id)
    if ( findIndex == -1 ) {
        json.connections.push(props)
    }
    fs.writeFileSync(templatePath(serviceName), JSON.stringify(json))
    return json
}

function deleteNodes (_event: IpcMainInvokeEvent, serviceName: string, nodes: Node[]): IObjectTemplate {
    const json = objectTemplate(serviceName)
    nodes.forEach(node => {
        const findIndexNode = json.nodes.findIndex(n => n.id == node.id)
        if (findIndexNode == -1) return
        json.nodes.splice(findIndexNode, 1)
        json.connections = json.connections.filter(edge => edge.source != node.id && edge.target != node.id)
    })
    fs.writeFileSync(templatePath(serviceName), JSON.stringify(json))
    return { templateName: serviceName, template: json }
}

function deleteEdges (_evt: IpcMainInvokeEvent, serviceName: string, edges: Edge[]): IObjectTemplate {
    const json = objectTemplate(serviceName)
    edges.forEach(edge => {
        const findIndex = json.connections.findIndex(e => e.id == edge.id)
        if (findIndex == -1) return
        json.connections.splice(findIndex, 1)
    })
    fs.writeFileSync(templatePath(serviceName), JSON.stringify(json))
    return { template: json, templateName: serviceName }
}

function getCodeNodeValue (_evt: IpcMainInvokeEvent, serviceName: string, codeName: string) {
    return fs.readFileSync(`./project/codes/${serviceName}/${codeName}.ts`).toString()
}

function templatePath(name: string) { return `./project/services/template-${name}.json` }

function objectTemplate(name: string) {
    const jsonPath = templatePath(name)
    const json = JSON.parse ( fs.readFileSync(jsonPath).toString() ) as ITemplateJson
    return json
}










































export function init () {
    fs.existsSync('./project') == false && fs.mkdirSync('./project')
    fs.existsSync(modelsPath) == false && fs.mkdirSync('./project/models')
    fs.existsSync(servicesPath) == false && fs.mkdirSync(servicesPath)
    fs.existsSync(codesPath) == false && fs.mkdirSync(codesPath)
}

export const sends = {
}

export const invokes = {
    'models:create': createModel,
    'models:save': saveModel,
    'models:all': getAllModels,
    'models:rename': renameModel,
    'models:delete': deleteModel,

    'services:create': createService,
    'services:all': getAllServices,
    'services:rename': renameService,
    'services:delete': deleteService,

    'nodes:save-request': saveRequestNode,
    'nodes:save-response': saveResponseNode,
    'nodes:save-condition': saveConditionNode,

    'services:save-node': saveNode,
    'services:save-edge': saveConnection,
    'services:delete-edges': deleteEdges,
    'services:delete-nodes': deleteNodes,
    'services:get-code-node-value': getCodeNodeValue,

    'services:get-template': getTemplate,
    'services:get-all-templates': getAllObjectTemplates,
}