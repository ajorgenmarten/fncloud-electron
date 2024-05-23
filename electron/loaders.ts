import { ipcMain } from "electron";

export function loadInvokes (handlers: any) {
    for(const handler in handlers) {
        ipcMain.handle(handler, handlers[handler])
    }
}

export function loadEvents (events: any ) {
    for(const eventName in events ) {
        ipcMain.on(eventName, events[eventName])
    }
}