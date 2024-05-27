import { EdgeProps, NodeProps } from "reactflow"
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


export interface ITemplateJson {
    nodes: NodeProps<INodeData>[]
    connections: EdgeProps[]
}
// TIPO DE DATOS DE NODOS

interface INodeData {
    indicator?: boolean
}
export interface IRequestNodeData extends INodeData {
    path: string
    method: "GET" | "POST" | "PUT" | "DELETE"
}

export interface IResponseNodeData extends INodeData {
    success: "OK" | "BAD"
}