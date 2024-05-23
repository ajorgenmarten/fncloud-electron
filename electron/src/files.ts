import { IpcMainInvokeEvent } from 'electron'
import fs from 'fs'
import { ModelData, ServiceData } from '../../src/app/types'

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
    fs.writeFileSync(`./project/services/template-${name}.json`, '')
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
}