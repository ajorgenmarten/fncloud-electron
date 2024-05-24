import { IpcMainInvokeEvent } from 'electron'
import fs from 'fs'
import { EndPointNode, ModelData, ServiceData, ServiceTemplate } from '../../src/app/types'
import { ServiceJson } from './types'

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
    fs.writeFileSync(`./project/services/template-${name}.json`, '{ "endPoints": [] }')
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

function saveEndPoint (_evt: IpcMainInvokeEvent, serviceName: string, id: string, xPos:number, yPos:number, path: string, method: EndPointNode['method']) {
    const json = objectTemplate(serviceName)
    const findIndex = json.endPoints.findIndex( ep => ep.id == id )
    if ( findIndex == -1 ) {
        const endpoint: EndPointNode = { connectTo: null, id, path, xPos, yPos, method }
        json.endPoints.push(endpoint)
    } else {
        json.endPoints[findIndex].path = path
        json.endPoints[findIndex].method = method
        json.endPoints[findIndex].xPos = xPos
        json.endPoints[findIndex].yPos = yPos

    }
    fs.writeFileSync(templatePath(serviceName), JSON.stringify(json))
    return json
}

function getTemplate(_evt: IpcMainInvokeEvent, serviceName: string) {
    return objectTemplate(serviceName)
}

function getAllObjectTemplates() {
    // lee directorio de los templates, obtiene el nombre y retorna nombre y objeto del json
    const names = fs.readdirSync('./project/services')
                    .map(template => {
                        const name = template.split('template-')[1].slice(0,-5)
                        const obj = objectTemplate(name)
                        return { name, template: obj } as ServiceTemplate
                    })
    return names
}

function templatePath(name: string) { return `./project/services/template-${name}.json` }

function objectTemplate(name: string) {
    const jsonPath = templatePath(name)
    const json = JSON.parse ( fs.readFileSync(jsonPath).toString() ) as ServiceJson
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

    'services:create-endpoint': saveEndPoint,
    'services:get-template': getTemplate,
    'services:get-all-templates': getAllObjectTemplates,
}