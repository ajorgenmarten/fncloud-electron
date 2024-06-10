import { IpcMainInvokeEvent } from 'electron'
import fs from 'fs'
import { ModelData, ServiceData } from '../../src/app/types'
import { Edge, Node, NodeProps } from 'reactflow'

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

function savePosition (_evt: IpcMainInvokeEvent, service: string, props: NodeProps) {
    const serviceName = `template-${service}.json`
    const { xPos, yPos } = props
    const serviceObject = JSON.parse( fs.readFileSync( servicesPath + serviceName ). toString() ) as ServiceData
    const findIndex = serviceObject.nodes.findIndex(node => node.id == props.id)
    serviceObject.nodes[findIndex].xPos = xPos
    serviceObject.nodes[findIndex].yPos = yPos
    fs.writeFileSync( servicesPath + serviceName, JSON.stringify( serviceObject ) )
    return serviceObject
}

function saveEdge (_evt: IpcMainInvokeEvent, service: string, props: Edge) {
    const serviceName = `template-${service}.json`
    const serviceObject = JSON.parse( fs.readFileSync( servicesPath + serviceName ). toString() ) as ServiceData
    serviceObject.edges.push(props)
    fs.writeFileSync(servicesPath + serviceName, JSON.stringify( serviceObject ))
    return serviceObject
}

function deleteEdges (_evt: IpcMainInvokeEvent, service: string, edges: Edge[]) {
    const serviceName = `template-${service}.json`
    const serviceObject = JSON.parse( fs.readFileSync( servicesPath + serviceName ).toString() ) as ServiceData
    edges.forEach(edge => {
        const findIndex = serviceObject.edges.findIndex(e => e.id == edge.id)
        serviceObject.edges.splice(findIndex, 1)
    })
    fs.writeFileSync(servicesPath + serviceName, JSON.stringify( serviceObject ))
    return serviceObject
}

function deleteNodes (_evt: IpcMainInvokeEvent, service: string, nodes: Node[]) {
    const serviceName = `template-${service}.json`
    const serviceObject = JSON.parse( fs.readFileSync( servicesPath + serviceName ).toString() ) as ServiceData
    nodes.forEach(node => {
        const findIndex = serviceObject.nodes.findIndex(n => node.id == n.id)
        serviceObject.nodes.splice(findIndex, 1)
    })
    fs.writeFileSync(servicesPath + serviceName, JSON.stringify( serviceObject ))
    return serviceObject
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
    'nodes:save-position': savePosition,
    'nodes:save-connection': saveEdge,
    'nodes:delete-connections': deleteEdges,
    'nodes:delete-nodes': deleteNodes,
}