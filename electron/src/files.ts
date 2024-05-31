import { IpcMainInvokeEvent } from 'electron'
import fs from 'fs'
import { INodeData, ITemplateJson, ModelData, ServiceData } from '../../src/app/types'
import { Edge, EdgeProps, Node, NodeProps } from 'reactflow'
import { IObjectTemplate } from './types'

function getAllModels ():ModelData[] {
    const models = fs.readdirSync('./project/models').map(model => model.split('.')[0])
    return models.map(getModelData)
}

function getModelData (name: string):ModelData {
    return {
        data: fs.readFileSync('./project/models/' + name + '.d.ts').toString(),
        name: name,
        path: 'file:///models/' + name + '.d.ts'
    }
}

function createModel (_evt:IpcMainInvokeEvent ,name: string): ModelData|false {
    if (!existModel(name)) {
        fs.writeFileSync('./project/models/' + name + '.d.ts', '')
        return { data: '', name, path: 'file:///models/' + name + '.d.ts' }
    }
    else return false
}

function updateModelData (_evt:IpcMainInvokeEvent, name: string, data: string) {
    fs.writeFileSync('./project/models/' + name + '.d.ts', data)
}

function existModel (name: string) {
    return fs.existsSync('./project/models/' + name + '.d.ts')
}

function renameModel (_evt: IpcMainInvokeEvent, name: string, newName: string) {
    const path = './project/models/'
    fs.renameSync(path + name + '.d.ts', path + newName + '.d.ts')
}

function deleteModel (_evt: IpcMainInvokeEvent, name: string) {
    fs.unlinkSync('./project/models/' + name + '.d.ts')
}


































function createService (_evt: IpcMainInvokeEvent, name: string) {
    fs.writeFileSync(`./project/services/template-${name}.json`, JSON.stringify({
        nodes: [],
        connections: [],
    }))
    return true
}

function getAllServices (): ServiceData[] {
    return fs.readdirSync('./project/services/')
            .map(service => {
                const name = service
                .substring('template-'.length)
                .split('.')[0]
                return { name }
            })
}

function renameService (_evt: IpcMainInvokeEvent, name: string, newName: string) {
    fs.renameSync(`./project/services/template-${name}.json`, `./project/services/template-${newName}.json`)
}

function deleteService (_evt: IpcMainInvokeEvent, name: string) {
    fs.unlinkSync(`./project/services/template-${name}.json`)
}




























































function saveNode (_evt: IpcMainInvokeEvent, serviceName: string, props: NodeProps<INodeData> ) {
    console.log('saving-node', props.id)
    const json = objectTemplate(serviceName)
    const findIndex = json.nodes.findIndex(node => node.id == props.id)
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

function templatePath(name: string) { return `./project/services/template-${name}.json` }

function objectTemplate(name: string) {
    const jsonPath = templatePath(name)
    const json = JSON.parse ( fs.readFileSync(jsonPath).toString() ) as ITemplateJson
    return json
}










































export function init () {
    fs.existsSync('./project') == false && fs.mkdirSync('./project')
    fs.existsSync('./project/models') == false && fs.mkdirSync('./project/models')
    fs.existsSync('./project/services') == false && fs.mkdirSync('./project/services')
}

export const sends = {
}

export const invokes = {
    'models:create': createModel,
    'models:get-all': getAllModels,
    'models:get-data': getModelData,
    'models:update-data': updateModelData,
    'models:rename': renameModel,
    'models:delete': deleteModel,

    'services:create': createService,
    'services:get-all': getAllServices,
    'services:rename': renameService,
    'services:delete': deleteService,

    'services:save-node': saveNode,
    'services:save-connection': saveConnection,
    'services:delete-connection': deleteEdges,
    'services:delete-nodes': deleteNodes,

    'services:get-template': getTemplate,
    'services:get-all-templates': getAllObjectTemplates,
}