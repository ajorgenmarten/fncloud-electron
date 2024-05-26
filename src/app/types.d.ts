import { ServiceJson } from "../../electron/src/types"

export interface AppProviderProps {
    children: React.ReactNode
}

export interface ModelData {
    name: string,
    data: string,
    path: string,
}

export interface ServiceData {
    name: string,
}

export interface ServiceTemplate {
    name: string
    template: ServiceJson
}


/////////// endpoints

interface FlowNode {
    id: string
    xPos: number
    yPos: number
    connectTo: string|null
}
export interface EndPointNode extends FlowNode {
    path: string
    method: "GET" | "POST" | "PUT" | "DELETE"
}

export interface IfNode extends FlowNode {
    elseConnectTo: string|null
}

export interface ResponseNode extends FlowNode {
    success: NodeResponsePropsData['success']
    data?: any
}

export interface CodeNode extends FlowNode {
    codePath: string
}

export interface NodePropsData {
    indicator: boolean
}


// node porps
export interface NodeRequestPropsData extends NodePropsData {
    path: string
    method: "GET" | "POST" | "PUT" | "DELETE"
}

export interface NodeResponsePropsData extends NodePropsData {
    success: 'ok' | 'bad'
}